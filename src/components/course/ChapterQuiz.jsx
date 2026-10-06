import { useState } from 'react';
import { ArrowRight, Brain, CheckCircle2, RotateCcw, Trophy, X, XCircle } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * One-question-at-a-time chapter quiz with instant feedback and explanations.
 * onSubmit({ score, answers, correct, total }) is awaited and may return { pointsEarned }.
 */
const ChapterQuiz = ({ chapterTitle, questions, onSubmit, onExit, onContinue, continueLabel }) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const q = questions[index];
  const selected = answers[q?.id];
  const isCorrect = selected === q?.correctAnswer;
  const isLast = index === questions.length - 1;

  const choose = (optIndex) => {
    if (checked) return;
    setAnswers(prev => ({ ...prev, [q.id]: optIndex }));
  };

  const finish = async () => {
    const correct = questions.filter(item => answers[item.id] === item.correctAnswer).length;
    const score = Math.round((correct / questions.length) * 100);
    setSaving(true);
    try {
      const extra = (await onSubmit({ score, answers, correct, total: questions.length })) || {};
      setResult({ score, correct, ...extra });
    } finally {
      setSaving(false);
    }
  };

  const next = () => {
    if (isLast) {
      finish();
    } else {
      setIndex(i => i + 1);
      setChecked(false);
    }
  };

  const retake = () => {
    setIndex(0);
    setAnswers({});
    setChecked(false);
    setResult(null);
  };

  // ── Results ────────────────────────────────────────────────────────────────
  if (result) {
    const passed = result.score >= 70;
    return (
      <div className="animate-fade-in rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 text-center">
        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${passed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
          {passed ? <Trophy size={30} /> : <Brain size={30} />}
        </div>
        <p className="text-sm uppercase tracking-wider text-gray-400">{chapterTitle}</p>
        <h2 className="mt-1 text-4xl font-bold tabular-nums text-white">{result.score}%</h2>
        <p className="mt-2 text-gray-300">
          {result.correct} of {questions.length} correct
          {result.pointsEarned ? <> · <span className="text-violet-300">+{result.pointsEarned} XP</span></> : null}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-gray-400">
          {result.score === 100
            ? 'Perfect score — you clearly own this material.'
            : passed
            ? 'Nicely done. Review the ones you missed, then keep going.'
            : "Not quite there yet. Revisit the lessons in this chapter and give it another go — you'll get it."}
        </p>

        <div className="mx-auto mt-8 max-w-xl space-y-2 text-left">
          {questions.map((item, i) => {
            const right = answers[item.id] === item.correctAnswer;
            return (
              <div key={item.id} className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                {right
                  ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                  : <XCircle size={18} className="mt-0.5 shrink-0 text-rose-400" />}
                <div className="min-w-0 text-sm">
                  <p className="text-gray-200">{i + 1}. {item.question}</p>
                  {!right && (
                    <p className="mt-1 text-gray-400">
                      Answer: <span className="text-emerald-300">{item.options[item.correctAnswer]}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <button onClick={retake} className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-5 py-3 text-sm font-medium text-white hover:bg-white/10">
            <RotateCcw size={16} /> Retake quiz
          </button>
          <button onClick={onContinue} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 hover:opacity-90">
            {continueLabel} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ── Question ───────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
            <Brain size={14} /> Chapter quiz
          </p>
          <p className="mt-0.5 truncate text-sm text-gray-400">{chapterTitle}</p>
        </div>
        <button onClick={onExit} className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white" aria-label="Exit quiz">
          <X size={18} />
        </button>
      </div>

      <div className="mb-6 flex gap-1.5" aria-hidden="true">
        {questions.map((item, i) => (
          <span
            key={item.id}
            className={`h-1.5 flex-1 rounded-full ${i < index ? 'bg-violet-500' : i === index ? 'bg-blue-400' : 'bg-white/10'}`}
          />
        ))}
      </div>

      <p className="text-xs font-medium text-gray-500">Question {index + 1} of {questions.length}</p>
      <h2 className="mt-2 text-lg sm:text-xl font-semibold leading-snug text-white">{q.question}</h2>

      <div className="mt-6 space-y-2.5" role="radiogroup">
        {q.options.map((option, oi) => {
          const picked = selected === oi;
          const showRight = checked && oi === q.correctAnswer;
          const showWrong = checked && picked && !isCorrect;
          return (
            <button
              key={oi}
              role="radio"
              aria-checked={picked}
              onClick={() => choose(oi)}
              disabled={checked}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                showRight
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : showWrong
                  ? 'border-rose-500/50 bg-rose-500/10'
                  : picked
                  ? 'border-blue-500/60 bg-blue-500/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
              } ${checked ? 'cursor-default' : ''}`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                showRight ? 'bg-emerald-500 text-white' : showWrong ? 'bg-rose-500 text-white' : picked ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300'
              }`}>
                {LETTERS[oi]}
              </span>
              <span className="text-[15px] leading-snug text-gray-100">{option}</span>
            </button>
          );
        })}
      </div>

      {checked && (
        <div className={`animate-fade-in mt-5 rounded-xl border p-4 ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/[0.07]' : 'border-amber-500/30 bg-amber-500/[0.07]'}`}>
          <p className={`flex items-center gap-2 text-sm font-semibold ${isCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
            {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {isCorrect ? 'Correct!' : 'Not quite'}
          </p>
          {q.explanation && <p className="mt-1.5 text-sm leading-relaxed text-gray-300">{q.explanation}</p>}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={selected === undefined}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answer
          </button>
        ) : (
          <button
            onClick={next}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : isLast ? 'See results' : 'Next question'} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChapterQuiz;
