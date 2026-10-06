import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import Loading from '../../components/Loading';
import { getCourse, enrollStudent, savePersonalizedCurriculum, getStudentEnrollments } from '../../services/firestoreService';
import { generateCourseQuestionnaire, generatePersonalizedCurriculum, FALLBACK_QUESTIONNAIRE } from '../../services/aiService';
import { useAuthStore } from '../../store';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight, Loader, Sparkles } from 'lucide-react';

const CATEGORY_TO_PROFILE = {
  knowledge: 'experienceLevel',
  goals: 'goals',
  style: 'learningStyle',
  commitment: 'timeCommitment',
  experience: 'previousKnowledge',
};

const Questionnaire = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [courseData, enrollments] = await Promise.all([getCourse(courseId), getStudentEnrollments(user.uid)]);
        const existing = enrollments.find(e => e.courseId === courseId);
        if (existing) {
          navigate(`/student/course-room/${existing.id}`, { replace: true });
          return;
        }
        setCourse(courseData);
        try {
          setQuestionnaire(await generateCourseQuestionnaire(courseData));
        } catch {
          setQuestionnaire(FALLBACK_QUESTIONNAIRE);
        }
      } catch (error) {
        console.error('Error loading questionnaire:', error);
        toast.error('Failed to load this course');
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = questionnaire.questions.filter(q => q.required && !responses[q.id]);
    if (missing.length) {
      toast.error(`Please answer ${missing.length === 1 ? 'the remaining question' : `the ${missing.length} remaining questions`}`);
      document.getElementById(`q-${missing[0].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Map answers onto the profile fields by question category
    const profile = {};
    for (const q of questionnaire.questions) {
      const field = CATEGORY_TO_PROFILE[q.category];
      const option = q.options.find(o => o.value === responses[q.id]);
      if (field && option) profile[field] = field === 'timeCommitment' ? option.value : option.label;
    }

    setSubmitting(true);
    try {
      const enrollmentId = await enrollStudent(courseId, user.uid, responses);
      try {
        const curriculum = await generatePersonalizedCurriculum(course, profile);
        await savePersonalizedCurriculum(enrollmentId, curriculum);
      } catch (error) {
        // Enrollment succeeded — the plan is a bonus, so don't block on it
        console.warn('Curriculum generation failed:', error);
      }
      toast.success("You're enrolled — let's go!");
      navigate(`/student/course-room/${enrollmentId}`);
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enroll in course');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <StudentLayout><Loading fullScreen={false} label="Personalising your enrollment…" /></StudentLayout>;
  }

  const answered = questionnaire ? questionnaire.questions.filter(q => responses[q.id]).length : 0;
  const total = questionnaire?.questions.length || 0;

  return (
    <StudentLayout>
      <div className="mx-auto max-w-2xl">
        <Link to={`/student/courses/${courseId}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={15} /> Back to course
        </Link>

        <div className="mb-8">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300">
            <Sparkles size={14} /> Personalise your path
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{course?.title}</h1>
          <p className="mt-2 text-gray-400">
            A few quick questions so Buddy can tailor a study plan to your level, goals and schedule. Takes under a minute.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {questionnaire?.questions.map((question, index) => (
            <fieldset key={question.id} id={`q-${question.id}`} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 sm:p-6">
              <legend className="sr-only">{question.question}</legend>
              <p className="mb-4 font-semibold text-white">
                <span className="mr-2 text-gray-500 tabular-nums">{index + 1}.</span>
                {question.question}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => {
                  const checked = responses[question.id] === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${checked ? 'border-blue-500/60 bg-blue-500/10 text-white' : 'border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/[0.04]'}`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={checked}
                        onChange={() => setResponses(prev => ({ ...prev, [question.id]: option.value }))}
                        className="mt-0.5 accent-blue-500"
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <div className="sticky bottom-20 lg:bottom-4 z-10 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0d1117]/95 p-3 backdrop-blur-xl">
            <div className="hidden sm:block flex-1 px-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all" style={{ width: `${total ? (answered / total) * 100 : 0}%` }} />
              </div>
              <p className="mt-1 text-xs text-gray-500">{answered} of {total} answered</p>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary-gradient flex-1 sm:flex-none justify-center disabled:opacity-60">
              {submitting ? <><Loader className="animate-spin" size={16} /> Building your plan…</> : <>Enroll &amp; start <ArrowRight size={16} /></>}
            </button>
          </div>
        </form>
      </div>
    </StudentLayout>
  );
};

export default Questionnaire;
