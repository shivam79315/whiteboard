import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import type { JSX } from 'react/jsx-dev-runtime';

const LoginPage = (): JSX.Element => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="d-flex vw-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '360px' }}>
        <h4 className="text-center mb-3">Whiteboard</h4>
        <button className="btn btn-primary w-100" onClick={login}>
          Login with Keycloak
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
