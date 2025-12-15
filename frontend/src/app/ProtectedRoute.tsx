import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import type { JSX } from 'react/jsx-dev-runtime';

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props): JSX.Element => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;