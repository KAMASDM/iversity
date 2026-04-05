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
import { aiForMarketingCourse } from '../../seedData/aiForMarketingCourse';
import { aiForEducatorsCourse } from '../../seedData/aiForEducatorsCourse';
import { aiForFashionCourse } from '../../seedData/aiForFashionCourse';
import { aiForHealthcareCourse } from '../../seedData/aiForHealthcareCourse';
import { aiForLegalCourse } from '../../seedData/aiForLegalCourse';
import { aiForBusinessLeadersCourse } from '../../seedData/aiForBusinessLeadersCourse';
import { genAIForContentCreatorsCourse } from '../../seedData/genAIForContentCreatorsCourse';
import { aiForHRCourse } from '../../seedData/aiForHRCourse';

const allCourses = [
  aiFoundationCourse,
  promptEngineeringCourse,
  aiApiAppsCourse,
  ragVectorDbCourse,
  langchainAgentsCourse,
  aiForMarketingCourse,
  aiForEducatorsCourse,
  aiForFashionCourse,
  aiForHealthcareCourse,
  aiForLegalCourse,
  aiForBusinessLeadersCourse,
  genAIForContentCreatorsCourse,
  aiForHRCourse,
];

const AddAllCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState(() => new Set(allCourses.map(c => c.title)));

  const toggleCourse = (title) => {
    if (loading || done) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const toggleAll = () => {
    if (loading || done) return;
    setSelected(selected.size === allCourses.length ? new Set() : new Set(allCourses.map(c => c.title)));
  };

  const selectedCourses = allCourses.filter(c => selected.has(c.title));

  const handleAddSelected = async () => {
    if (selectedCourses.length === 0) {
      toast.warning('Select at least one course to add.');
      return;
    }
    setLoading(true);
    setResults([]);
    const newResults = [];

    for (const course of selectedCourses) {
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
    if (successCount === selectedCourses.length) {
      toast.success(`${successCount} course${successCount !== 1 ? 's' : ''} added successfully!`);
    } else {
      toast.warning(`${successCount}/${selectedCourses.length} courses added. Check results below.`);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={32} />
            <h1 className="text-3xl font-bold">Add Courses</h1>
          </div>
          <p className="text-blue-100">
            Select the courses you want to add to the platform, then click Add Selected Courses.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              Available Courses ({selected.size}/{allCourses.length} selected)
            </h2>
            <button
              onClick={toggleAll}
              disabled={loading || done}
              className="text-sm text-blue-300 hover:text-white transition-colors disabled:opacity-40"
            >
              {selected.size === allCourses.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="space-y-3">
            {allCourses.map((course, idx) => {
              const result = results.find(r => r.title === course.title);
              const isSelected = selected.has(course.title);
              const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
              return (
                <div
                  key={idx}
                  onClick={() => toggleCourse(course.title)}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                    loading || done
                      ? 'bg-white/5 cursor-default'
                      : isSelected
                      ? 'bg-blue-600/20 border border-blue-500/40 cursor-pointer hover:bg-blue-600/30'
                      : 'bg-white/5 border border-transparent cursor-pointer hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result ? (
                      result.status === 'success' ? (
                        <CheckCircle size={18} className="text-green-400 shrink-0" />
                      ) : (
                        <AlertCircle size={18} className="text-red-400 shrink-0" />
                      )
                    ) : loading && isSelected ? (
                      <Clock size={18} className="text-gray-400 shrink-0 animate-pulse" />
                    ) : (
                      <div className={`w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-500 border-blue-400' : 'border-gray-500'
                      }`}>
                        {isSelected && <CheckCircle size={10} className="text-white" />}
                      </div>
                    )}
                    <div>
                      <p className={`font-medium ${isSelected || result ? 'text-white' : 'text-gray-400'}`}>
                        {course.title}
                      </p>
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
            onClick={handleAddSelected}
            disabled={loading || done || selected.size === 0}
            className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading
              ? `Adding courses… (${results.length}/${selectedCourses.length})`
              : done
              ? '✅ Done'
              : `Add ${selected.size} Selected Course${selected.size !== 1 ? 's' : ''}`}
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
