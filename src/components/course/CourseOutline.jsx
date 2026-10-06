import { useState } from 'react';
import { Award, Brain, CheckCircle2, ChevronDown, Circle, GraduationCap, Lock, PlayCircle } from 'lucide-react';

/**
 * Chapter → lesson outline with per-chapter progress, chapter quizzes and the final exam.
 */
const CourseOutline = ({
  chapters,
  currentChapterIndex,
  currentLessonIndex,
  activeView,               // 'lesson' | 'quiz'
  isLessonCompleted,
  bestQuizScore,
  onSelectLesson,
  onStartQuiz,
  exam,                     // { unlocked, certified, remaining, onOpen }
}) => {
  const [open, setOpen] = useState(() => new Set([currentChapterIndex]));

  // Keep the chapter that's being studied expanded
  const [prevChapter, setPrevChapter] = useState(currentChapterIndex);
  if (prevChapter !== currentChapterIndex) {
    setPrevChapter(currentChapterIndex);
    setOpen(prev => new Set(prev).add(currentChapterIndex));
  }

  const toggle = (ci) => setOpen(prev => {
    const next = new Set(prev);
    if (next.has(ci)) next.delete(ci); else next.add(ci);
    return next;
  });

  return (
    <nav aria-label="Course outline" className="space-y-2">
      {chapters.map((chapter, ci) => {
        const lessons = chapter.lessons || [];
        const done = lessons.filter(l => isLessonCompleted(chapter.id, l.id)).length;
        const complete = lessons.length > 0 && done === lessons.length;
        const expanded = open.has(ci);
        const best = bestQuizScore(chapter.id);
        const hasQuiz = chapter.quiz?.enabled;

        return (
          <div key={chapter.id} className={`rounded-xl border transition-colors ${ci === currentChapterIndex ? 'border-blue-500/30 bg-blue-500/[0.06]' : 'border-white/[0.07] bg-white/[0.02]'}`}>
            <button
              onClick={() => toggle(ci)}
              aria-expanded={expanded}
              className="flex w-full items-start gap-3 px-3 py-3 text-left"
            >
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${complete ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-gray-300'}`}>
                {complete ? <CheckCircle2 size={14} /> : ci + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold leading-snug text-white">{chapter.title}</span>
                <span className="mt-1.5 flex items-center gap-2">
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                      style={{ width: `${lessons.length ? (done / lessons.length) * 100 : 0}%` }}
                    />
                  </span>
                  <span className="text-[11px] tabular-nums text-gray-500">{done}/{lessons.length}</span>
                </span>
              </span>
              <ChevronDown size={16} className={`mt-1 shrink-0 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>

            {expanded && (
              <ul className="space-y-0.5 px-2 pb-2">
                {lessons.map((lesson, li) => {
                  const completed = isLessonCompleted(chapter.id, lesson.id);
                  const active = activeView === 'lesson' && ci === currentChapterIndex && li === currentLessonIndex;
                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => onSelectLesson(ci, li)}
                        aria-current={active ? 'step' : undefined}
                        className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${active ? 'bg-white/10' : 'hover:bg-white/[0.05]'}`}
                      >
                        {completed ? (
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                        ) : active ? (
                          <PlayCircle size={15} className="mt-0.5 shrink-0 text-blue-400" />
                        ) : (
                          <Circle size={15} className="mt-0.5 shrink-0 text-gray-600" />
                        )}
                        <span className={`flex-1 text-[13px] leading-snug ${active ? 'font-medium text-white' : completed ? 'text-gray-400' : 'text-gray-300'}`}>
                          {lesson.title}
                        </span>
                        {lesson.estimatedMinutes && (
                          <span className="shrink-0 text-[11px] tabular-nums text-gray-600">{lesson.estimatedMinutes}m</span>
                        )}
                      </button>
                    </li>
                  );
                })}

                {hasQuiz && (
                  <li>
                    <button
                      onClick={() => onStartQuiz(ci)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${activeView === 'quiz' && ci === currentChapterIndex ? 'bg-amber-500/15' : 'hover:bg-white/[0.05]'}`}
                    >
                      <Brain size={15} className="shrink-0 text-amber-400" />
                      <span className="flex-1 text-[13px] text-amber-100/90">Chapter quiz</span>
                      {best !== null && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${best >= 70 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-gray-400'}`}>
                          Best {best}%
                        </span>
                      )}
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        );
      })}

      {exam && (
        <button
          onClick={exam.onOpen}
          disabled={!exam.unlocked && !exam.certified}
          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
            exam.certified
              ? 'border-emerald-500/30 bg-emerald-500/[0.08] hover:bg-emerald-500/[0.12]'
              : exam.unlocked
              ? 'border-violet-500/40 bg-violet-500/[0.1] hover:bg-violet-500/[0.15]'
              : 'cursor-not-allowed border-white/[0.07] bg-white/[0.02] opacity-70'
          }`}
        >
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${exam.certified ? 'bg-emerald-500/20 text-emerald-300' : exam.unlocked ? 'bg-violet-500/20 text-violet-200' : 'bg-white/10 text-gray-500'}`}>
            {exam.certified ? <Award size={16} /> : exam.unlocked ? <GraduationCap size={16} /> : <Lock size={15} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-white">
              {exam.certified ? 'Certificate earned' : 'Final exam'}
            </span>
            <span className="block text-[11px] text-gray-400">
              {exam.certified
                ? 'View your certificate'
                : exam.unlocked
                ? 'Pass with 70% to get certified'
                : `Unlocks after ${exam.remaining} more lesson${exam.remaining === 1 ? '' : 's'}`}
            </span>
          </span>
        </button>
      )}
    </nav>
  );
};

export default CourseOutline;
