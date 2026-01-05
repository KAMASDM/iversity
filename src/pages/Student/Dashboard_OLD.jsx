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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userData?.displayName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <Icon className={`text-${stat.color}-600`} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Learning */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
          {loading ? (
            <p>Loading...</p>
          ) : enrollments.filter(e => e.status === 'active').length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet</p>
              <Link to="/student/courses" className="btn-primary inline-block">
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
                    className="card hover:shadow-xl transition-shadow"
                  >
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">Course Progress</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Module: {enrollment.currentModule || 'Getting Started'}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{enrollment.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {enrollment.completedModules?.length || 0} modules completed
                      </span>
                      <span className="text-primary-600 font-medium">Continue →</span>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/student/courses" className="card text-center hover:shadow-xl transition-shadow">
            <BookOpen className="mx-auto text-primary-600 mb-4" size={48} />
            <h3 className="font-semibold text-lg mb-2">Browse Courses</h3>
            <p className="text-sm text-gray-600">Discover new courses to enroll in</p>
          </Link>

          <Link to="/student/progress" className="card text-center hover:shadow-xl transition-shadow">
            <TrendingUp className="mx-auto text-primary-600 mb-4" size={48} />
            <h3 className="font-semibold text-lg mb-2">My Progress</h3>
            <p className="text-sm text-gray-600">Track your learning journey</p>
          </Link>

          <Link to="/student/certificates" className="card text-center hover:shadow-xl transition-shadow">
            <Award className="mx-auto text-primary-600 mb-4" size={48} />
            <h3 className="font-semibold text-lg mb-2">Certificates</h3>
            <p className="text-sm text-gray-600">View your earned certificates</p>
          </Link>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
