import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import type { JSX } from 'react/jsx-dev-runtime';

const AppLayout = (): JSX.Element => {
  return (
    <>
      <Navbar />
      <main className="container-fluid vw-100 p-0">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
