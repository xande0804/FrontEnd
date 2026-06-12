import { Navigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
}