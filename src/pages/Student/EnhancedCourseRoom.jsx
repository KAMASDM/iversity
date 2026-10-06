import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import StudentNotes from '../../components/StudentNotes';
import StudentTodoList from '../../components/StudentTodoList';
import Gamification from '../../components/Gamification';
import CourseOutline from '../../components/course/CourseOutline';
import ChapterQuiz from '../../components/course/ChapterQuiz';
import LessonSlides from '../../components/course/LessonSlides';
import FloatingVideoPlayer from '../../components/course/FloatingVideoPlayer';
import { Blocks } from '../../components/course/Markdown';
import Loading from '../../components/Loading';
import {
  getEnrollment,
  getCourse,
  getCurriculum,
  updateEnrollmentProgress,
  awardPoints,
  updateStreak,
  awardBadge,
  saveQuizResult,
  getCoursePptFiles,
} from '../../services/firestoreService';
import { generateAdaptiveQuiz } from '../../services/aiService';
import { parseBlocks, headingsOf, estimateMinutes } from '../../utils/markdown';
import { useAuthStore, useBuddyStore, useEnrollmentStore } from '../../store';
import { toast } from 'react-toastify';
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Brain, CheckCircle2, ChevronLeft, ChevronRight,
  Clock, Download, File, FileText, GraduationCap, HelpCircle, List, MessageCircle,
  PartyPopper, Presentation, Sparkles, Target, Trophy, X, Youtube,
} from 'lucide-react';

const MODE_KEY = 'iv_lesson_mode';
const lessonKey = (chapter, lesson) => `${chapter.id}_${lesson.id}`;

const isTyping = (el) =>
  el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);

const youtubeEmbedUrl = (rawUrl) => {
  try {
    const u = new URL(rawUrl);
    const id = u.searchParams.get('v') || u.pathname.replace(/^\/(shorts\/|embed\/)?/, '').split('/')[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
};

// Resume at the saved position, else the first unfinished lesson
function initialPosition(chapters, enrollment) {
  const last = enrollment.lastPosition;
  if (last) {
    const ci = chapters.findIndex(c => c.id === last.chapterId);
    const li = ci >= 0 ? (chapters[ci].lessons || []).findIndex(l => l.id === last.lessonId) : -1;
    if (ci >= 0 && li >= 0) return { ci, li };
  }
  const done = new Set(enrollment.completedLessons || []);
  for (let ci = 0; ci < chapters.length; ci++) {
    const lessons = chapters[ci].lessons || [];
    for (let li = 0; li < lessons.length; li++) {
      if (!done.has(lessonKey(chapters[ci], lessons[li]))) return { ci, li };
    }
  }
  return { ci: 0, li: 0 };
}

const EnhancedCourseRoom = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toggleBuddy, askBuddy, setCourseContext } = useBuddyStore();
  const { setCurrentEnrollment } = useEnrollmentStore();

  const [enrollment, setEnrollment] = useState(null);
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [pptFiles, setPptFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [position, setPosition] = useState({ ci: 0, li: 0 });
  const [view, setView] = useState('lesson');         // 'lesson' | 'quiz' | 'milestone'
  const [milestone, setMilestone] = useState(null);    // { type: 'chapter', ci } | { type: 'course' }
  const [quiz, setQuiz] = useState(null);              // { ci, questions }
  const [quizLoading, setQuizLoading] = useState(false);
  const [tab, setTab] = useState('lesson');
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem(MODE_KEY) || 'read'; } catch { return 'read'; }
  });
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [videoPlayer, setVideoPlayer] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const articleRef = useRef(null);
  const savedPositionRef = useRef(null);

  // ── Load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        const enrollmentData = await getEnrollment(enrollmentId);
        if (!enrollmentData || enrollmentData.studentId !== user.uid) throw new Error('Enrollment not found');
        const courseData = await getCourse(enrollmentData.courseId);
        if (!courseData) throw new Error('Course not found');
        if (cancelled) return;

        setEnrollment(enrollmentData);
        setCourse(courseData);
        setPosition(initialPosition(courseData.chapters || [], enrollmentData));
        savedPositionRef.current = enrollmentData.lastPosition || null;
        setCurrentEnrollment({ ...enrollmentData, courseName: courseData.title });

        // Non-critical extras load in the background
        getCoursePptFiles(enrollmentData.courseId).then(f => !cancelled && setPptFiles(f)).catch(() => {});
        getCurriculum(enrollmentId).then(c => !cancelled && setCurriculum(c?.curriculum || null)).catch(() => {});
        updateStreak(user.uid, enrollmentData.courseId).catch(() => {});
      } catch (error) {
        console.error('Error loading course:', error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [enrollmentId, user, setCurrentEnrollment]);

  useEffect(() => () => setCurrentEnrollment(null), [setCurrentEnrollment]);

  // ── Derived state ──────────────────────────────────────────────────────────
  const chapters = useMemo(() => course?.chapters || [], [course]);
  const currentChapter = chapters[position.ci];
  const currentLesson = currentChapter?.lessons?.[position.li];

  const completedSet = useMemo(() => new Set(enrollment?.completedLessons || []), [enrollment]);
  const isLessonCompleted = useCallback(
    (chapterId, lessonId) => completedSet.has(`${chapterId}_${lessonId}`),
    [completedSet]
  );

  const allLessonKeys = useMemo(
    () => chapters.flatMap(ch => (ch.lessons || []).map(l => lessonKey(ch, l))),
    [chapters]
  );
  const totalLessons = allLessonKeys.length;
  const completedCount = allLessonKeys.filter(k => completedSet.has(k)).length;
  const progressPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
  const remainingLessons = totalLessons - completedCount;
  const hasExamQuestions = chapters.some(ch => ch.quiz?.questions?.length);

  const bestQuizScore = useCallback((chapterId) => {
    const scores = (enrollment?.quizResults || []).filter(r => r.moduleId === chapterId).map(r => r.score);
    return scores.length ? Math.round(Math.max(...scores)) : null;
  }, [enrollment]);

  const blocks = useMemo(() => parseBlocks(currentLesson?.content || ''), [currentLesson]);
  const readingBlocks = useMemo(
    () => (blocks[0]?.type === 'heading' && blocks[0].level === 1 ? blocks.slice(1) : blocks),
    [blocks]
  );
  const sections = useMemo(() => headingsOf(readingBlocks), [readingBlocks]);
  const isFirstLesson = position.ci === 0 && position.li === 0;
  const isLastLesson = position.ci === chapters.length - 1 && position.li === (currentChapter?.lessons?.length || 1) - 1;
  const currentDone = currentChapter && currentLesson ? isLessonCompleted(currentChapter.id, currentLesson.id) : false;

  // ── Keep Buddy in sync with the lesson on screen ───────────────────────────
  useEffect(() => {
    if (course && currentChapter && currentLesson) {
      setCourseContext({
        courseName: course.title,
        currentChapter: currentChapter.title,
        currentLesson: currentLesson.title,
        currentLessonContent: currentLesson.content ? currentLesson.content.slice(0, 1200) : null,
        progressPercentage: progressPct,
      });
    }
  }, [course, currentChapter, currentLesson, progressPct, setCourseContext]);

  // ── Remember where the student is (debounced) ──────────────────────────────
  useEffect(() => {
    if (!enrollment || !currentChapter || !currentLesson) return;
    const next = { chapterId: currentChapter.id, lessonId: currentLesson.id };
    const saved = savedPositionRef.current;
    if (saved?.chapterId === next.chapterId && saved?.lessonId === next.lessonId) return;

    const timer = setTimeout(() => {
      savedPositionRef.current = next;
      updateEnrollmentProgress(enrollmentId, { lastPosition: next, lastAccessedAt: new Date().toISOString() })
        .catch(() => { savedPositionRef.current = saved; });
    }, 1500);
    return () => clearTimeout(timer);
  }, [enrollment, currentChapter, currentLesson, enrollmentId]);

  // ── Reading progress for long lessons ──────────────────────────────────────
  useEffect(() => {
    if (mode !== 'read' || view !== 'lesson' || tab !== 'lesson') return;
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const visible = window.innerHeight - rect.top;
      setReadProgress(Math.max(0, Math.min(1, visible / Math.max(rect.height, 1))));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mode, view, tab, position]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goTo = useCallback((ci, li) => {
    setPosition({ ci, li });
    setView('lesson');
    setMilestone(null);
    setTab('lesson');
    setOutlineOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goNext = useCallback(() => {
    const { ci, li } = position;
    if (li < (chapters[ci]?.lessons?.length || 0) - 1) goTo(ci, li + 1);
    else if (ci < chapters.length - 1) goTo(ci + 1, 0);
  }, [position, chapters, goTo]);

  const goPrev = useCallback(() => {
    const { ci, li } = position;
    if (li > 0) goTo(ci, li - 1);
    else if (ci > 0) goTo(ci - 1, Math.max((chapters[ci - 1].lessons?.length || 1) - 1, 0));
  }, [position, chapters, goTo]);

  const firstIncomplete = useCallback(() => {
    for (let ci = 0; ci < chapters.length; ci++) {
      const lessons = chapters[ci].lessons || [];
      for (let li = 0; li < lessons.length; li++) {
        if (!completedSet.has(lessonKey(chapters[ci], lessons[li]))) return { ci, li };
      }
    }
    return null;
  }, [chapters, completedSet]);

  // Arrow keys move between lessons in reading mode (slides use them for slides)
  useEffect(() => {
    if (mode !== 'read' || view !== 'lesson' || tab !== 'lesson') return;
    const onKey = (e) => {
      if (isTyping(document.activeElement) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, view, tab, goNext, goPrev]);

  const changeMode = (next) => {
    setMode(next);
    try { localStorage.setItem(MODE_KEY, next); } catch { /* ignore */ }
  };

  // ── Lesson completion ──────────────────────────────────────────────────────
  const markComplete = async () => {
    if (!currentChapter || !currentLesson || completing) return;
    if (currentDone) { goNext(); return; }

    const key = lessonKey(currentChapter, currentLesson);
    const updated = [...(enrollment.completedLessons || []).filter(k => k !== key), key];
    const progress = totalLessons ? Math.round((updated.filter(k => allLessonKeys.includes(k)).length / totalLessons) * 100) : 0;

    setCompleting(true);
    try {
      await updateEnrollmentProgress(enrollmentId, { completedLessons: updated, progress });
      setEnrollment(prev => ({ ...prev, completedLessons: updated, progress }));
      toast.success('Lesson complete · +10 XP', { autoClose: 1800 });

      awardPoints(user.uid, course.id, 10, 'Lesson Completed', `Finished: ${currentLesson.title}`)
        .then(() => (updated.length === 1 ? awardBadge(user.uid, course.id, 'first_lesson') : null))
        .catch(() => {});

      const doneSet = new Set(updated);
      const chapterDone = (currentChapter.lessons || []).every(l => doneSet.has(lessonKey(currentChapter, l)));
      const courseDone = allLessonKeys.every(k => doneSet.has(k));

      if (courseDone) {
        setMilestone({ type: 'course' });
        setView('milestone');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (chapterDone && currentChapter.quiz?.enabled && (bestQuizScore(currentChapter.id) ?? 0) < 70) {
        setMilestone({ type: 'chapter', ci: position.ci });
        setView('milestone');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        goNext();
      }
    } catch (error) {
      console.error(error);
      toast.error("Couldn't save your progress — please try again");
    } finally {
      setCompleting(false);
    }
  };

  // ── Chapter quiz ───────────────────────────────────────────────────────────
  const startQuiz = async (ci) => {
    const chapter = chapters[ci];
    if (!chapter?.quiz?.enabled) return;
    setOutlineOpen(false);
    setTab('lesson');

    if (chapter.quiz.questions?.length) {
      setQuiz({ ci, questions: chapter.quiz.questions });
      setView('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setQuizLoading(true);
    try {
      const data = await generateAdaptiveQuiz(course, chapter, enrollment.quizResults || []);
      setQuiz({ ci, questions: data.questions });
      setView('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(error.message || "Couldn't load the quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  const submitQuiz = async ({ score, answers, correct, total }) => {
    const chapter = chapters[quiz.ci];
    try {
      await saveQuizResult(enrollmentId, user.uid, {
        moduleId: chapter.id,
        chapterId: chapter.id,
        score,
        answers,
        totalQuestions: total,
        correctAnswers: correct,
      });
      setEnrollment(prev => ({
        ...prev,
        quizResults: [...(prev.quizResults || []), { moduleId: chapter.id, score, submittedAt: new Date().toISOString() }],
      }));

      const pointsEarned = Math.round(score / 2);
      awardPoints(user.uid, course.id, pointsEarned, 'Quiz Completed', `Scored ${score}% on ${chapter.title}`)
        .then(() => (score === 100 ? awardBadge(user.uid, course.id, 'quiz_master') : null))
        .catch(() => {});
      return { pointsEarned };
    } catch (error) {
      console.error(error);
      toast.error("Couldn't save your quiz result");
      return {};
    }
  };

  const afterQuiz = () => {
    const next = firstIncomplete();
    if (!next && hasExamQuestions) {
      navigate(`/student/exam/${enrollmentId}`);
    } else if (next) {
      goTo(next.ci, next.li);
    } else {
      goTo(quiz.ci, 0);
    }
  };

  const openExam = () => {
    if (enrollment?.certificateId) navigate('/student/certificates');
    else navigate(`/student/exam/${enrollmentId}`);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return <StudentLayout><Loading fullScreen={false} label="Opening your course…" /></StudentLayout>;
  }

  if (loadError || !course) {
    return (
      <StudentLayout>
        <EmptyState
          icon={BookOpen}
          title="We couldn't open this course"
          body="It may have been removed, or the link is wrong."
          action={<Link to="/student/dashboard" className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/15">Back to dashboard</Link>}
        />
      </StudentLayout>
    );
  }

  if (chapters.length === 0) {
    return (
      <StudentLayout>
        <CurriculumPlan course={course} curriculum={curriculum} onAskBuddy={toggleBuddy} />
      </StudentLayout>
    );
  }

  const examInfo = hasExamQuestions
    ? { unlocked: remainingLessons === 0, certified: Boolean(enrollment.certificateId), remaining: remainingLessons, onOpen: openExam }
    : null;

  const outline = (
    <CourseOutline
      chapters={chapters}
      currentChapterIndex={view === 'quiz' && quiz ? quiz.ci : position.ci}
      currentLessonIndex={position.li}
      activeView={view === 'quiz' ? 'quiz' : 'lesson'}
      isLessonCompleted={isLessonCompleted}
      bestQuizScore={bestQuizScore}
      onSelectLesson={goTo}
      onStartQuiz={startQuiz}
      exam={examInfo}
    />
  );

  const minutes = currentLesson?.estimatedMinutes || estimateMinutes(currentLesson?.content);
  const tabs = [
    { id: 'lesson', icon: BookOpen, label: 'Lesson' },
    { id: 'notes', icon: FileText, label: 'Notes' },
    { id: 'tasks', icon: Target, label: 'Tasks' },
    { id: 'progress', icon: Award, label: 'Progress' },
    { id: 'resources', icon: Download, label: 'Resources', count: pptFiles.length },
  ];

  return (
    <StudentLayout>
      {/* ── Course header ─────────────────────────────────────────────────── */}
      <header className="sticky top-14 lg:top-16 z-20 border-b border-white/[0.07] bg-gray-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
          <Link to="/student/dashboard" className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white" aria-label="Back to dashboard">
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm sm:text-base font-semibold text-white">{course.title}</h1>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1.5 w-28 sm:w-44 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-[11px] tabular-nums text-gray-400">{progressPct}% · {completedCount}/{totalLessons} lessons</span>
            </div>
          </div>

          {currentLesson?.content && view === 'lesson' && tab === 'lesson' && (
            <div className="hidden sm:flex rounded-lg bg-white/[0.06] p-0.5" role="group" aria-label="Lesson view">
              {[{ id: 'read', icon: BookOpen, label: 'Read' }, { id: 'slides', icon: Presentation, label: 'Slides' }].map(m => (
                <button
                  key={m.id}
                  onClick={() => changeMode(m.id)}
                  aria-pressed={mode === m.id}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${mode === m.id ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <m.icon size={14} /> {m.label}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={toggleBuddy}
            className="flex items-center gap-1.5 rounded-lg bg-violet-500/15 px-3 py-2 text-xs font-medium text-violet-200 hover:bg-violet-500/25"
          >
            <MessageCircle size={15} /> <span className="hidden sm:inline">Ask Buddy</span>
          </button>
          <button
            onClick={() => setOutlineOpen(true)}
            className="lg:hidden rounded-lg bg-white/[0.06] p-2 text-gray-300 hover:bg-white/10"
            aria-label="Open course outline"
          >
            <List size={18} />
          </button>
        </div>
        {mode === 'read' && view === 'lesson' && tab === 'lesson' && (
          <div className="h-0.5 bg-transparent">
            <div className="h-full bg-blue-400/70 transition-[width] duration-150" style={{ width: `${readProgress * 100}%` }} />
          </div>
        )}
      </header>

      <div className="flex">
        {/* ── Outline (desktop) ───────────────────────────────────────────── */}
        <aside className="hidden lg:block w-80 shrink-0 border-r border-white/[0.07]">
          <div className="sticky top-[7.5rem] max-h-[calc(100vh-7.5rem)] overflow-y-auto p-4">
            {outline}
          </div>
        </aside>

        {/* ── Main column ─────────────────────────────────────────────────── */}
        <div className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-8 lg:pb-12">
          <div className="mx-auto max-w-3xl">
            {view === 'quiz' && quiz ? (
              <ChapterQuiz
                key={`${quiz.ci}-${quiz.questions.length}`}
                chapterTitle={chapters[quiz.ci].title}
                questions={quiz.questions}
                onSubmit={submitQuiz}
                onExit={() => setView('lesson')}
                onContinue={afterQuiz}
                continueLabel={firstIncomplete() ? 'Continue learning' : hasExamQuestions ? 'Go to final exam' : 'Back to course'}
              />
            ) : view === 'milestone' && milestone ? (
              <Milestone
                milestone={milestone}
                chapter={milestone.type === 'chapter' ? chapters[milestone.ci] : null}
                courseTitle={course.title}
                hasExam={hasExamQuestions}
                certified={Boolean(enrollment.certificateId)}
                quizLoading={quizLoading}
                onQuiz={() => startQuiz(milestone.ci)}
                onSkip={() => { const n = firstIncomplete(); if (n) goTo(n.ci, n.li); else setView('lesson'); }}
                onExam={openExam}
                onReview={() => setView('lesson')}
              />
            ) : (
              <>
                {/* Study tool tabs */}
                <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-white/[0.07] bg-white/[0.02] p-1" role="tablist">
                  {tabs.map(({ id, icon: Icon, label, count }) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={tab === id}
                      onClick={() => setTab(id)}
                      className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${tab === id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Icon size={15} />
                      <span className={id === 'lesson' ? '' : 'hidden sm:inline'}>{label}</span>
                      {count > 0 && <span className="rounded-full bg-orange-500/20 px-1.5 text-[10px] text-orange-300">{count}</span>}
                    </button>
                  ))}
                </div>

                {tab === 'lesson' && currentLesson && (
                  <article ref={articleRef} key={`${position.ci}-${position.li}`} className="animate-fade-in">
                    {/* Lesson heading */}
                    <p className="text-xs font-medium uppercase tracking-wider text-blue-300/80">
                      Chapter {position.ci + 1} · {currentChapter.title}
                    </p>
                    <h1 className="mt-2 text-2xl sm:text-[2rem] font-bold leading-tight tracking-tight text-white">
                      {currentLesson.title}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                      <span>Lesson {position.li + 1} of {currentChapter.lessons.length}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {minutes} min</span>
                      {currentDone && <span className="flex items-center gap-1 text-emerald-300"><CheckCircle2 size={13} /> Completed</span>}
                      {currentLesson.youtubeUrl && (
                        <button
                          onClick={() => setVideoPlayer({ url: currentLesson.youtubeUrl, title: currentLesson.title, lessonId: currentLesson.id })}
                          className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 font-medium text-red-200 hover:bg-red-500/20"
                        >
                          <Youtube size={13} /> Watch video
                        </button>
                      )}
                    </div>

                    {/* Mobile view toggle */}
                    {currentLesson.content && (
                      <div className="mt-4 flex sm:hidden rounded-lg bg-white/[0.06] p-0.5 w-fit">
                        {['read', 'slides'].map(m => (
                          <button key={m} onClick={() => changeMode(m)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${mode === m ? 'bg-white/15 text-white' : 'text-gray-400'}`}>{m}</button>
                        ))}
                      </div>
                    )}

                    <div className="mt-6">
                      <LessonMedia lesson={currentLesson} />

                      {currentLesson.content && (
                        mode === 'slides'
                          ? <LessonSlides blocks={blocks} onFinished={markComplete} />
                          : (
                            <>
                              {sections.length >= 3 && <OnThisPage sections={sections} />}
                              <Blocks blocks={readingBlocks} />
                            </>
                          )
                      )}
                    </div>

                    {/* Learn-with-Buddy prompts */}
                    <div className="mt-10 rounded-2xl border border-violet-500/20 bg-violet-500/[0.05] p-4 sm:p-5">
                      <p className="flex items-center gap-2 text-sm font-semibold text-violet-200"><Sparkles size={15} /> Stuck or curious? Ask Buddy</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          { icon: HelpCircle, label: 'Explain it simply', text: `Can you explain the lesson "${currentLesson.title}" in simple terms with an everyday analogy?` },
                          { icon: Brain, label: 'Quiz me on this', text: `Quiz me on the lesson "${currentLesson.title}"` },
                          { icon: Sparkles, label: 'Give me a real example', text: `Give me a concrete real-world example of the main idea in "${currentLesson.title}".` },
                        ].map(p => (
                          <button
                            key={p.label}
                            onClick={() => askBuddy(p.text)}
                            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-200 hover:border-violet-400/40 hover:bg-violet-500/10"
                          >
                            <p.icon size={13} className="text-violet-300" /> {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Lesson footer navigation (desktop) */}
                    <div className="mt-8 hidden lg:flex items-center gap-3 border-t border-white/[0.07] pt-6">
                      <button
                        onClick={goPrev}
                        disabled={isFirstLesson}
                        className="flex items-center gap-1.5 rounded-xl bg-white/[0.06] px-4 py-3 text-sm text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronLeft size={16} /> Previous
                      </button>
                      <div className="flex-1" />
                      <CompleteButton done={currentDone} last={isLastLesson} busy={completing} onClick={markComplete} />
                      {!currentDone && (
                        <button
                          onClick={goNext}
                          disabled={isLastLesson}
                          className="flex items-center gap-1.5 rounded-xl px-3 py-3 text-sm text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          Skip <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                    <p className="mt-3 hidden lg:block text-right text-[11px] text-gray-600">Tip: use ← → to move between lessons</p>
                  </article>
                )}

                {tab === 'notes' && (
                  <StudentNotes courseId={course.id} chapterId={currentChapter?.id} lessonId={currentLesson?.id} />
                )}
                {tab === 'tasks' && <StudentTodoList courseId={course.id} />}
                {tab === 'progress' && <Gamification courseId={course.id} enrollmentId={enrollmentId} />}
                {tab === 'resources' && <Resources files={pptFiles} />}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile bottom action bar ──────────────────────────────────────── */}
      {view === 'lesson' && tab === 'lesson' && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0d1117]/95 backdrop-blur-xl px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-2">
            <button onClick={goPrev} disabled={isFirstLesson} className="rounded-xl bg-white/[0.06] p-3 text-white disabled:opacity-30" aria-label="Previous lesson">
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1">
              <CompleteButton done={currentDone} last={isLastLesson} busy={completing} onClick={markComplete} full />
            </div>
            <button onClick={goNext} disabled={isLastLesson} className="rounded-xl bg-white/[0.06] p-3 text-white disabled:opacity-30" aria-label="Next lesson">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile outline drawer ─────────────────────────────────────────── */}
      {outlineOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true" aria-label="Course outline">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOutlineOpen(false)} />
          <div className="relative z-10 flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0d1117]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-white">Course outline</h3>
                <p className="text-xs text-gray-400">{progressPct}% complete</p>
              </div>
              <button onClick={() => setOutlineOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10" aria-label="Close outline">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{outline}</div>
          </div>
        </div>
      )}

      {videoPlayer && (
        <FloatingVideoPlayer
          url={videoPlayer.url}
          title={videoPlayer.title}
          lessonId={videoPlayer.lessonId}
          userId={user?.uid}
          onClose={() => setVideoPlayer(null)}
        />
      )}
    </StudentLayout>
  );
};

// ── Pieces ────────────────────────────────────────────────────────────────────

const CompleteButton = ({ done, last, busy, onClick, full = false }) => (
  <button
    onClick={onClick}
    disabled={busy || (done && last)}
    className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all disabled:opacity-60 ${full ? 'w-full' : ''} ${
      done
        ? 'bg-white/[0.08] text-white hover:bg-white/[0.12]'
        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-900/30 hover:opacity-90'
    }`}
  >
    {busy ? 'Saving…' : done ? (last ? <><CheckCircle2 size={16} /> Completed</> : <>Next lesson <ArrowRight size={16} /></>) : <><CheckCircle2 size={16} /> {last ? 'Complete lesson' : 'Complete & continue'}</>}
  </button>
);

const OnThisPage = ({ sections }) => (
  <details className="group mb-6 rounded-xl border border-white/[0.07] bg-white/[0.02] open:pb-2">
    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-gray-300">
      <span className="flex items-center gap-2"><List size={15} /> In this lesson · {sections.length} sections</span>
      <ChevronRight size={15} className="transition-transform group-open:rotate-90" />
    </summary>
    <ol className="space-y-0.5 px-2">
      {sections.map((s, i) => (
        <li key={s.index}>
          <a href={`#sec-${s.index}`} className="flex gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-400 hover:bg-white/[0.05] hover:text-white">
            <span className="tabular-nums text-gray-600">{i + 1}.</span> {s.text}
          </a>
        </li>
      ))}
    </ol>
  </details>
);

const LessonMedia = ({ lesson }) => {
  if (lesson.type === 'video' && lesson.videoUrl) {
    const embed = /youtube\.com|youtu\.be/.test(lesson.videoUrl) ? youtubeEmbedUrl(lesson.videoUrl) : null;
    return (
      <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
        {embed
          ? <div className="aspect-video"><iframe src={embed} title={lesson.title} className="h-full w-full" allowFullScreen /></div>
          : <video controls className="w-full" src={lesson.videoUrl}>Your browser does not support the video tag.</video>}
      </div>
    );
  }
  if (lesson.type === 'document' && lesson.documentUrl) {
    return (
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-white"><File size={16} /> Lesson document</p>
          <a href={lesson.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-blue-500/15 px-3 py-1.5 text-xs font-medium text-blue-200 hover:bg-blue-500/25">
            <Download size={14} /> Download
          </a>
        </div>
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(lesson.documentUrl)}&embedded=true`}
          title={lesson.title}
          className="h-[70vh] w-full rounded-lg bg-white"
        />
      </div>
    );
  }
  return null;
};

const Resources = ({ files }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
    <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white"><Download size={18} className="text-orange-400" /> Course materials</h2>
    {files.length === 0 ? (
      <p className="text-sm text-gray-400">Your instructor hasn't uploaded any materials for this course yet.</p>
    ) : (
      <ul className="space-y-2">
        {files.map(file => (
          <li key={file.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
            <FileText size={18} className="shrink-0 text-orange-400" />
            <span className="flex-1 truncate text-sm text-white">{file.name}</span>
            <a
              href={`data:${file.fileType};base64,${file.data}`}
              download={file.name}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-orange-500/15 px-3 py-1.5 text-xs font-medium text-orange-200 hover:bg-orange-500/25"
            >
              <Download size={14} /> Download
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const Milestone = ({ milestone, chapter, courseTitle, hasExam, certified, quizLoading, onQuiz, onSkip, onExam, onReview }) => {
  if (milestone.type === 'course') {
    return (
      <div className="animate-fade-in rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-600/15 via-blue-600/10 to-transparent p-8 sm:p-12 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-900/40">
          <Trophy size={30} className="text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">You finished every lesson!</h2>
        <p className="mx-auto mt-3 max-w-md text-gray-300">
          That's the whole of <span className="font-medium text-white">{courseTitle}</span>.{' '}
          {certified ? 'Your certificate is ready.' : hasExam ? 'One step left: pass the final exam (70%) to earn your certificate.' : ''}
        </p>
        <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <button onClick={onReview} className="rounded-xl bg-white/[0.08] px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.12]">Review lessons</button>
          {(hasExam || certified) && (
            <button onClick={onExam} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 hover:opacity-90">
              {certified ? <><Award size={16} /> View certificate</> : <><GraduationCap size={16} /> Take the final exam</>}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-8 sm:p-12 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
        <PartyPopper size={26} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Chapter complete</p>
      <h2 className="mt-2 text-2xl font-bold text-white">{chapter.title}</h2>
      <p className="mx-auto mt-3 max-w-md text-gray-300">
        Lock it in with a quick quiz — retrieval practice is the single best way to remember what you just learned.
      </p>
      <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
        <button onClick={onSkip} className="rounded-xl bg-white/[0.08] px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.12]">Skip for now</button>
        <button onClick={onQuiz} disabled={quizLoading} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 hover:opacity-90 disabled:opacity-60">
          <Brain size={16} /> {quizLoading ? 'Preparing quiz…' : 'Take the chapter quiz'}
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, body, action }) => (
  <div className="mx-auto max-w-md px-6 py-24 text-center">
    <Icon size={40} className="mx-auto mb-4 text-gray-500" />
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    <p className="mt-2 text-sm text-gray-400">{body}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

// Courses without structured chapters show the AI-personalised study plan
const CurriculumPlan = ({ course, curriculum, onAskBuddy }) => (
  <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
    <Link to="/student/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white">
      <ArrowLeft size={15} /> Dashboard
    </Link>
    <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Your personalised plan</p>
    <h1 className="mt-2 text-3xl font-bold text-white">{course.title}</h1>
    {course.description && <p className="mt-3 text-gray-300">{course.description}</p>}

    {curriculum?.modules?.length ? (
      <ol className="mt-8 space-y-3">
        {curriculum.modules.map((m, i) => (
          <li key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-bold text-violet-200">W{m.week || i + 1}</span>
              <div className="min-w-0">
                <h3 className="font-semibold text-white">{m.title}</h3>
                {m.description && <p className="mt-1 text-sm text-gray-400">{m.description}</p>}
                {m.objectives?.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-300 marker:text-violet-400">
                    {m.objectives.map((o, j) => <li key={j}>{o}</li>)}
                  </ul>
                )}
                {m.estimatedHours && <p className="mt-3 text-xs text-gray-500">≈ {m.estimatedHours} hours · {m.difficulty}</p>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    ) : (
      <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-sm text-gray-400">
        Lessons for this course are still being prepared. In the meantime, Buddy can walk you through any of its topics.
      </div>
    )}

    <button onClick={onAskBuddy} className="mt-8 flex items-center gap-2 rounded-xl bg-violet-500/15 px-5 py-3 text-sm font-medium text-violet-200 hover:bg-violet-500/25">
      <MessageCircle size={16} /> Study with Buddy
    </button>
  </div>
);

export default EnhancedCourseRoom;
