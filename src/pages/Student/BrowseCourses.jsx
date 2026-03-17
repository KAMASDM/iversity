import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/Layout/StudentLayout';
import { getPublishedCourses } from '../../services/firestoreService';
import { BookOpen, Clock, Users, CheckCircle, Sparkles, TrendingUp, Award, Search, Filter, Loader } from 'lucide-react';

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getPublishedCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || course.level === filter;
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getLevelColor = (level) => {
    switch(level) {
      case 'beginner': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-blue-500 to-indigo-600';
      case 'advanced': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelBadgeColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'advanced': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-yellow-300" size={28} />
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Explore Courses
              </h1>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">
              Discover AI-powered learning paths tailored to your goals. Start your journey with personalized curriculum and adaptive quizzes.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
                <Award size={20} />
                <span className="font-medium">Earn Certificates</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
                <TrendingUp size={20} />
                <span className="font-medium">Track Progress</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
                <Sparkles size={20} />
                <span className="font-medium">AI-Powered</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Search and Filter Section */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Level Filter */}
            <div className="flex gap-2">
              {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filter === level
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            <Filter size={16} className="inline mr-2" />
            Showing <span className="text-white font-semibold">{filteredCourses.length}</span> of {courses.length} courses
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-gray-400 text-lg">Loading amazing courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white hover:scale-105 transition-transform"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="group bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-gray-800/70 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Course Header with Gradient */}
                <div className={`bg-gradient-to-r ${getLevelColor(course.level)} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 ${getLevelBadgeColor(course.level)} text-xs font-bold rounded-full border uppercase tracking-wide`}>
                        {course.level}
                      </span>
                      {course.chapters && course.chapters.length > 0 && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30">
                          <CheckCircle size={12} />
                          Structured
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-200 transition-colors">
                      {course.title}
                    </h3>
                    {course.category && (
                      <p className="text-xs text-white/70 uppercase tracking-wider">{course.category}</p>
                    )}
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-6">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-700/40 rounded-lg p-3 text-center border border-white/10">
                      <Clock className="mx-auto text-blue-400 mb-1" size={20} />
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="text-sm font-bold text-white">{course.duration}w</p>
                    </div>
                    <div className="bg-gray-700/40 rounded-lg p-3 text-center border border-white/10">
                      <BookOpen className="mx-auto text-purple-400 mb-1" size={20} />
                      <p className="text-xs text-gray-400">Content</p>
                      <p className="text-sm font-bold text-white">
                        {course.chapters && course.chapters.length > 0 
                          ? `${course.chapters.length} ch`
                          : `${course.topics?.length || 0} top`
                        }
                      </p>
                    </div>
                    <div className="bg-gray-700/40 rounded-lg p-3 text-center border border-white/10">
                      <Users className="mx-auto text-pink-400 mb-1" size={20} />
                      <p className="text-xs text-gray-400">Students</p>
                      <p className="text-sm font-bold text-white">{course.enrolledStudents || 0}</p>
                    </div>
                  </div>

                  {/* Topics Preview */}
                  {course.topics && course.topics.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {course.topics.slice(0, 3).map((topic, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-700/40 text-gray-300 text-xs rounded-md border border-white/10">
                            {topic}
                          </span>
                        ))}
                        {course.topics.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700/40 text-gray-400 text-xs rounded-md border border-white/10">
                            +{course.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Link
                    to={`/student/courses/${course.id}`}
                    className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-center hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl group-hover:scale-105 transform duration-200"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default BrowseCourses;
