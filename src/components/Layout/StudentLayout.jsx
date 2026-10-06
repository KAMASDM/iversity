import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Award,
  MessageCircle,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { logOut } from '../../services/authService';
import { useAuthStore, useBuddyStore } from '../../store';
import { toast } from 'react-toastify';
import VirtualBuddy from '../VirtualBuddy';

const menuItems = [
  { path: '/student/dashboard',    label: 'Dashboard',    short: 'Home',     icon: LayoutDashboard, match: ['/student/dashboard', '/student/course-room', '/student/exam'] },
  { path: '/student/courses',      label: 'Courses',      short: 'Courses',  icon: BookOpen,        match: ['/student/courses', '/student/questionnaire'] },
  { path: '/student/progress',     label: 'My progress',  short: 'Progress', icon: TrendingUp,      match: ['/student/progress'] },
  { path: '/student/certificates', label: 'Certificates', short: 'Certs',    icon: Award,           match: ['/student/certificates'] },
];

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, clearAuth } = useAuthStore();
  const { toggleBuddy, isOpen: buddyOpen } = useBuddyStore();

  const handleLogout = async () => {
    try {
      await logOut();
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to logout');
    }
  };

  const isActive = (item) => item.match.some(p => location.pathname.startsWith(p));

  // The course room has its own outline + action bar, so the app chrome steps back
  const isInCourseRoom = location.pathname.startsWith('/student/course-room');
  const initial = (userData?.displayName || userData?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-950">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900">
        Skip to content
      </a>

      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <nav className="fixed z-30 w-full border-b border-white/[0.07] bg-[#0d1117]/90 backdrop-blur-xl">
        <div className="flex h-14 lg:h-16 items-center justify-between px-4 sm:px-6">
          <Link to="/student/dashboard" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
              <GraduationCap size={14} className="text-white" />
            </span>
            <span className="text-lg font-bold">
              <span className="text-white">i</span>
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Versity</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {!isInCourseRoom && <button
              onClick={toggleBuddy}
              aria-pressed={buddyOpen}
              className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-violet-200 transition-colors hover:bg-violet-500/15"
            >
              <span className="relative">
                <MessageCircle size={18} />
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Ask Buddy
            </button>}

            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium leading-tight text-white">{userData?.displayName}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/40 to-violet-500/40 text-sm font-semibold text-white ring-1 ring-white/10" aria-hidden="true">
                {initial}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-14 lg:pt-16">
        {/* ── Desktop sidebar (icon rail inside the course room) ──────────── */}
        <aside
          className={`${isInCourseRoom ? 'w-[72px]' : 'w-60'} hidden lg:flex flex-col shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-white/[0.07] bg-[#0d1117]`}
          aria-label="Main navigation"
        >
          <nav className="mt-4 flex-1 space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={isInCourseRoom ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-xl py-2.5 transition-colors ${isInCourseRoom ? 'justify-center px-0' : 'px-3.5'} ${
                    active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-blue-300' : ''} />
                  {!isInCourseRoom && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
          <div className="px-3 pb-4">
            <button
              onClick={handleLogout}
              title={isInCourseRoom ? 'Sign out' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-white/[0.05] hover:text-rose-300 ${isInCourseRoom ? 'justify-center' : 'px-3.5'}`}
            >
              <LogOut size={18} />
              {!isInCourseRoom && 'Sign out'}
            </button>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <main
          id="main"
          className={`min-w-0 flex-1 min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-4rem)] ${isInCourseRoom ? '' : 'p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8'}`}
        >
          {children}
        </main>
      </div>

      {/* ── Bottom nav — mobile only, hidden in course room ───────────────── */}
      {!isInCourseRoom && (
        <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.07] bg-[#0d1117]/95 backdrop-blur-xl" aria-label="Main navigation">
          <div className="flex items-center justify-around px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-w-[3.5rem] flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors ${active ? 'text-blue-300' : 'text-gray-500'}`}
                >
                  <span className={`rounded-xl p-1.5 ${active ? 'bg-blue-500/15' : ''}`}>
                    <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                  </span>
                  <span className="text-[10px] font-medium">{item.short}</span>
                </Link>
              );
            })}
            <button
              onClick={toggleBuddy}
              className="relative flex min-w-[3.5rem] flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-violet-300"
            >
              <span className="relative rounded-xl p-1.5">
                <MessageCircle size={20} strokeWidth={1.8} />
                <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-medium">Buddy</span>
            </button>
          </div>
        </nav>
      )}

      <VirtualBuddy />
    </div>
  );
};

export default StudentLayout;
