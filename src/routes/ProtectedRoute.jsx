import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import AppLoader from '../components/presentation/AppLoader.jsx';

export default function ProtectedRoute() {
  const { admin, loading } = useAuth();
  if (loading) return <AppLoader label="Verifying secure session" />;
  return admin ? <Outlet /> : <Navigate to="/nxt-admin-login" replace />;
}
