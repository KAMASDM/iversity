import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import StudentNotes from '../../components/StudentNotes';
import StudentTodoList from '../../components/StudentTodoList';
import Gamification from '../../components/Gamification';
import { 
  getEnrollment, 
  getCourse, 
  getCurriculum,
  updateEnrollmentProgress,
  awardPoints,
  updateStreak,
  awardBadge,
  saveQuizResult
} from '../../services/firestoreService';
import { generateAdaptiveQuiz } from '../../services/geminiService';
import { useAuthStore, useBuddyStore } from '../../store';
import { toast } from 'react-toastify';
import { 
  BookOpen, CheckCircle, Lock, Play, ChevronLeft, ChevronRight,
  Clock, Brain, FileText, Target, TrendingUp, Award, MessageCircle,
  Download, ExternalLink, Video, File
} from 'lucide-react';

const EnhancedCourseRoom = () => {
  const { enrollmentId } = useParams();
  const { user } = useAuthStore();
  const { toggleBuddy } = useBuddyStore();
  
  const [enrollment, setEnrollment] = useState(null);
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // content, notes, todo, gamification

  useEffect(() => {
    loadCourseData();
  }, [enrollmentId]);

  const loadCourseData = async () => {
    try {
      const enrollmentData = await getEnrollment(enrollmentId);
      setEnrollment(enrollmentData);

      const courseData = await getCourse(enrollmentData.courseId);
      setCourse(courseData);

      // Load chapters from course content
      if (courseData.chapters && courseData.chapters.length > 0) {
        setChapters(courseData.chapters);
      }

      // Also load AI curriculum if available
      const curriculumData = await getCurriculum(enrollmentId);
      setCurriculum(curriculumData?.curriculum);

      // Update streak
      await updateStreak(user.uid, enrollmentData.courseId);

    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const currentChapter = chapters[currentChapterIndex];
  const currentLesson = currentChapter?.lessons?.[currentLessonIndex];
  const totalLessons = chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0);
  const completedLessons = enrollment?.completedLessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const markLessonComplete = async () => {
    try {
      const lessonId = `${currentChapter.id}_${currentLesson.id}`;
      const newCompletedLessons = [...(enrollment.completedLessons || []), lessonId];
      
      await updateEnrollmentProgress(enrollmentId, {
        completedLessons: newCompletedLessons,
        progress: (newCompletedLessons.length / totalLessons) * 100,
      });

      // Award points
      await awardPoints(
        user.uid,
        course.id,
        10,
        'Lesson Completed',
        `Finished: ${currentLesson.title}`
      );

      // Check for first lesson badge
      if (newCompletedLessons.length === 1) {
        await awardBadge(user.uid, course.id, 'first_lesson');
      }

      toast.success('Lesson completed! +10 XP');
      await loadCourseData();
      
      // Move to next lesson
      handleNextLesson();
    } catch (error) {
      toast.error('Failed to mark lesson complete');
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < (currentChapter.lessons?.length || 0) - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      const prevChapter = chapters[currentChapterIndex - 1];
      setCurrentLessonIndex((prevChapter.lessons?.length || 1) - 1);
    }
  };

  const handleStartQuiz = async () => {
    if (!currentChapter.quiz || !currentChapter.quiz.enabled) {
      toast.error('No quiz available for this chapter');
      return;
    }

    setQuizLoading(true);
    try {
      // Use predefined quiz questions from chapter
      if (currentChapter.quiz.questions && currentChapter.quiz.questions.length > 0) {
        setQuiz({ questions: currentChapter.quiz.questions });
        setShowQuiz(true);
      } else {
        // Generate adaptive quiz using AI
        const quizData = await generateAdaptiveQuiz(
          course,
          currentChapter.title,
          enrollment,
          enrollment.quizResults || []
        );
        setQuiz(quizData);
        setShowQuiz(true);
      }
    } catch (error) {
      toast.error('Failed to load quiz');
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

    let correct = 0;
    quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = (correct / quiz.questions.length) * 100;

    try {
      await saveQuizResult(enrollmentId, {
        chapterId: currentChapter.id,
        score,
        answers: quizAnswers,
        totalQuestions: quiz.questions.length,
        correctAnswers: correct,
      });

      // Award points based on score
      const pointsEarned = Math.round(score / 2); // 50 points for 100% score
      await awardPoints(
        user.uid,
        course.id,
        pointsEarned,
        'Quiz Completed',
        `Scored ${score.toFixed(0)}% on ${currentChapter.title}`
      );

      // Award badge for perfect score
      if (score === 100) {
        await awardBadge(user.uid, course.id, 'quiz_master');
        toast.success(`Perfect score! +${pointsEarned} XP + Quiz Master Badge! 🧠`);
      } else {
        toast.success(`Quiz completed! Score: ${score.toFixed(0)}% (+${pointsEarned} XP)`);
      }

      setShowQuiz(false);
      setQuizAnswers({});
      await loadCourseData();
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  };

  const isLessonCompleted = (chapterId, lessonId) => {
    const lessonKey = `${chapterId}_${lessonId}`;
    return enrollment?.completedLessons?.includes(lessonKey);
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading course...</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header with Progress */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-blue-100">Chapter {currentChapterIndex + 1}: {currentChapter?.title}</p>
            </div>
            <button
              onClick={toggleBuddy}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <MessageCircle size={20} />
              Ask Buddy
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completedLessons} / {totalLessons} lessons</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-blue-100">{progressPercentage.toFixed(0)}% Complete</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-2 flex gap-2">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen size={18} className="inline mr-2" />
                Content
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'notes'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText size={18} className="inline mr-2" />
                Notes
              </button>
              <button
                onClick={() => setActiveTab('todo')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'todo'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Target size={18} className="inline mr-2" />
                Tasks
              </button>
              <button
                onClick={() => setActiveTab('gamification')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'gamification'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Award size={18} className="inline mr-2" />
                Progress
              </button>
            </div>

            {/* Content Display */}
            {activeTab === 'content' && !showQuiz && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-500/30">
                      Lesson {currentLessonIndex + 1} of {currentChapter?.lessons?.length || 0}
                    </span>
                    {isLessonCompleted(currentChapter.id, currentLesson.id) && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full border border-green-500/30 flex items-center gap-1">
                        <CheckCircle size={16} />
                        Completed
                      </span>
                    )}
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full border border-purple-500/30">
                      {currentLesson?.duration || '30 min'}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-3">{currentLesson?.title}</h2>
                  
                  {/* Lesson Type Badge */}
                  <div className="flex items-center gap-2 text-gray-400">
                    {currentLesson?.type === 'video' && <Video size={18} />}
                    {currentLesson?.type === 'document' && <File size={18} />}
                    {currentLesson?.type === 'article' && <FileText size={18} />}
                    <span className="capitalize">{currentLesson?.type} Lesson</span>
                  </div>
                </div>

                {/* Video Lesson */}
                {currentLesson?.type === 'video' && currentLesson.videoUrl && (
                  <div className="mb-6">
                    {currentLesson.videoUrl.includes('youtube.com') || currentLesson.videoUrl.includes('youtu.be') ? (
                      <div className="aspect-video rounded-xl overflow-hidden">
                        <iframe
                          src={currentLesson.videoUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <video
                        controls
                        className="w-full rounded-xl"
                        src={currentLesson.videoUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                {/* Document Lesson */}
                {currentLesson?.type === 'document' && currentLesson.documentUrl && (
                  <div className="mb-6 p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Course Materials</h3>
                      <a
                        href={currentLesson.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Download size={18} />
                        Download
                      </a>
                    </div>
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(currentLesson.documentUrl)}&embedded=true`}
                      className="w-full h-[600px] rounded-lg"
                    />
                  </div>
                )}

                {/* Article/Text Content */}
                {(currentLesson?.type === 'article' || currentLesson?.type === 'interactive') && currentLesson.content && (
                  <div className="mb-6">
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {currentLesson.content}
                      </div>
                    </div>
                  </div>
                )}

                {/* Lesson Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <button
                    onClick={handlePreviousLesson}
                    disabled={currentChapterIndex === 0 && currentLessonIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  
                  <div className="flex gap-3">
                    {!isLessonCompleted(currentChapter.id, currentLesson.id) && (
                      <button
                        onClick={markLessonComplete}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:scale-105 transition-transform"
                      >
                        <CheckCircle size={20} />
                        Mark Complete
                      </button>
                    )}
                    
                    {currentLessonIndex === (currentChapter?.lessons?.length || 1) - 1 && currentChapter?.quiz?.enabled && (
                      <button
                        onClick={handleStartQuiz}
                        disabled={quizLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                      >
                        <Brain size={20} />
                        {quizLoading ? 'Loading Quiz...' : 'Take Quiz'}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleNextLesson}
                    disabled={currentChapterIndex === chapters.length - 1 && currentLessonIndex === (currentChapter?.lessons?.length || 1) - 1}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Interface */}
            {activeTab === 'content' && showQuiz && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Chapter Quiz</h2>
                <div className="space-y-6">
                  {quiz.questions.map((question, qIndex) => (
                    <div key={question.id} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                      <p className="font-semibold text-white mb-4 text-lg">
                        {qIndex + 1}. {question.question}
                      </p>
                      <div className="space-y-3">
                        {question.options.map((option, optIndex) => (
                          <label
                            key={optIndex}
                            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={optIndex}
                              checked={quizAnswers[question.id] === optIndex}
                              onChange={() => handleQuizAnswer(question.id, optIndex)}
                              className="w-5 h-5 text-blue-600"
                            />
                            <span className="text-white">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <StudentNotes
                courseId={course.id}
                chapterId={currentChapter?.id}
                lessonId={currentLesson?.id}
              />
            )}

            {/* Todo Tab */}
            {activeTab === 'todo' && (
              <StudentTodoList courseId={course.id} />
            )}

            {/* Gamification Tab */}
            {activeTab === 'gamification' && (
              <Gamification courseId={course.id} enrollmentId={enrollmentId} />
            )}
          </div>

          {/* Sidebar - Chapter & Lesson Navigation */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-white">Course Content</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {chapters.map((chapter, chIndex) => (
                  <div key={chapter.id} className="space-y-2">
                    <div
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        chIndex === currentChapterIndex
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => {
                        setCurrentChapterIndex(chIndex);
                        setCurrentLessonIndex(0);
                      }}
                    >
                      <p className="font-medium text-white text-sm">
                        Chapter {chIndex + 1}: {chapter.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {chapter.lessons?.length || 0} lessons
                      </p>
                    </div>
                    
                    {chIndex === currentChapterIndex && (
                      <div className="ml-4 space-y-2">
                        {chapter.lessons?.map((lesson, lIndex) => {
                          const completed = isLessonCompleted(chapter.id, lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              onClick={() => setCurrentLessonIndex(lIndex)}
                              className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors ${
                                lIndex === currentLessonIndex
                                  ? 'bg-purple-500/20 border border-purple-500/30'
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              {completed ? (
                                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-white/20 flex-shrink-0" />
                              )}
                              <span className="text-sm text-white">{lesson.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default EnhancedCourseRoom;
