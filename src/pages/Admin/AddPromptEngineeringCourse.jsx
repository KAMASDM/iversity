import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import { createCourse } from '../../services/firestoreService';
import { useAuthStore } from '../../store';
import { toast } from 'react-toastify';
import { Sparkles } from 'lucide-react';
import { promptEngineeringCourse } from '../../seedData/promptEngineeringCourse';

const AddPromptEngineeringCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Use the full course data including chapters and lessons
  const courseData = promptEngineeringCourse;

  const handleAddCourse = async () => {
    setLoading(true);
    try {
      const courseId = await createCourse(courseData, user.uid);
      toast.success('Prompt Engineering course added successfully!');
      navigate(`/admin/courses/edit/${courseId}`);
    } catch (error) {
      toast.error('Failed to add course');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={32} />
            <h1 className="text-3xl font-bold">Add Prompt Engineering Course</h1>
          </div>
          <p className="text-blue-100">
            Click the button below to add a comprehensive Prompt Engineering course to your platform.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Course Preview</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Title</h3>
              <p className="text-gray-300">{courseData.title}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300">{courseData.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Category</h3>
                <p className="text-white">{courseData.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Level</h3>
                <p className="text-white capitalize">{courseData.level}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Duration</h3>
                <p className="text-white">{courseData.duration} weeks</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Content Structure</h3>
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <p className="text-gray-300">📚 {courseData.chapters.length} Chapters</p>
                <p className="text-gray-300">📖 {courseData.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)} Lessons</p>
                <p className="text-gray-300">✅ {courseData.chapters.filter(ch => ch.quiz?.enabled).length} Quizzes</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Topics ({courseData.topics.length})</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {courseData.topics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Learning Objectives</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {courseData.objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Prerequisites</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {courseData.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleAddCourse}
              disabled={loading}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Adding Course...' : 'Add This Course'}
            </button>
            <button
              onClick={() => navigate('/admin/courses')}
              disabled={loading}
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddPromptEngineeringCourse;
