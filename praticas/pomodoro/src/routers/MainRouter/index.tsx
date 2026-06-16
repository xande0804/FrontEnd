import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { useEffect } from 'react';

import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { History } from '../../pages/History';
import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
import { NotFound } from '../../pages/NotFound';
import { Settings } from '../../pages/Settings';
import { Register } from '../../pages/Register';
import { ForgotPassword } from '../../pages/ForgotPassword';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import { PublicOnlyRoute } from '../../components/PublicOnlyRoute';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path='/history'
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path='/settings'
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path='/about-pomodoro'
          element={
            <ProtectedRoute>
              <AboutPomodoro />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />

        <Route path='*' element={<NotFound />} />
      </Routes>

      <ScrollToTop />
    </BrowserRouter>
  );
}