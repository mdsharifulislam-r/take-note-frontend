import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { PageLoader } from '@/components/ui/Spinner';

export function ProtectedRoute() {
  const { token, isRehydrated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isRehydrated) {
    return <PageLoader />;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { token, isRehydrated } = useAppSelector((state) => state.auth);

  if (!isRehydrated) {
    return <PageLoader />;
  }

  if (token) {
    return <Navigate to="/notes" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { user, isRehydrated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isRehydrated) {
    return <PageLoader />;
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
