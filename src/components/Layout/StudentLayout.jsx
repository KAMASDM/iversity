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
  X 
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
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/courses', label: 'Browse Courses', icon: BookOpen },
    { path: '/student/progress', label: 'My Progress', icon: TrendingUp },
    { path: '/student/certificates', label: 'Certificates', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Top Navigation */}
      <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10 fixed w-full z-30 shadow-lg">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-300 hover:bg-white/10"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">iVersity</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleBuddy}
                className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 relative transition-colors"
                title="Virtual Buddy"
              >
                <MessageCircle size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </button>
              
              <div className="text-right">
                <p className="text-sm font-medium text-white">{userData?.displayName}</p>
                <p className="text-xs text-gray-400">Student</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-300 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out pt-16 lg:pt-0`}
        >
          <nav className="mt-8 px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-950 min-h-screen">
          {children}
        </main>
      </div>

      {/* Virtual Buddy */}
      <VirtualBuddy />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentLayout;
