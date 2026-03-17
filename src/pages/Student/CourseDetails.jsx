import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import { getCourse, enrollStudent, getStudentEnrollments } from '../../services/firestoreService';
import { useAuthStore } from '../../store';
import { 
  Clock, BookOpen, CheckCircle, Users, Loader, Award, Target, 
  PlayCircle, FileText, Brain, Sparkles, TrendingUp, ArrowLeft,
  Star, Calendar, BarChart3, ChevronRight
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
      <div className="space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student/courses')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Courses</span>
        </button>

        {/* Hero Section */}
        <div className={`relative overflow-hidden bg-gradient-to-r ${getLevelColor(course.level)} rounded-3xl p-8 md:p-12`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-4 py-2 ${getLevelBadgeColor(course.level)} text-sm font-bold rounded-full border uppercase tracking-wide`}>
                {course.level}
              </span>
              {course.category && (
                <span className="px-4 py-2 bg-white/20 text-white text-sm font-bold rounded-full border border-white/30">
                  {course.category}
                </span>
              )}
              {course.chapters && course.chapters.length > 0 && (
                <span className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 text-sm font-bold rounded-full border border-green-500/30">
                  <CheckCircle size={16} />
                  Structured Content
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mb-8 leading-relaxed">
              {course.description}
            </p>

            {/* Key Stats Bar */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Clock className="text-white" size={24} />
                <div>
                  <p className="text-white/80 text-xs uppercase tracking-wide">Duration</p>
                  <p className="text-white font-bold text-lg">{course.duration} Weeks</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <BookOpen className="text-white" size={24} />
                <div>
                  <p className="text-white/80 text-xs uppercase tracking-wide">Content</p>
                  <p className="text-white font-bold text-lg">
                    {course.chapters && course.chapters.length > 0 
                      ? `${course.chapters.length} Chapters`
                      : `${course.topics?.length || 0} Topics`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Users className="text-white" size={24} />
                <div>
                  <p className="text-white/80 text-xs uppercase tracking-wide">Students</p>
                  <p className="text-white font-bold text-lg">{course.enrolledStudents || 0} Enrolled</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            {course.objectives && course.objectives.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                    <Target className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">What You'll Learn</h2>
                </div>
                <div className="grid gap-4">
                  {course.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 bg-gray-700/40 rounded-xl border border-white/10 hover:bg-gray-700/60 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white" size={18} />
                      </div>
                      <p className="text-gray-300 leading-relaxed">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics Covered */}
            {course.topics && course.topics.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                    <Brain className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Topics Covered</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.topics.map((topic, index) => (
                    <div key={index} className="flex gap-3 items-center p-4 bg-gray-700/40 rounded-xl border border-white/10 hover:bg-gray-700/60 transition-colors group">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-sm group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <p className="text-gray-300">{topic}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Content/Curriculum */}
            {course.chapters && course.chapters.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl">
                    <BookOpen className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">Course Curriculum</h2>
                    <p className="text-gray-400 text-sm">{course.chapters.length} chapters • {course.chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)} lessons</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {course.chapters.map((chapter, idx) => (
                    <div key={chapter.id} className="bg-gray-700/40 border border-white/10 rounded-xl p-5 hover:bg-gray-700/60 hover:border-white/20 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-white mb-2">{chapter.title}</h3>
                          {chapter.description && (
                            <p className="text-gray-400 text-sm mb-3 leading-relaxed">{chapter.description}</p>
                          )}
                          <div className="flex flex-wrap gap-3">
                            <span className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                              <PlayCircle size={14} />
                              {chapter.lessons?.length || 0} lessons
                            </span>
                            {chapter.quiz?.enabled && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30">
                                <Brain size={14} />
                                Quiz included
                              </span>
                            )}
                            {chapter.assignment?.enabled && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-pink-500/20 text-pink-300 text-xs font-medium rounded-full border border-pink-500/30">
                                <FileText size={14} />
                                Assignment
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white sticky top-6 shadow-2xl">
              <div className="text-center">
                {alreadyEnrolled ? (
                  <>
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                      <CheckCircle className="text-white" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Already Enrolled!</h3>
                    <p className="text-blue-100 mb-6">Continue your learning journey where you left off</p>
                    <button 
                      onClick={handleContinue} 
                      className="w-full px-6 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                    >
                      Continue Learning →
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                      <Sparkles className="text-yellow-300" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Ready to Start?</h3>
                    <p className="text-blue-100 mb-6">
                      {course.chapters && course.chapters.length > 0 
                        ? `Start learning with ${course.chapters.length} structured chapters`
                        : 'Get AI-personalized curriculum based on your knowledge level'
                      }
                    </p>
                    <button 
                      onClick={handleEnroll} 
                      disabled={enrolling}
                      className="w-full px-6 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform duration-200 flex items-center justify-center gap-2"
                    >
                      {enrolling ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          Enroll Now
                          <ChevronRight size={20} />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

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
    </StudentLayout>
  );
};

export default CourseDetails;
