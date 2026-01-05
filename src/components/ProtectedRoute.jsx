import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userData } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, userData } = useAuthStore();

  if (user && userData) {
    if (userData.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};
