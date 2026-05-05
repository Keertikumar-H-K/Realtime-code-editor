import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Suspense, lazy } from 'react';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';

// ✅ NEW PUBLIC PAGES (create these files)
import Home from './pages/Home';
import Features from './pages/Features';
import Blog from './pages/Blog';
import Docs from './pages/Docs';
import Contact from './pages/Contact';

// Lazy Editor
const Editor = lazy(() => import('./pages/Editor'));

import { LoadingSpinner } from './components/Common/Badge';

/**
 * ProtectedRoute
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * PublicRoute
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>

      {/* ✅ FIXED: HOME PAGE */}
      <Route path="/" element={<Home />} />

      {/* ✅ PUBLIC PAGES */}
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/contact" element={<Contact />} />

      {/* AUTH */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* PROTECTED */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/room/:roomId"
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <LoadingSpinner />
              </div>
            }>
              <Editor />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;