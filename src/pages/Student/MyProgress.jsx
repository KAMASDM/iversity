import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import { useAuthStore } from '../../store';
import { 
  getStudentEnrollments, 
  getCourse,
  getStudentGamification,
  getStudentAnalytics
} from '../../services/firestoreService';
import { 
  TrendingUp, Award, BookOpen, Clock, Target, Zap, 
  Trophy, Flame, Star, CheckCircle, PlayCircle, Brain,
  BarChart3, Calendar, Loader, ChevronRight, Medal
} from 'lucide-react';

const MyProgress = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState({});
  const [gamification, setGamification] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;

    try {
      // Load enrollments
      const enrollmentsData = await getStudentEnrollments(user.uid);
      setEnrollments(enrollmentsData);

      // Load courses for each enrollment
      const coursesData = {};
      const gamificationData = {};
      
      for (const enrollment of enrollmentsData) {
        const course = await getCourse(enrollment.courseId);
        coursesData[enrollment.courseId] = course;
        
        // Load gamification data for each course
        const gamData = await getStudentGamification(user.uid, enrollment.courseId);
        gamificationData[enrollment.courseId] = gamData;
      }
      
      setCourses(coursesData);
      setGamification(gamificationData);

      // Load overall analytics
      const analyticsData = await getStudentAnalytics(user.uid);
      setAnalytics(analyticsData);

    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total stats across all courses
  const totalStats = {
    totalXP: Object.values(gamification).reduce((sum, g) => sum + (g.points || 0), 0),
    totalBadges: Object.values(gamification).reduce((sum, g) => sum + (g.badges?.length || 0), 0),
    maxStreak: Math.max(...Object.values(gamification).map(g => g.streak || 0), 0),
    avgProgress: enrollments.length > 0 
      ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length 
      : 0,
  };

  const getBadgeInfo = (badgeId) => {
    const badges = {
      first_lesson: { name: 'First Steps', icon: '🎯', color: 'from-blue-500 to-cyan-500' },
      quiz_master: { name: 'Quiz Master', icon: '🧠', color: 'from-purple-500 to-pink-500' },
      week_warrior: { name: 'Week Warrior', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
      streak_7: { name: '7 Day Streak', icon: '🔥', color: 'from-red-500 to-orange-500' },
      assignment_ace: { name: 'Assignment Ace', icon: '📝', color: 'from-green-500 to-emerald-500' },
      helpful_hand: { name: 'Helpful Hand', icon: '🤝', color: 'from-indigo-500 to-purple-500' },
    };
    return badges[badgeId] || { name: badgeId, icon: '🏆', color: 'from-gray-500 to-gray-600' };
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="animate-spin text-blue-500 mb-4" size={48} />
          <p className="text-gray-400 text-lg">Loading your progress...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">My Progress</h1>
          <p className="text-gray-400 text-lg">Track your learning journey and achievements</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Zap size={32} />
                <span className="text-sm opacity-80">Total</span>
              </div>
              <p className="text-4xl font-bold mb-1">{totalStats.totalXP}</p>
              <p className="text-blue-100 text-sm">Experience Points</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Trophy size={32} />
                <span className="text-sm opacity-80">Earned</span>
              </div>
              <p className="text-4xl font-bold mb-1">{totalStats.totalBadges}</p>
              <p className="text-purple-100 text-sm">Badges Unlocked</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Flame size={32} />
                <span className="text-sm opacity-80">Current</span>
              </div>
              <p className="text-4xl font-bold mb-1">{totalStats.maxStreak}</p>
              <p className="text-orange-100 text-sm">Day Streak</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp size={32} />
                <span className="text-sm opacity-80">Average</span>
              </div>
              <p className="text-4xl font-bold mb-1">{Math.round(totalStats.avgProgress)}%</p>
              <p className="text-green-100 text-sm">Completion Rate</p>
            </div>
          </div>
        </div>

        {/* Active Courses */}
        {enrollments.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-white mb-2">No Courses Yet</h3>
            <p className="text-gray-400 mb-6">Start your learning journey by enrolling in a course</p>
            <button
              onClick={() => navigate('/student/courses')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white hover:scale-105 transition-transform"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <>
            {/* Course Progress Cards */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Course Progress</h2>
              <div className="grid gap-6">
                {enrollments.map((enrollment) => {
                  const course = courses[enrollment.courseId];
                  const courseGamification = gamification[enrollment.courseId] || {};
                  
                  if (!course) return null;

                  return (
                    <div 
                      key={enrollment.id}
                      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white">{course.title}</h3>
                              {enrollment.status === 'completed' && (
                                <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30">
                                  <CheckCircle size={14} />
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">{course.category}</p>
                          </div>
                          <button
                            onClick={() => navigate(`/student/course-room/${enrollment.id}`)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                          >
                            Continue
                            <ChevronRight size={16} />
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Overall Progress</span>
                            <span className="font-bold text-white">{Math.round(enrollment.progress || 0)}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                              <PlayCircle className="text-blue-400" size={18} />
                              <span className="text-xs text-gray-400">Lessons</span>
                            </div>
                            <p className="text-lg font-bold text-white">
                              {enrollment.completedLessons?.length || 0}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                              <Brain className="text-purple-400" size={18} />
                              <span className="text-xs text-gray-400">Quizzes</span>
                            </div>
                            <p className="text-lg font-bold text-white">
                              {enrollment.quizResults?.length || 0}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="text-yellow-400" size={18} />
                              <span className="text-xs text-gray-400">XP</span>
                            </div>
                            <p className="text-lg font-bold text-white">
                              {courseGamification.points || 0}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                              <Medal className="text-pink-400" size={18} />
                              <span className="text-xs text-gray-400">Level</span>
                            </div>
                            <p className="text-lg font-bold text-white">
                              {courseGamification.level || 1}
                            </p>
                          </div>
                        </div>

                        {/* Badges */}
                        {courseGamification.badges && courseGamification.badges.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-400 mb-2">Badges Earned:</p>
                            <div className="flex flex-wrap gap-2">
                              {courseGamification.badges.map((badgeId, idx) => {
                                const badge = getBadgeInfo(badgeId);
                                return (
                                  <div
                                    key={idx}
                                    className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${badge.color} rounded-lg text-white text-sm font-semibold`}
                                  >
                                    <span className="text-lg">{badge.icon}</span>
                                    <span>{badge.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl">
                  <Star className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Recent Achievements</h2>
              </div>

              {Object.entries(gamification).map(([courseId, gamData]) => {
                const course = courses[courseId];
                if (!gamData.achievements || gamData.achievements.length === 0) return null;

                return (
                  <div key={courseId} className="mb-6 last:mb-0">
                    <p className="text-sm text-gray-400 mb-3 font-semibold">{course?.title}</p>
                    <div className="space-y-2">
                      {gamData.achievements.slice(0, 5).map((achievement, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                            <Star className="text-white" size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white">{achievement.title}</p>
                            <p className="text-sm text-gray-400">{achievement.description}</p>
                          </div>
                          <span className="text-yellow-400 font-bold">+{achievement.points} XP</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {Object.values(gamification).every(g => !g.achievements || g.achievements.length === 0) && (
                <div className="text-center py-8">
                  <Trophy className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-400">Complete lessons and quizzes to earn achievements!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default MyProgress;
