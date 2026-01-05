import { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { useAuthStore } from '../../store';
import { getAllCourses, getCourseAnalytics } from '../../services/firestoreService';
import { BookOpen, Users, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { userData } = useAuthStore();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    activeEnrollments: 0,
    certificatesIssued: 0,
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const coursesData = await getAllCourses();
      setCourses(coursesData);

      // Calculate stats
      let totalStudents = 0;
      let activeEnrollments = 0;
      
      for (const course of coursesData) {
        totalStudents += course.enrolledStudents || 0;
        const analytics = await getCourseAnalytics(course.id);
        activeEnrollments += analytics.activeStudents || 0;
      }

      setStats({
        totalCourses: coursesData.length,
        totalStudents,
        activeEnrollments,
        certificatesIssued: 0, // Will be calculated from certificates collection
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'primary' },
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'secondary' },
    { title: 'Active Enrollments', value: stats.activeEnrollments, icon: TrendingUp, color: 'primary' },
    { title: 'Certificates Issued', value: stats.certificatesIssued, icon: Award, color: 'secondary' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {userData?.displayName}! 👋
          </h1>
          <p className="text-gray-400 mt-2">Here's what's happening with your platform today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
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

        {/* Recent Courses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Courses</h2>
            <Link to="/admin/courses/create" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform">
              Create New Course
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-300 mb-4">No courses yet. Create your first course!</p>
              <Link to="/admin/courses/create" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform">
                Create Course
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <div key={course.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">{course.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.published
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}
                    >
                      {course.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{course.enrolledStudents || 0} students</span>
                    <Link
                      to={`/admin/courses/edit/${course.id}`}
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Edit →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/courses/create"
              className="p-6 border-2 border-dashed border-white/20 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 transition-all text-center group"
            >
              <BookOpen className="mx-auto text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={32} />
              <p className="font-medium text-white">Create New Course</p>
            </Link>
            <Link
              to="/admin/courses"
              className="p-6 border-2 border-dashed border-white/20 rounded-xl hover:border-purple-500 hover:bg-purple-500/10 transition-all text-center group"
            >
              <TrendingUp className="mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={32} />
              <p className="font-medium text-white">View Analytics</p>
            </Link>
            <Link
              to="/admin/students"
              className="p-6 border-2 border-dashed border-white/20 rounded-xl hover:border-pink-500 hover:bg-pink-500/10 transition-all text-center group"
            >
              <Users className="mx-auto text-pink-400 mb-2 group-hover:scale-110 transition-transform" size={32} />
              <p className="font-medium text-white">Manage Students</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
