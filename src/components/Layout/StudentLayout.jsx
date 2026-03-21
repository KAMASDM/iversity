import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  TrendingUp, 
  Award, 
  MessageCircle,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { logOut } from '../../services/authService';
import { useAuthStore, useBuddyStore } from '../../store';
import { toast } from 'react-toastify';
import VirtualBuddy from '../VirtualBuddy';

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, clearAuth } = useAuthStore();
  const { toggleBuddy } = useBuddyStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const menuItems = [
    { path: '/student/dashboard',    label: 'Dashboard',  icon: LayoutDashboard },
    { path: '/student/courses',      label: 'Courses',    icon: BookOpen        },
    { path: '/student/progress',     label: 'Progress',   icon: TrendingUp      },
    { path: '/student/certificates', label: 'Certs',      icon: Award           },
  ];

  // Detect if we're inside a course room (hide bottom nav there — course room has its own mobile nav)
  const isInCourseRoom = location.pathname.startsWith('/student/course-room');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">

      {/* ── Top Navigation bar ─────────────────────────────────────────────── */}
      <nav className="bg-[#0d1117]/90 backdrop-blur-xl border-b border-white/8 fixed w-full z-30 shadow-lg">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 lg:h-16">

            {/* Left: logo + hamburger (desktop only) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex p-2 rounded-lg text-gray-400 hover:bg-white/10 transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <GraduationCap size={14} className="text-white" />
                </div>
                <span className="text-lg font-bold">
                  <span className="text-white">i</span>
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Versity</span>
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleBuddy}
                className="p-2 rounded-lg hover:bg-blue-500/15 text-blue-400 relative transition-colors"
                title="AI Buddy"
              >
                <MessageCircle size={19} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              </button>

              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white leading-tight">{userData?.displayName}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-14 lg:pt-16">

        {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
        <aside
          className={`${
            sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'
          } hidden lg:block flex-shrink-0 transition-all duration-300 bg-[#0d1117] border-r border-white/8 sticky top-16 h-[calc(100vh-4rem)]`}
        >
          <nav className="mt-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-gray-400 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white/8 hover:text-red-400 transition-all text-sm font-medium mt-4"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main className={`flex-1 min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-4rem)] bg-gray-950 ${isInCourseRoom ? 'p-0' : 'p-4 sm:p-6 lg:p-8'} ${!isInCourseRoom ? 'pb-20 lg:pb-8' : ''}`}>
          {children}
        </main>
      </div>

      {/* ── Bottom Nav — mobile only, hidden in course room ─────────────────── */}
      {!isInCourseRoom && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0d1117]/95 backdrop-blur-xl border-t border-white/8 shadow-2xl">
          <div className="flex items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom,8px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[3.5rem] ${
                    isActive ? 'text-blue-400' : 'text-gray-500'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-500/15' : ''}`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={toggleBuddy}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-violet-400 min-w-[3.5rem] relative"
            >
              <div className="p-1.5 rounded-xl relative">
                <MessageCircle size={20} strokeWidth={1.8} />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full" />
              </div>
              <span className="text-[10px] font-medium">Buddy</span>
            </button>
          </div>
        </nav>
      )}

      {/* Virtual Buddy */}
      <VirtualBuddy />

      {/* Overlay for mobile sidebar (desktop only) */}
      {sidebarOpen && (
        <div
          className="hidden lg:block fixed inset-0 bg-black/30 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentLayout;
