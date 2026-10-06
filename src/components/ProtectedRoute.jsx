import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import Loading from './Loading';
import { destinationFor } from '../utils/routes';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userData, loading } = useAuthStore();
  const location = useLocation();

  // Wait for Firebase to restore the session before deciding anything
  if (loading) return <Loading />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    return <Navigate to={destinationFor(userData?.role)} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, userData, loading } = useAuthStore();
  const location = useLocation();

  if (loading) return <Loading />;

  if (user && userData) {
    return <Navigate to={destinationFor(userData.role, location.state?.from)} replace />;
  }

  return children;
};
