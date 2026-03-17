import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { getUserData } from './services/authService';
import { useAuthStore } from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Loading from './components/Loading';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import CourseManagement from './pages/Admin/CourseManagement';
import CreateCourse from './pages/Admin/CreateCourse';
import EditCourse from './pages/Admin/EditCourse';
import CourseContent from './pages/Admin/CourseContent';
import StudentManagement from './pages/Admin/StudentManagement';
import AddPromptEngineeringCourse from './pages/Admin/AddPromptEngineeringCourse';
import AddAllCourses from './pages/Admin/AddAllCourses';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import BrowseCourses from './pages/Student/BrowseCourses';
import CourseDetails from './pages/Student/CourseDetails';
import Questionnaire from './pages/Student/Questionnaire';
import EnhancedCourseRoom from './pages/Student/EnhancedCourseRoom';
import MyProgress from './pages/Student/MyProgress';
import Certificates from './pages/Student/Certificates';

function App() {
  const { setUser, setUserData, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userData = await getUserData(user.uid);
        setUserData(userData);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setUserData, setLoading]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CourseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/create"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/edit/:courseId"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/content/:courseId"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CourseContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-prompt-course"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddPromptEngineeringCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-all-courses"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddAllCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StudentManagement />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <BrowseCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses/:courseId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/questionnaire/:courseId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Questionnaire />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/course-room/:enrollmentId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <EnhancedCourseRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/progress"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/certificates"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Certificates />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
