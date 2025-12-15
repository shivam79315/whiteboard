import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { JSX } from 'react/jsx-dev-runtime';

import AuthLayout from './AuthLayout';
import AppLayout from './AppLayout';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import WhiteboardPage from '../pages/WhiteboardPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/whiteboard/:id" element={<WhiteboardPage />} />
        </Route>

        {/* Redirect Root */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;