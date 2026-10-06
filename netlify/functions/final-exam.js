/**
 * Netlify Function — final-exam
 *
 * Builds, grades and certifies the course final exam on the server so that
 * certificates cannot be forged from the browser (Firestore rules block
 * client writes to `certificates` and to enrollment completion fields).
 *
 * Requires a verified Firebase user and service-account credentials
 * (FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY) for Firestore access.
 *
 * POST /.netlify/functions/final-exam
 *   { action: 'start',  enrollmentId }
 *     → { status: 'ready', attempt, passMark, questions: [{ key, chapterTitle, question, options }] }
 *     → { status: 'locked', remainingLessons }      (lessons not finished)
 *     → { status: 'certified', certificateId, score } (already passed)
 *   { action: 'submit', enrollmentId, attempt, answers: { [key]: optionIndex } }
 *     → { score, passed, correct, total, passMark, breakdown[], review[], certificateId? }
 */

const crypto = require('crypto');
const {
  HttpError, getAdmin, hasAdminCredentials, requireUser, rateLimit, parseBody, withHandler,
} = require('../lib/server.js');

const PASS_MARK = 70;
const MAX_QUESTIONS = 20;

// ── Deterministic exam selection (same seed → same questions) ────────────────
function seededRandom(seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildExam(course, seed) {
  const pool = [];
  for (const chapter of course.chapters || []) {
    for (const q of chapter.quiz?.questions || []) {
      if (Array.isArray(q.options) && Number.isInteger(q.correctAnswer)) {
        pool.push({
          key: `${chapter.id}::${q.id}`,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
        });
      }
    }
  }

  const rand = seededRandom(seed);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, MAX_QUESTIONS);
}

function remainingLessons(course, enrollment) {
  const done = new Set(enrollment.completedLessons || []);
  let remaining = 0;
  for (const chapter of course.chapters || []) {
    for (const lesson of chapter.lessons || []) {
      if (!done.has(`${chapter.id}_${lesson.id}`)) remaining++;
    }
  }
  return remaining;
}

async function loadContext(db, uid, enrollmentId) {
  if (typeof enrollmentId !== 'string' || !enrollmentId) throw new HttpError(400, 'enrollmentId is required');

  const enrollmentRef = db.collection('enrollments').doc(enrollmentId);
  const enrollmentSnap = await enrollmentRef.get();
  if (!enrollmentSnap.exists) throw new HttpError(404, 'Enrollment not found');
  const enrollment = enrollmentSnap.data();
  if (enrollment.studentId !== uid) throw new HttpError(403, 'This is not your enrollment');

  const courseSnap = await db.collection('courses').doc(enrollment.courseId).get();
  if (!courseSnap.exists) throw new HttpError(404, 'Course not found');

  return { enrollmentRef, enrollment, course: { id: courseSnap.id, ...courseSnap.data() } };
}

exports.handler = withHandler(async (event) => {
  const user = await requireUser(event);
  rateLimit(`exam:${user.uid}`, { limit: 10, windowMs: 60_000 });

  if (!hasAdminCredentials()) {
    throw new HttpError(503, 'Final exams are not configured yet. Please contact the course administrator.');
  }

  const admin = getAdmin();
  const db = admin.firestore();
  const body = parseBody(event);
  const { enrollmentRef, enrollment, course } = await loadContext(db, user.uid, body.enrollmentId);

  if (enrollment.certificateId) {
    return { status: 'certified', certificateId: enrollment.certificateId, score: enrollment.examScore ?? null };
  }

  const remaining = remainingLessons(course, enrollment);
  if (remaining > 0) return { status: 'locked', remainingLessons: remaining };

  const attempt = enrollment.examAttempts || 0;
  const exam = buildExam(course, `${body.enrollmentId}:${attempt}`);
  if (exam.length === 0) throw new HttpError(409, 'This course does not have a final exam yet.');

  // ── start ───────────────────────────────────────────────────────────────────
  if (body.action === 'start') {
    return {
      status: 'ready',
      attempt,
      passMark: PASS_MARK,
      courseTitle: course.title,
      questions: exam.map(({ key, chapterTitle, question, options }) => ({ key, chapterTitle, question, options })),
    };
  }

  if (body.action !== 'submit') throw new HttpError(400, 'Unknown action');

  // ── submit ──────────────────────────────────────────────────────────────────
  if (body.attempt !== attempt) {
    throw new HttpError(409, 'This exam attempt has expired — please restart the exam.');
  }
  const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};

  let correct = 0;
  const byChapter = new Map();
  const review = exam.map(q => {
    const yourAnswer = Number.isInteger(answers[q.key]) ? answers[q.key] : null;
    const isCorrect = yourAnswer === q.correctAnswer;
    if (isCorrect) correct++;
    const entry = byChapter.get(q.chapterId) || { chapterTitle: q.chapterTitle, correct: 0, total: 0 };
    entry.total++;
    if (isCorrect) entry.correct++;
    byChapter.set(q.chapterId, entry);
    return { key: q.key, yourAnswer, correctAnswer: q.correctAnswer, isCorrect, explanation: q.explanation };
  });

  const total = exam.length;
  const score = Math.round((correct / total) * 100);
  const passed = score >= PASS_MARK;
  const breakdown = [...byChapter.values()];
  const now = admin.firestore.FieldValue.serverTimestamp();

  const userSnap = passed ? await db.collection('users').doc(user.uid).get() : null;
  const certRef = passed ? db.collection('certificates').doc() : null;

  await db.runTransaction(async (tx) => {
    // Re-check inside the transaction so two concurrent submits can't both certify
    const fresh = (await tx.get(enrollmentRef)).data();
    if ((fresh.examAttempts || 0) !== attempt || fresh.certificateId) {
      throw new HttpError(409, 'This exam attempt was already submitted.');
    }

    tx.set(db.collection('exams').doc(), {
      studentId: user.uid,
      enrollmentId: body.enrollmentId,
      courseId: course.id,
      attempt,
      score,
      passed,
      correct,
      total,
      breakdown,
      submittedAt: now,
    });

    const enrollmentUpdate = {
      examAttempts: attempt + 1,
      bestExamScore: Math.max(score, fresh.bestExamScore || 0),
      lastExamAt: now,
    };

    if (passed) {
      tx.set(certRef, {
        id: certRef.id,
        enrollmentId: body.enrollmentId,
        studentId: user.uid,
        studentName: userSnap.data()?.displayName || user.name || user.email || 'Student',
        courseId: course.id,
        courseName: course.title,
        examScore: score,
        issueDate: now,
        certificateNumber: `IV-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      });
      Object.assign(enrollmentUpdate, {
        status: 'completed',
        completedAt: now,
        certificateId: certRef.id,
        examScore: score,
        progress: 100,
      });
    }

    tx.update(enrollmentRef, enrollmentUpdate);
  });

  return {
    score, passed, correct, total, passMark: PASS_MARK, breakdown, review,
    certificateId: certRef?.id || null,
  };
});
