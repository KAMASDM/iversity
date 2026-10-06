import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import Loading from '../../components/Loading';
import { startFinalExam, submitFinalExam } from '../../services/aiService';
import { toast } from 'react-toastify';
import {
  ArrowLeft, ArrowRight, Award, CheckCircle2, ChevronLeft, Clock, GraduationCap,
  Lock, RotateCcw, ShieldCheck, Target, XCircle,
} from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const FinalExam = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({ phase: 'loading' }); // loading | error | locked | certified | intro | exam | review | result
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const load = async () => {
    setState({ phase: 'loading' });
    setAnswers({});
    setIndex(0);
    setResult(null);
    try {
      const data = await startFinalExam(enrollmentId);
      if (data.status === 'locked') setState({ phase: 'locked', remaining: data.remainingLessons });
      else if (data.status === 'certified') setState({ phase: 'certified', certificateId: data.certificateId, score: data.score });
      else {
        setExam(data);
        setState({ phase: 'intro' });
      }
    } catch (error) {
      setState({ phase: 'error', message: error.message });
    }
  };

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollmentId]);

  // Warn before leaving mid-exam
  useEffect(() => {
    if (state.phase !== 'exam' && state.phase !== 'review') return;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [state.phase]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const data = await submitFinalExam(enrollmentId, exam.attempt, answers);
      setResult(data);
      setState({ phase: 'result' });
      window.scrollTo({ top: 0 });
      if (data.passed) toast.success('You passed — your certificate is ready! 🎓');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const backToCourse = (
    <Link to={`/student/course-room/${enrollmentId}`} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white">
      <ArrowLeft size={15} /> Back to course
    </Link>
  );

  if (state.phase === 'loading') {
    return <StudentLayout><Loading fullScreen={false} label="Preparing your exam…" /></StudentLayout>;
  }

  const questions = exam?.questions || [];
  const answeredCount = questions.filter(q => answers[q.key] !== undefined).length;

  return (
    <StudentLayout>
      <div className="mx-auto max-w-3xl">
        {state.phase === 'error' && (
          <Panel icon={XCircle} tone="rose" title="The exam couldn't be loaded" body={state.message}>
            <button onClick={load} className="btn-ghost"><RotateCcw size={16} /> Try again</button>
            {backToCourse}
          </Panel>
        )}

        {state.phase === 'locked' && (
          <Panel icon={Lock} tone="gray" title="Finish the course first"
            body={`You have ${state.remaining} lesson${state.remaining === 1 ? '' : 's'} left. The final exam unlocks once every lesson is complete.`}>
            <Link to={`/student/course-room/${enrollmentId}`} className="btn-primary-gradient">Continue learning <ArrowRight size={16} /></Link>
          </Panel>
        )}

        {state.phase === 'certified' && (
          <Panel icon={Award} tone="emerald" title="You've already earned this certificate"
            body={state.score != null ? `You passed the final exam with ${state.score}%.` : 'Nice work — this course is complete.'}>
            <Link to="/student/certificates" className="btn-primary-gradient"><Award size={16} /> View certificate</Link>
            {backToCourse}
          </Panel>
        )}

        {state.phase === 'intro' && (
          <div className="animate-fade-in">
            {backToCourse}
            <div className="mt-5 rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-600/15 via-blue-600/10 to-transparent p-7 sm:p-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-violet-900/40">
                <GraduationCap size={26} className="text-white" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Final exam</p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">{exam.courseTitle}</h1>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Fact icon={Target} label="Questions" value={questions.length} />
                <Fact icon={ShieldCheck} label="Pass mark" value={`${exam.passMark}%`} />
                <Fact icon={Clock} label="Time limit" value="None" />
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-300">
                <li>• Questions are drawn from every chapter of the course.</li>
                <li>• You can move back and forth and change answers before submitting.</li>
                <li>• Pass and your certificate is issued instantly. Didn't pass? Review and try again.</li>
                {exam.attempt > 0 && <li className="text-amber-200">• This is attempt {exam.attempt + 1} — you'll get a fresh set of questions.</li>}
              </ul>
              <button onClick={() => setState({ phase: 'exam' })} className="btn-primary-gradient mt-8 w-full sm:w-auto">
                Start exam <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {state.phase === 'exam' && questions[index] && (
          <div>
            <div className="mb-5 flex items-center justify-between text-sm">
              <span className="text-gray-400">Question <span className="font-semibold text-white">{index + 1}</span> of {questions.length}</span>
              <span className="text-gray-500">{answeredCount} answered</span>
            </div>
            <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>

            <div key={index} className="animate-fade-in rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-300/80">{questions[index].chapterTitle}</p>
              <h2 className="mt-2 text-lg sm:text-xl font-semibold leading-snug text-white">{questions[index].question}</h2>
              <div className="mt-6 space-y-2.5" role="radiogroup">
                {questions[index].options.map((option, oi) => {
                  const picked = answers[questions[index].key] === oi;
                  return (
                    <button
                      key={oi}
                      role="radio"
                      aria-checked={picked}
                      onClick={() => setAnswers(prev => ({ ...prev, [questions[index].key]: oi }))}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${picked ? 'border-blue-500/60 bg-blue-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'}`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${picked ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300'}`}>{LETTERS[oi]}</span>
                      <span className="text-[15px] leading-snug text-gray-100">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0} className="btn-ghost disabled:opacity-30">
                <ChevronLeft size={16} /> Back
              </button>
              {index < questions.length - 1 ? (
                <button onClick={() => setIndex(i => i + 1)} className="btn-primary-gradient">
                  {answers[questions[index].key] === undefined ? 'Skip' : 'Next'} <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={() => setState({ phase: 'review' })} className="btn-primary-gradient">
                  Review answers <ArrowRight size={16} />
                </button>
              )}
            </div>

            {/* Question map */}
            <div className="mt-8 flex flex-wrap gap-1.5" aria-label="Jump to question">
              {questions.map((q, i) => (
                <button
                  key={q.key}
                  onClick={() => setIndex(i)}
                  aria-label={`Question ${i + 1}${answers[q.key] !== undefined ? ', answered' : ''}`}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold tabular-nums transition-colors ${i === index ? 'bg-blue-500 text-white' : answers[q.key] !== undefined ? 'bg-violet-500/25 text-violet-100' : 'bg-white/[0.06] text-gray-400 hover:bg-white/10'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.phase === 'review' && (
          <div className="animate-fade-in rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white">Ready to submit?</h2>
            <p className="mt-2 text-sm text-gray-400">
              You've answered <span className="font-semibold text-white">{answeredCount}</span> of {questions.length} questions.
              {answeredCount < questions.length && ' Unanswered questions count as incorrect.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {questions.map((q, i) => (
                <button
                  key={q.key}
                  onClick={() => { setIndex(i); setState({ phase: 'exam' }); }}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold tabular-nums ${answers[q.key] !== undefined ? 'bg-violet-500/25 text-violet-100' : 'bg-rose-500/20 text-rose-200 ring-1 ring-rose-500/40'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button onClick={() => setState({ phase: 'exam' })} className="btn-ghost justify-center">Keep reviewing</button>
              <button onClick={submit} disabled={submitting} className="btn-primary-gradient justify-center disabled:opacity-60">
                {submitting ? 'Grading…' : 'Submit exam'}
              </button>
            </div>
          </div>
        )}

        {state.phase === 'result' && result && (
          <div className="animate-fade-in space-y-6">
            <div className={`rounded-3xl border p-7 sm:p-10 text-center ${result.passed ? 'border-emerald-500/25 bg-gradient-to-br from-emerald-500/15 to-transparent' : 'border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-transparent'}`}>
              <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${result.passed ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-900/40' : 'bg-amber-500/15'}`}>
                {result.passed ? <Award size={30} className="text-white" /> : <Target size={28} className="text-amber-300" />}
              </div>
              <p className="text-sm uppercase tracking-wider text-gray-400">{result.passed ? 'Passed' : 'Not passed yet'}</p>
              <h1 className="mt-1 text-5xl font-bold tabular-nums text-white">{result.score}%</h1>
              <p className="mt-2 text-gray-300">{result.correct} of {result.total} correct · pass mark {result.passMark}%</p>
              <p className="mx-auto mt-4 max-w-md text-sm text-gray-400">
                {result.passed
                  ? 'Congratulations — you\'ve completed the course. Your certificate has been issued.'
                  : 'You were close. Look at the chapters below where you lost marks, revisit those lessons, then try again with a fresh set of questions.'}
              </p>
              <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
                {result.passed ? (
                  <>
                    <Link to="/student/dashboard" className="btn-ghost justify-center">Back to dashboard</Link>
                    <button onClick={() => navigate('/student/certificates')} className="btn-primary-gradient justify-center"><Award size={16} /> View certificate</button>
                  </>
                ) : (
                  <>
                    <Link to={`/student/course-room/${enrollmentId}`} className="btn-ghost justify-center">Review lessons</Link>
                    <button onClick={load} className="btn-primary-gradient justify-center"><RotateCcw size={16} /> Try again</button>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-4 font-semibold text-white">Score by chapter</h2>
              <div className="space-y-3">
                {result.breakdown.map((b) => {
                  const pct = Math.round((b.correct / b.total) * 100);
                  return (
                    <div key={b.chapterTitle}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="truncate pr-3 text-gray-300">{b.chapterTitle}</span>
                        <span className="tabular-nums text-gray-400">{b.correct}/{b.total}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-400' : pct >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-4 font-semibold text-white">Answer review</h2>
              <ol className="space-y-3">
                {result.review.map((r, i) => {
                  const q = questions.find(item => item.key === r.key);
                  if (!q) return null;
                  return (
                    <li key={r.key} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <div className="flex gap-3">
                        {r.isCorrect ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-rose-400" />}
                        <div className="min-w-0 text-sm">
                          <p className="text-gray-100">{i + 1}. {q.question}</p>
                          {!r.isCorrect && (
                            <p className="mt-1.5 text-gray-400">
                              {r.yourAnswer !== null && <>You chose <span className="text-rose-300">{q.options[r.yourAnswer]}</span>. </>}
                              Correct: <span className="text-emerald-300">{q.options[r.correctAnswer]}</span>
                            </p>
                          )}
                          {!r.isCorrect && r.explanation && <p className="mt-1.5 text-gray-500">{r.explanation}</p>}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

const TONES = {
  rose: 'bg-rose-500/15 text-rose-300',
  gray: 'bg-white/10 text-gray-300',
  emerald: 'bg-emerald-500/15 text-emerald-300',
};

const Panel = ({ icon: Icon, tone, title, body, children }) => (
  <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 text-center">
    <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${TONES[tone]}`}>
      <Icon size={26} />
    </div>
    <h1 className="text-2xl font-bold text-white">{title}</h1>
    {body && <p className="mx-auto mt-3 max-w-md text-gray-400">{body}</p>}
    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">{children}</div>
  </div>
);

const Fact = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
    <Icon size={16} className="text-violet-300" />
    <p className="mt-2 text-xl font-bold text-white">{value}</p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

export default FinalExam;
