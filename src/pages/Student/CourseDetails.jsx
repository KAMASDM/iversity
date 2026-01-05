import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import { getCourse } from '../../services/firestoreService';
import { Clock, BookOpen, CheckCircle, Users } from 'lucide-react';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
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

  const handleEnroll = () => {
    navigate(`/student/questionnaire/${courseId}`);
  };

  if (loading) return <StudentLayout><p>Loading...</p></StudentLayout>;
  if (!course) return <StudentLayout><p>Course not found</p></StudentLayout>;

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="mb-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
              {course.level}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-gray-600">{course.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="card text-center">
            <Clock className="mx-auto text-primary-600 mb-2" size={32} />
            <p className="text-2xl font-bold">{course.duration}</p>
            <p className="text-sm text-gray-600">Weeks</p>
          </div>
          <div className="card text-center">
            <BookOpen className="mx-auto text-primary-600 mb-2" size={32} />
            <p className="text-2xl font-bold">{course.topics?.length || 0}</p>
            <p className="text-sm text-gray-600">Topics</p>
          </div>
          <div className="card text-center">
            <Users className="mx-auto text-primary-600 mb-2" size={32} />
            <p className="text-2xl font-bold">{course.enrolledStudents || 0}</p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
          <div className="grid gap-3">
            {course.objectives?.map((objective, index) => (
              <div key={index} className="flex gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <p>{objective}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Topics Covered */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Topics Covered</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {course.topics?.map((topic, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <p>{topic}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
            <ul className="list-disc list-inside space-y-2">
              {course.prerequisites.map((prerequisite, index) => (
                <li key={index}>{prerequisite}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Enroll Button */}
        <div className="card bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="mb-6">Get personalized curriculum based on your knowledge level</p>
            <button onClick={handleEnroll} className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default CourseDetails;
