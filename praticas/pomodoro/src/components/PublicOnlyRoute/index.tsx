import { Navigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext';

type PublicOnlyRouteProps = {
  children: React.ReactNode;
};

export function PublicOnlyRoute({
  children,
}: PublicOnlyRouteProps) {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to='/home' replace />;
  }

  return <>{children}</>;
}