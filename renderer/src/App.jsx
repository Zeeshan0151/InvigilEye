import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import InvigilatorLoginPage from './pages/InvigilatorLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import InvigilatorDashboard from './pages/InvigilatorDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [pythonStatus, setPythonStatus] = useState({
    isReady: true,
    isDownloading: false,
    isDev: true,
    checking: true
  });

  useEffect(() => {
    // Check Python status on app start
    if (window.electronAPI) {
      window.electronAPI.checkPythonStatus()
        .then(status => {
          setPythonStatus({ ...status, checking: false });
        })
        .catch(error => {
          console.error('Failed to check Python status:', error);
          setPythonStatus(prev => ({ ...prev, checking: false }));
        });
    } else {
      // Not in Electron, assume ready
      setPythonStatus(prev => ({ ...prev, checking: false }));
    }
  }, []);

  // Show error screen if Python is not ready (should have been installed during setup)
  if (!pythonStatus.checking && !pythonStatus.isReady && !pythonStatus.isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Features Not Found</h2>
          <p className="text-gray-600 mb-4">
            The AI pose detection features were not installed during setup. 
            Please reinstall InvigilEye and ensure you have an active internet connection during installation.
          </p>
          <button
            onClick={() => window.close()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Close Application
          </button>
        </div>
      </div>
    );
  }

  // Show loading while checking
  if (pythonStatus.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing InvigilEye...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/invigilator-login" element={<InvigilatorLoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invigilator/*"
              element={<InvigilatorDashboard />}
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

