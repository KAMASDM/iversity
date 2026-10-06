/** Progress helpers shared by the dashboard and progress pages. */

const keyOf = (chapter, lesson) => `${chapter.id}_${lesson.id}`;

export function courseProgress(course, enrollment) {
  const chapters = course?.chapters || [];
  const done = new Set(enrollment?.completedLessons || []);
  let total = 0;
  let completed = 0;
  let next = null;

  for (const chapter of chapters) {
    for (const lesson of chapter.lessons || []) {
      total++;
      if (done.has(keyOf(chapter, lesson))) completed++;
      else if (!next) next = { chapter, lesson };
    }
  }

  // Prefer the lesson the student was last looking at
  const last = enrollment?.lastPosition;
  if (last) {
    const chapter = chapters.find(c => c.id === last.chapterId);
    const lesson = chapter?.lessons?.find(l => l.id === last.lessonId);
    if (chapter && lesson && !done.has(keyOf(chapter, lesson))) next = { chapter, lesson };
  }

  const pct = total ? Math.round((completed / total) * 100) : Math.round(enrollment?.progress || 0);
  const hasExam = chapters.some(ch => ch.quiz?.questions?.length);
  const certified = Boolean(enrollment?.certificateId);
  const examReady = total > 0 && completed === total && hasExam && !certified;

  return { total, completed, pct, next, hasExam, certified, examReady };
}

const toMillis = (v) => (v?.toMillis ? v.toMillis() : v ? new Date(v).getTime() || 0 : 0);

export const lastActivity = (enrollment) =>
  Math.max(toMillis(enrollment.lastAccessedAt), toMillis(enrollment.updatedAt), toMillis(enrollment.enrolledAt));
