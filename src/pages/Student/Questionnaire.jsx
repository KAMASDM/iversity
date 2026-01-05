import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import { getCourse, enrollStudent, savePersonalizedCurriculum } from '../../services/firestoreService';
import { generateCourseQuestionnaire, generatePersonalizedCurriculum } from '../../services/geminiService';
import { useAuthStore } from '../../store';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

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
    loadQuestionnaire();
  }, [courseId]);

  const loadQuestionnaire = async () => {
    try {
      const courseData = await getCourse(courseId);
      setCourse(courseData);

      const questionnaireData = await generateCourseQuestionnaire(
        courseId,
        courseData.topics || []
      );
      setQuestionnaire(questionnaireData);
    } catch (error) {
      console.error('Error loading questionnaire:', error);
      toast.error('Failed to load questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required questions are answered
    const allAnswered = questionnaire.questions.every(
      q => !q.required || responses[q.id]
    );

    if (!allAnswered) {
      toast.error('Please answer all required questions');
      return;
    }

    setSubmitting(true);

    try {
      // Process responses to create student profile
      const studentProfile = {
        experienceLevel: responses.q1 || 'beginner',
        goals: responses.q2 || 'general learning',
        learningStyle: responses.q3 || 'visual',
        timeCommitment: responses.q4 || '5',
        previousKnowledge: responses.q5 || 'none',
      };

      // Enroll student
      const enrollmentId = await enrollStudent(courseId, user.uid, responses);

      // Generate personalized curriculum
      toast.info('Generating your personalized curriculum...');
      const curriculum = await generatePersonalizedCurriculum(
        courseId,
        studentProfile,
        responses
      );

      // Save curriculum
      await savePersonalizedCurriculum(enrollmentId, curriculum);

      toast.success('Successfully enrolled! Redirecting to your course...');
      setTimeout(() => {
        navigate(`/student/course-room/${enrollmentId}`);
      }, 2000);
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <Loader className="animate-spin mx-auto text-primary-600" size={48} />
          <p className="mt-4 text-gray-600">Loading questionnaire...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Course Enrollment</h1>
          <p className="text-gray-600">
            Help us personalize your learning experience for <strong>{course?.title}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questionnaire?.questions.map((question, index) => (
            <div key={question.id} className="card">
              <label className="block mb-4">
                <span className="font-semibold text-lg">
                  {index + 1}. {question.question}
                  {question.required && <span className="text-red-600 ml-1">*</span>}
                </span>
              </label>

              <div className="space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={responses[question.id] === option.value}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      className="mt-1"
                      required={question.required}
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                'Complete Enrollment'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/student/courses')}
              className="btn-secondary flex-1 py-3"
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </StudentLayout>
  );
};

export default Questionnaire;
