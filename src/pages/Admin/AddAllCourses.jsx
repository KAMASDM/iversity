import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import { createCourse } from '../../services/firestoreService';
import { useAuthStore } from '../../store';
import { toast } from 'react-toastify';
import { Sparkles, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { aiFoundationCourse } from '../../seedData/aiFoundationCourse';
import { promptEngineeringCourse } from '../../seedData/promptEngineeringCourse';
import { aiApiAppsCourse } from '../../seedData/aiApiAppsCourse';
import { ragVectorDbCourse } from '../../seedData/ragVectorDbCourse';
import { langchainAgentsCourse } from '../../seedData/langchainAgentsCourse';

const allCourses = [
  aiFoundationCourse,
  promptEngineeringCourse,
  aiApiAppsCourse,
  ragVectorDbCourse,
  langchainAgentsCourse,
];

const AddAllCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  const handleAddAll = async () => {
    setLoading(true);
    setResults([]);
    const newResults = [];

    for (const course of allCourses) {
      try {
        const courseId = await createCourse(course, user.uid);
        newResults.push({ title: course.title, status: 'success', id: courseId });
        setResults([...newResults]);
      } catch (error) {
        newResults.push({ title: course.title, status: 'error', error: error.message });
        setResults([...newResults]);
      }
    }

    setLoading(false);
    setDone(true);
    const successCount = newResults.filter(r => r.status === 'success').length;
    if (successCount === allCourses.length) {
      toast.success(`All ${successCount} courses added successfully!`);
    } else {
      toast.warning(`${successCount}/${allCourses.length} courses added. Check results below.`);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={32} />
            <h1 className="text-3xl font-bold">Add All Courses</h1>
          </div>
          <p className="text-blue-100">
            Add all {allCourses.length} courses to the platform in one click.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Courses to be Added</h2>
          <div className="space-y-3">
            {allCourses.map((course, idx) => {
              const result = results.find(r => r.title === course.title);
              const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    {result ? (
                      result.status === 'success' ? (
                        <CheckCircle size={18} className="text-green-400 shrink-0" />
                      ) : (
                        <AlertCircle size={18} className="text-red-400 shrink-0" />
                      )
                    ) : loading ? (
                      <Clock size={18} className="text-gray-400 shrink-0 animate-pulse" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-500 shrink-0" />
                    )}
                    <div>
                      <p className="text-white font-medium">{course.title}</p>
                      <p className="text-gray-400 text-sm capitalize">
                        {course.level} · {course.duration} weeks · {course.chapters.length} chapters · {totalLessons} lessons
                      </p>
                    </div>
                  </div>
                  {result?.status === 'error' && (
                    <span className="text-red-400 text-xs">{result.error}</span>
                  )}
                  {result?.status === 'success' && (
                    <span className="text-green-400 text-xs font-mono">{result.id}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddAll}
            disabled={loading || done}
            className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading
              ? `Adding courses… (${results.length}/${allCourses.length})`
              : done
              ? '✅ Done'
              : `Add All ${allCourses.length} Courses`}
          </button>
          <button
            onClick={() => navigate('/admin/courses')}
            disabled={loading}
            className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
          >
            {done ? 'View Courses' : 'Cancel'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddAllCourses;
