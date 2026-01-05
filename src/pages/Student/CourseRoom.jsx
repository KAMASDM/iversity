import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import { getEnrollment, getCurriculum, updateEnrollmentProgress, saveQuizResult } from '../../services/firestoreService';
import { generateAdaptiveQuiz } from '../../services/geminiService';
import { useEnrollmentStore, useBuddyStore } from '../../store';
import { toast } from 'react-toastify';
import { BookOpen, CheckCircle, Play, Loader, MessageCircle } from 'lucide-react';

const CourseRoom = () => {
  const { enrollmentId } = useParams();
  const { setCurrentEnrollment, setCurriculum } = useEnrollmentStore();
  const { toggleBuddy } = useBuddyStore();
  const [enrollment, setEnrollment] = useState(null);
  const [curriculum, setCurriculumState] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    loadCourseRoom();
  }, [enrollmentId]);

  const loadCourseRoom = async () => {
    try {
      const enrollmentData = await getEnrollment(enrollmentId);
      setEnrollment(enrollmentData);
      setCurrentEnrollment(enrollmentData);

      const curriculumData = await getCurriculum(enrollmentId);
      if (curriculumData) {
        setCurriculumState(curriculumData.curriculum);
        setCurriculum(curriculumData.curriculum);
      }
    } catch (error) {
      console.error('Error loading course room:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (module) => {
    setQuizLoading(true);
    try {
      const quizData = await generateAdaptiveQuiz(
        module.title,
        enrollment,
        enrollment.quizResults || []
      );
      setQuiz(quizData);
      setShowQuiz(true);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answer });
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(quizAnswers).length !== quiz.questions.length) {
      toast.error('Please answer all questions');
      return;
    }

    // Calculate score
    let correct = 0;
    quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = (correct / quiz.questions.length) * 100;

    try {
      // Save quiz result
      await saveQuizResult(enrollmentId, {
        moduleId: curriculum.modules[currentModuleIndex].title,
        questions: quiz.questions,
        answers: quizAnswers,
        score,
        totalQuestions: quiz.questions.length,
        correctAnswers: correct,
      });

      // Update progress
      const newProgress = ((currentModuleIndex + 1) / curriculum.modules.length) * 100;
      await updateEnrollmentProgress(enrollmentId, {
        progress: newProgress,
        completedModules: [...(enrollment.completedModules || []), curriculum.modules[currentModuleIndex].title],
        currentModule: curriculum.modules[currentModuleIndex + 1]?.title || 'Final Exam',
      });

      toast.success(`Quiz completed! Score: ${score.toFixed(0)}%`);
      setShowQuiz(false);
      setQuizAnswers({});
      
      if (currentModuleIndex < curriculum.modules.length - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1);
      }
      
      loadCourseRoom();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <Loader className="animate-spin mx-auto text-primary-600" size={48} />
          <p className="mt-4">Loading your personalized course...</p>
        </div>
      </StudentLayout>
    );
  }

  if (!curriculum) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <p>Curriculum not found</p>
        </div>
      </StudentLayout>
    );
  }

  const currentModule = curriculum.modules[currentModuleIndex];

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto">
        {/* Progress Header */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Your Personalized Learning Path</h2>
              <p className="text-gray-600">Module {currentModuleIndex + 1} of {curriculum.modules.length}</p>
            </div>
            <button
              onClick={toggleBuddy}
              className="btn-primary flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Ask Buddy
            </button>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${enrollment.progress || 0}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{Math.round(enrollment.progress || 0)}% Complete</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Module Content */}
          <div className="lg:col-span-2 space-y-6">
            {!showQuiz ? (
              <div className="card">
                <div className="mb-6">
                  <span className="px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full">
                    Week {currentModule.week}
                  </span>
                  <h1 className="text-3xl font-bold mt-4">{currentModule.title}</h1>
                  <p className="text-gray-600 mt-2">{currentModule.description}</p>
                </div>

                {/* Learning Objectives */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Learning Objectives</h3>
                  <div className="space-y-2">
                    {currentModule.objectives?.map((obj, index) => (
                      <div key={index} className="flex gap-2">
                        <CheckCircle className="text-primary-600 flex-shrink-0 mt-1" size={18} />
                        <p>{obj}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Topics Covered</h3>
                  <div className="grid gap-2">
                    {currentModule.topics?.map((topic, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Module Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="font-semibold capitalize">{currentModule.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Time</p>
                    <p className="font-semibold">{currentModule.estimatedHours} hours</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleStartQuiz(currentModule)}
                    disabled={quizLoading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {quizLoading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Generating Quiz...
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        Take Quiz
                      </>
                    )}
                  </button>
                  <button onClick={toggleBuddy} className="btn-secondary">
                    Need Help?
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Interface */
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Module Quiz</h2>
                <div className="space-y-6">
                  {quiz.questions.map((question, qIndex) => (
                    <div key={question.id} className="p-4 border-2 border-gray-200 rounded-lg">
                      <p className="font-semibold mb-4">
                        {qIndex + 1}. {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <label
                            key={oIndex}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={oIndex}
                              checked={quizAnswers[question.id] === oIndex}
                              onChange={() => handleQuizAnswer(question.id, oIndex)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button onClick={handleSubmitQuiz} className="btn-primary flex-1">
                    Submit Quiz
                  </button>
                  <button onClick={() => setShowQuiz(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Module List */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Course Modules</h3>
              <div className="space-y-2">
                {curriculum.modules.map((module, index) => {
                  const isCompleted = enrollment.completedModules?.includes(module.title);
                  const isCurrent = index === currentModuleIndex;

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        isCurrent
                          ? 'border-primary-600 bg-primary-50'
                          : isCompleted
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCompleted ? (
                          <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                        ) : (
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm ${
                            isCurrent ? 'border-primary-600 text-primary-600' : 'border-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className={`font-medium ${isCurrent ? 'text-primary-600' : ''}`}>
                            {module.title}
                          </p>
                          <p className="text-xs text-gray-600">Week {module.week}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default CourseRoom;
