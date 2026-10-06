import { useEffect, lazy, Suspense } from 'react';
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

// Pages are code-split so students never download admin tooling or seed data
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const CourseManagement = lazy(() => import('./pages/Admin/CourseManagement'));
const CreateCourse = lazy(() => import('./pages/Admin/CreateCourse'));
const EditCourse = lazy(() => import('./pages/Admin/EditCourse'));
const CourseContent = lazy(() => import('./pages/Admin/CourseContent'));
const StudentManagement = lazy(() => import('./pages/Admin/StudentManagement'));
const AddPromptEngineeringCourse = lazy(() => import('./pages/Admin/AddPromptEngineeringCourse'));
const AddAllCourses = lazy(() => import('./pages/Admin/AddAllCourses'));

// Public Pages
const CoursePreview = lazy(() => import('./pages/Public/CoursePreview'));
const VerifyCertificate = lazy(() => import('./pages/Public/VerifyCertificate'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/Student/Dashboard'));
const BrowseCourses = lazy(() => import('./pages/Student/BrowseCourses'));
const CourseDetails = lazy(() => import('./pages/Student/CourseDetails'));
const Questionnaire = lazy(() => import('./pages/Student/Questionnaire'));
const EnhancedCourseRoom = lazy(() => import('./pages/Student/EnhancedCourseRoom'));
const FinalExam = lazy(() => import('./pages/Student/FinalExam'));
const MyProgress = lazy(() => import('./pages/Student/MyProgress'));
const Certificates = lazy(() => import('./pages/Student/Certificates'));

function App() {
  const { setUser, setUserData, setLoading } = useAuthStore();

  useEffect(() => {
    // Older builds persisted the Firebase user (incl. tokens) to localStorage
    try { localStorage.removeItem('auth-storage'); } catch { /* storage unavailable */ }

    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Only hydrate the store for verified users.
        // Google sign-in users always have emailVerified=true, so they pass through.
        if (user.emailVerified) {
          setUser(user);
          try {
            setUserData(await getUserData(user.uid));
          } catch {
            setUserData(null);
          }
        } else {
          setUser(null);
          setUserData(null);
        }
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
        <Suspense fallback={<Loading />}>
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
          <Route path="/courses/:courseId" element={<CoursePreview />} />
          <Route path="/verify/:certificateId" element={<VerifyCertificate />} />

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
            path="/student/exam/:enrollmentId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <FinalExam />
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
        </Suspense>

        <ToastContainer
          position="top-right"
          theme="dark"
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
