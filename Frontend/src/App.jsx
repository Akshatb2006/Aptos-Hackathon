import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from './components/landing';
import Navbar from './components/Navbar';
import AuthPage from './components/auth/AuthPage';
import StudentApp from './components/student/StudentApp';
import AdminApp from './components/admin/AdminApp';
import api from './services/api';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Dashboard Component - handles authenticated users
function Dashboard() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      api.auth.getMe(token)
        .then(res => res.json())
        .then(data => {
          setUser(data.user);
          setView(data.user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
        })
        .catch(() => {
          localStorage.removeItem('token');
          navigate('/login');
        })
        .finally(() => setLoading(false));
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden">
      <Navbar user={user} view={view} setView={setView} onLogout={handleLogout} />
      <div className="w-full">
        {user?.role === 'student' ? (
          <StudentApp view={view} setView={setView} token={token} user={user} />
        ) : (
          <AdminApp view={view} setView={setView} token={token} />
        )}
      </div>
    </div>
  );
}

// Main App Component with Router
export default function CampusWallet() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route 
          path="/login" 
          element={<AuthPage mode="login" />} 
        />
        <Route 
          path="/signup" 
          element={<AuthPage mode="signup" />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}