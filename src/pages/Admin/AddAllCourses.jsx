import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import { createCourse, updateCourse, deleteCourse, getAllCourses } from '../../services/firestoreService';
import { useAuthStore } from '../../store';
import { toast } from 'react-toastify';
import { Sparkles, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
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
  // 'add' = create new | 'update' = find-by-title and replace (also deletes duplicates)
  const [mode, setMode] = useState('add');

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

  // Find all Firestore docs matching a title; update the first, delete the rest.
  const handleUpdateSelected = async () => {
    if (selectedCourses.length === 0) {
      toast.warning('Select at least one course to update.');
      return;
    }
    setLoading(true);
    setResults([]);

    let existingCourses;
    try {
      existingCourses = await getAllCourses();
    } catch (err) {
      toast.error('Failed to fetch existing courses from Firestore.');
      setLoading(false);
      return;
    }

    const newResults = [];

    for (const course of selectedCourses) {
      const matches = existingCourses.filter(c => c.title === course.title);

      if (matches.length === 0) {
        // Not found — create instead
        try {
          const courseId = await createCourse(course, user.uid);
          newResults.push({ title: course.title, status: 'success', id: courseId, note: 'Created (not found)' });
        } catch (err) {
          newResults.push({ title: course.title, status: 'error', error: err.message });
        }
      } else {
        // Update the first match with the new seed data
        const [primary, ...duplicates] = matches;
        try {
          await updateCourse(primary.id, {
            ...course,
            createdBy: primary.createdBy ?? user.uid,
          });
          // Delete any duplicate documents with the same title
          for (const dup of duplicates) {
            await deleteCourse(dup.id);
          }
          newResults.push({
            title: course.title,
            status: 'success',
            id: primary.id,
            note: duplicates.length > 0 ? `Updated + removed ${duplicates.length} duplicate(s)` : 'Updated',
          });
        } catch (err) {
          newResults.push({ title: course.title, status: 'error', error: err.message });
        }
      }
      setResults([...newResults]);
    }

    setLoading(false);
    setDone(true);
    const successCount = newResults.filter(r => r.status === 'success').length;
    if (successCount === selectedCourses.length) {
      toast.success(`${successCount} course${successCount !== 1 ? 's' : ''} updated successfully!`);
    } else {
      toast.warning(`${successCount}/${selectedCourses.length} courses updated. Check results.`);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={32} />
            <h1 className="text-3xl font-bold">Add / Update Courses</h1>
          </div>
          <p className="text-blue-100">
            Select courses below, then choose <strong>Add</strong> to create new entries or <strong>Update</strong> to replace existing content (and remove duplicates).
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => { setMode('add'); setDone(false); setResults([]); }}
            disabled={loading}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              mode === 'add'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            ➕ Add New
          </button>
          <button
            onClick={() => { setMode('update'); setDone(false); setResults([]); }}
            disabled={loading}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              mode === 'update'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center justify-center gap-2"><RefreshCw size={15} /> Update Existing</span>
          </button>
        </div>

        {mode === 'update' && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
            <strong>Update mode:</strong> Finds each selected course in Firestore by its title, replaces its content with the current seed data, and deletes any duplicate documents with the same title.
          </div>
        )}

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
                    <span className="text-green-400 text-xs font-mono">
                      {result.note ? result.note : result.id}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={mode === 'update' ? handleUpdateSelected : handleAddSelected}
            disabled={loading || done || selected.size === 0}
            className={`flex-1 py-4 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 ${
              mode === 'update'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}
          >
            {loading
              ? `${mode === 'update' ? 'Updating' : 'Adding'} courses… (${results.length}/${selectedCourses.length})`
              : done
              ? '✅ Done'
              : mode === 'update'
              ? `Update ${selected.size} Selected Course${selected.size !== 1 ? 's' : ''}`
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
