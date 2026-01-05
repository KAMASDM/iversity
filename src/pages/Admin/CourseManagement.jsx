import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import { getAllCourses, deleteCourse } from '../../services/firestoreService';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
      toast.success('Course deleted successfully');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Course Management</h1>
          <Link to="/admin/courses/create" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform">
            <Plus size={20} />
            Create Course
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="grid gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                    <p className="text-gray-400 mt-2">{course.description}</p>
                    <div className="flex gap-4 mt-4 text-sm text-gray-500">
                      <span>{course.enrolledStudents || 0} students</span>
                      <span className="capitalize">{course.level}</span>
                      <span>{course.duration} weeks</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/courses/content/${course.id}`}
                      className="p-2 hover:bg-white/10 text-purple-400 rounded transition-colors"
                      title="Manage Content"
                    >
                      <FileText size={20} />
                    </Link>
                    <Link
                      to={`/admin/courses/edit/${course.id}`}
                      className="p-2 hover:bg-white/10 text-blue-400 rounded transition-colors"
                      title="Edit Course"
                    >
                      <Edit size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CourseManagement;
