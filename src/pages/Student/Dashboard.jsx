import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import { useAuthStore, useEnrollmentStore } from '../../store';
import { getStudentEnrollments, getStudentAnalytics } from '../../services/firestoreService';
import { BookOpen, TrendingUp, Award, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const { user, userData } = useAuthStore();
  const { setEnrollments } = useEnrollmentStore();
  const [enrollments, setLocalEnrollments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const enrollmentsData = await getStudentEnrollments(user.uid);
      setLocalEnrollments(enrollmentsData);
      setEnrollments(enrollmentsData);

      const analyticsData = await getStudentAnalytics(user.uid);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Active Courses',
      value: analytics?.activeCourses || 0,
      icon: BookOpen,
      color: 'primary',
    },
    {
      title: 'Completed',
      value: analytics?.completedCourses || 0,
      icon: Award,
      color: 'secondary',
    },
    {
      title: 'Avg Progress',
      value: `${Math.round(analytics?.averageProgress || 0)}%`,
      icon: TrendingUp,
      color: 'primary',
    },
    {
      title: 'Quizzes Taken',
      value: analytics?.totalQuizzes || 0,
      icon: Clock,
      color: 'secondary',
    },
  ];

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {userData?.displayName}! 👋
          </h1>
          <p className="text-gray-400 mt-2">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = index % 2 === 0 
              ? 'from-blue-500 to-blue-600' 
              : 'from-purple-500 to-purple-600';
            return (
              <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${colors}`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Learning */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Continue Learning</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : enrollments.filter(e => e.status === 'active').length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-300 mb-4">You haven't enrolled in any courses yet</p>
              <Link to="/student/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments
                .filter(e => e.status === 'active')
                .map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    to={`/student/course-room/${enrollment.id}`}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">Course Progress</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Module: {enrollment.currentModule || 'Getting Started'}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="font-medium text-white">{enrollment.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {enrollment.completedModules?.length || 0} modules completed
                      </span>
                      <span className="text-blue-400 font-medium">Continue →</span>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/student/courses" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group">
            <BookOpen className="mx-auto text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="font-semibold text-lg mb-2 text-white">Browse Courses</h3>
            <p className="text-sm text-gray-400">Discover new courses to enroll in</p>
          </Link>

          <Link to="/student/progress" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group">
            <TrendingUp className="mx-auto text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="font-semibold text-lg mb-2 text-white">My Progress</h3>
            <p className="text-sm text-gray-400">Track your learning journey</p>
          </Link>

          <Link to="/student/certificates" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group">
            <Award className="mx-auto text-pink-400 mb-4 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="font-semibold text-lg mb-2 text-white">Certificates</h3>
            <p className="text-sm text-gray-400">View your earned certificates</p>
          </Link>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
