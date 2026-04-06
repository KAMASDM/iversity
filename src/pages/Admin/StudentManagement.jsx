import { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import {
  getAllUsers,
  getAllEnrollments,
  getAllCourses,
} from '../../services/firestoreService';
import {
  Users,
  Search,
  TrendingUp,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Mail,
  Calendar,
  BarChart2,
} from 'lucide-react';

const formatDate = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ProgressBar = ({ value }) => (
  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
    <div
      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
      style={{ width: `${Math.min(Math.round(value || 0), 100)}%` }}
    />
  </div>
);

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [usersData, enrollmentsData, coursesData] = await Promise.all([
        getAllUsers(),
        getAllEnrollments(),
        getAllCourses(),
      ]);
      setStudents(usersData);
      setEnrollments(enrollmentsData);
      const courseMap = {};
      coursesData.forEach((c) => { courseMap[c.id] = c; });
      setCourses(courseMap);
    } catch (err) {
      console.error('Error loading student management data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStudentEnrollments = (studentId) =>
    enrollments.filter((e) => e.studentId === studentId);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (s.displayName || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q)
    );
  });

  // Stats
  const totalStudents = students.length;
  const activeStudents = students.filter((s) =>
    enrollments.some((e) => e.studentId === s.id && e.status === 'active')
  ).length;
  const totalEnrollments = enrollments.length;
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Learners', value: activeStudents, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Enrollments', value: totalEnrollments, icon: BookOpen, color: 'from-blue-600 to-purple-500' },
    { label: 'Courses Completed', value: completedEnrollments, icon: Award, color: 'from-green-500 to-emerald-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white">Student Management</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">{label}</p>
                <p className="text-2xl font-bold text-white">{loading ? '…' : value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Student List */}
        {loading ? (
          <p className="text-gray-400">Loading students…</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
            {search ? 'No students match your search.' : 'No students registered yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((student) => {
              const studentEnrollments = getStudentEnrollments(student.id);
              const avgProgress =
                studentEnrollments.length > 0
                  ? studentEnrollments.reduce((s, e) => s + (e.progress || 0), 0) /
                    studentEnrollments.length
                  : 0;
              const isExpanded = expandedId === student.id;
              const initials = (student.displayName || student.email || '?')
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={student.id}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden"
                >
                  {/* Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : student.id)}
                    className="w-full text-left p-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                        {initials}
                      </div>

                      {/* Name + email */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {student.displayName || '(no name)'}
                        </p>
                        <p className="text-gray-400 text-sm truncate flex items-center gap-1">
                          <Mail size={11} className="flex-shrink-0" />
                          {student.email}
                        </p>
                      </div>

                      {/* Joined */}
                      <div className="hidden md:flex flex-col items-center gap-0.5 text-xs text-gray-400 min-w-[80px]">
                        <Calendar size={12} />
                        {formatDate(student.createdAt)}
                      </div>

                      {/* Courses */}
                      <div className="hidden sm:flex flex-col items-center gap-0.5 min-w-[60px]">
                        <span className="text-white font-semibold">{studentEnrollments.length}</span>
                        <span className="text-gray-400 text-xs">courses</span>
                      </div>

                      {/* Progress */}
                      <div className="hidden lg:flex flex-col gap-1 min-w-[100px]">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Avg Progress</span>
                          <span>{Math.round(avgProgress)}%</span>
                        </div>
                        <ProgressBar value={avgProgress} />
                      </div>

                      {/* Status badge */}
                      <div className="flex-shrink-0">
                        {studentEnrollments.some((e) => e.status === 'completed') ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Completed</span>
                        ) : studentEnrollments.some((e) => e.status === 'active') ? (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Active</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">No courses</span>
                        )}
                      </div>

                      {/* Chevron */}
                      <div className="text-gray-500">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-white/10 px-5 pb-5 pt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-300 font-medium mb-2">
                        <BarChart2 size={14} />
                        Enrolled Courses ({studentEnrollments.length})
                      </div>

                      {studentEnrollments.length === 0 ? (
                        <p className="text-sm text-gray-500">Not enrolled in any course yet.</p>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {studentEnrollments.map((enr) => {
                            const course = courses[enr.courseId];
                            return (
                              <div
                                key={enr.id}
                                className="bg-white/5 rounded-xl p-4 border border-white/5"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <p className="text-white text-sm font-medium leading-tight">
                                    {course?.title || enr.courseId}
                                  </p>
                                  <span
                                    className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-full text-xs ${
                                      enr.status === 'completed'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-blue-500/20 text-blue-400'
                                    }`}
                                  >
                                    {enr.status}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>Progress</span>
                                  <span>{Math.round(enr.progress || 0)}%</span>
                                </div>
                                <ProgressBar value={enr.progress} />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                  <span>Enrolled {formatDate(enr.enrolledAt)}</span>
                                  <span>{enr.quizResults?.length || 0} quiz{enr.quizResults?.length !== 1 ? 'zes' : ''}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentManagement;
