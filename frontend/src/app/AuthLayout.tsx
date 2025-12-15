import { Outlet } from 'react-router-dom';
import type { JSX } from 'react/jsx-dev-runtime';

const AuthLayout = (): JSX.Element => {
  return <Outlet />;
};

export default AuthLayout;