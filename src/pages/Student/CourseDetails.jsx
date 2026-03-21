import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import { getCourse, enrollStudent, getStudentEnrollments } from '../../services/firestoreService';
import { useAuthStore } from '../../store';
import { 
  Clock, BookOpen, CheckCircle, Users, Loader, Award, Target, 
  PlayCircle, FileText, Brain, Sparkles, TrendingUp, ArrowLeft,
  Star, Calendar, BarChart3, ChevronRight, ChevronDown
} from 'lucide-react';
import { toast } from 'react-toastify';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [existingEnrollmentId, setExistingEnrollmentId] = useState(null);

  useEffect(() => {
    loadCourse();
    checkEnrollment();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const data = await getCourse(courseId);
      setCourse(data);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const enrollments = await getStudentEnrollments(user.uid);
      const existing = enrollments.find(e => e.courseId === courseId);
      if (existing) {
        setAlreadyEnrolled(true);
        setExistingEnrollmentId(existing.id);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    // If course has structured chapters/lessons, enroll directly
    if (course.chapters && course.chapters.length > 0) {
      setEnrolling(true);
      try {
        // Direct enrollment without questionnaire
        const enrollmentId = await enrollStudent(courseId, user.uid, {
          enrollmentType: 'direct',
          hasStructuredContent: true
        });
        toast.success('Successfully enrolled in course!');
        navigate(`/student/course-room/${enrollmentId}`);
      } catch (error) {
        toast.error('Failed to enroll in course');
        console.error(error);
      } finally {
        setEnrolling(false);
      }
    } else {
      // For AI-generated curriculum courses, go through questionnaire
      navigate(`/student/questionnaire/${courseId}`);
    }
  };

  const handleContinue = () => {
    navigate(`/student/course-room/${existingEnrollmentId}`);
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'beginner': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-blue-500 to-indigo-600';
      case 'advanced': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelBadgeColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'advanced': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Mobile: collapse/expand curriculum sections
  const [expandedChapters, setExpandedChapters] = useState({});
  const toggleChapter = (idx) => setExpandedChapters(prev => ({ ...prev, [idx]: !prev[idx] }));

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="animate-spin text-blue-500 mb-4" size={48} />
          <p className="text-gray-400 text-lg">Loading course details...</p>
        </div>
      </StudentLayout>
    );
  }
  
  if (!course) {
    return (
      <StudentLayout>
        <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
          <p className="text-gray-400 mb-6">This course doesn't exist or has been removed</p>
          <button
            onClick={() => navigate('/student/courses')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white hover:scale-105 transition-transform"
          >
            Browse Courses
          </button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      {/* Extra bottom padding so sticky CTA doesn't overlap content on mobile */}
      <div className="space-y-5 pb-24 lg:pb-0">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student/courses')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Courses</span>
        </button>

        {/* Hero Section */}
        <div className={`relative overflow-hidden bg-gradient-to-r ${getLevelColor(course.level)} rounded-2xl p-5 sm:p-8 md:p-12`}>
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 ${getLevelBadgeColor(course.level)} text-xs font-bold rounded-full border uppercase tracking-wide`}>
                {course.level}
              </span>
              {course.category && (
                <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full border border-white/30">
                  {course.category}
                </span>
              )}
              {course.chapters && course.chapters.length > 0 && (
                <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30">
                  <CheckCircle size={12} />
                  Structured Content
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
              {course.title}
            </h1>
            <p className="text-sm sm:text-lg text-blue-100 max-w-3xl mb-5 leading-relaxed">
              {course.description}
            </p>

            {/* Key Stats Bar — horizontal scroll on mobile */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              {[{
                icon: Clock,
                label: 'Duration',
                value: `${course.duration}w`
              }, {
                icon: BookOpen,
                label: 'Content',
                value: course.chapters?.length > 0 ? `${course.chapters.length} Ch.` : `${course.topics?.length || 0} Topics`
              }, {
                icon: Users,
                label: 'Students',
                value: course.enrolledStudents || 0
              }].map((stat, i) => (
                <div key={i} className="flex-shrink-0 flex items-center gap-2.5 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <stat.icon className="text-white" size={18} />
                  <div>
                    <p className="text-white/70 text-[10px] uppercase tracking-wide leading-none">{stat.label}</p>
                    <p className="text-white font-bold text-sm sm:text-base leading-tight">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 lg:gap-8">
          {/* ── Enrollment card — shown FIRST on mobile only ────────────────── */}
          <div className="lg:hidden">
            <EnrollCard
              alreadyEnrolled={alreadyEnrolled}
              enrolling={enrolling}
              course={course}
              onEnroll={handleEnroll}
              onContinue={handleContinue}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* What You'll Learn */}
            {course.objectives && course.objectives.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                    <Target className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">What You'll Learn</h2>
                </div>
                <div className="grid gap-2.5 sm:gap-4">
                  {course.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-3 items-start p-3 sm:p-4 bg-gray-700/40 rounded-xl border border-white/10">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white" size={14} />
                      </div>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics Covered */}
            {course.topics && course.topics.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                    <Brain className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Topics Covered</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-4">
                  {course.topics.map((topic, index) => (
                    <div key={index} className="flex gap-3 items-center p-3 sm:p-4 bg-gray-700/40 rounded-xl border border-white/10">
                      <div className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 text-sm">{topic}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Content/Curriculum */}
            {course.chapters && course.chapters.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2.5 sm:p-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Course Curriculum</h2>
                    <p className="text-gray-400 text-xs sm:text-sm">{course.chapters.length} chapters • {course.chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)} lessons</p>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {course.chapters.map((chapter, idx) => (
                    <div key={chapter.id} className="bg-gray-700/40 border border-white/10 rounded-xl overflow-hidden">
                      {/* Accordion header — tappable on mobile */}
                      <button
                        onClick={() => toggleChapter(idx)}
                        className="w-full flex items-center gap-3 p-3 sm:p-5 hover:bg-gray-700/60 transition-colors text-left"
                      >
                        <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-white text-sm sm:text-lg shadow-lg">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-lg text-white leading-snug truncate">{chapter.title}</h3>
                          <p className="text-gray-400 text-xs">{chapter.lessons?.length || 0} lessons{chapter.quiz?.enabled ? ' • Quiz' : ''}</p>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`flex-shrink-0 text-gray-400 transition-transform ${expandedChapters[idx] ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {/* Expandable lesson list */}
                      {expandedChapters[idx] && (
                        <div className="px-3 pb-3 sm:px-5 sm:pb-5 border-t border-white/5">
                          {chapter.description && (
                            <p className="text-gray-400 text-xs sm:text-sm mt-3 mb-3 leading-relaxed">{chapter.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                              <PlayCircle size={12} />
                              {chapter.lessons?.length || 0} lessons
                            </span>
                            {chapter.quiz?.enabled && (
                              <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30">
                                <Brain size={12} />
                                Quiz
                              </span>
                            )}
                            {chapter.assignment?.enabled && (
                              <span className="flex items-center gap-1 px-2.5 py-1 bg-pink-500/20 text-pink-300 text-xs font-medium rounded-full border border-pink-500/30">
                                <FileText size={12} />
                                Assignment
                              </span>
                            )}
                          </div>
                          {chapter.lessons && chapter.lessons.length > 0 && (
                            <ul className="mt-3 space-y-1">
                              {chapter.lessons.map((lesson, li) => (
                                <li key={li} className="flex items-center gap-2 text-xs text-gray-400 py-1 border-b border-white/5 last:border-0">
                                  <PlayCircle size={12} className="text-blue-400 flex-shrink-0" />
                                  <span className="truncate">{lesson.title}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Prerequisites</h2>
                </div>
                <ul className="space-y-3">
                  {course.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <ChevronRight className="flex-shrink-0 text-orange-400 mt-1" size={20} />
                      <span>{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar — desktop only (mobile card is rendered above main content) */}
          <div className="hidden lg:block space-y-6">
            {/* Enrollment Card */}
            <EnrollCard
              alreadyEnrolled={alreadyEnrolled}
              enrolling={enrolling}
              course={course}
              onEnroll={handleEnroll}
              onContinue={handleContinue}
            />

            {/* Course Features */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">This course includes:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-blue-400" size={18} />
                  </div>
                  <span>AI-Personalized Learning</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="text-purple-400" size={18} />
                  </div>
                  <span>Adaptive Quizzes</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <Award className="text-pink-400" size={18} />
                  </div>
                  <span>Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-400" size={18} />
                  </div>
                  <span>Progress Tracking</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Star className="text-yellow-400" size={18} />
                  </div>
                  <span>24/7 AI Buddy Support</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Course Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Level</span>
                  <span className="text-white font-semibold capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-semibold">{course.duration} weeks</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Students</span>
                  <span className="text-white font-semibold">{course.enrolledStudents || 0}</span>
                </div>
                {course.category && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white font-semibold">{course.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky CTA bar (above bottom nav) ──────────────────────── */}
      <div className="lg:hidden fixed bottom-[calc(env(safe-area-inset-bottom,0px)+3.5rem)] left-0 right-0 z-20 px-4 py-2 bg-[#0d1117]/95 backdrop-blur-xl border-t border-white/8">
        {alreadyEnrolled ? (
          <button
            onClick={handleContinue}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl text-sm shadow-lg active:scale-95 transition-transform"
          >
            Continue Learning →
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl text-sm shadow-lg disabled:opacity-50 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            {enrolling ? <><Loader className="animate-spin" size={18} /> Enrolling...</> : <>Enroll Now <ChevronRight size={16} /></>}
          </button>
        )}
      </div>
    </StudentLayout>
  );
};

// ── Reusable enrollment card component ──────────────────────────────────────
const EnrollCard = ({ alreadyEnrolled, enrolling, course, onEnroll, onContinue }) => (
  <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white lg:sticky lg:top-6 shadow-2xl">
    <div className="text-center">
      {alreadyEnrolled ? (
        <>
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white/30">
            <CheckCircle className="text-white" size={28} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Already Enrolled!</h3>
          <p className="text-blue-100 text-sm mb-4">Continue your learning journey</p>
          <button
            onClick={onContinue}
            className="w-full px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:scale-105 transform duration-200 text-sm"
          >
            Continue Learning →
          </button>
        </>
      ) : (
        <>
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white/30">
            <Sparkles className="text-yellow-300" size={28} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to Start?</h3>
          <p className="text-blue-100 text-sm mb-4">
            {course.chapters?.length > 0
              ? `${course.chapters.length} structured chapters`
              : 'AI-personalized curriculum'}
          </p>
          <button
            onClick={onEnroll}
            disabled={enrolling}
            className="w-full px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transform duration-200 flex items-center justify-center gap-2 text-sm"
          >
            {enrolling ? (<><Loader className="animate-spin" size={18} />Enrolling...</>) : (<>Enroll Now<ChevronRight size={18} /></>)}
          </button>
        </>
      )}
    </div>
  </div>
);

export default CourseDetails;
