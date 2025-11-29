import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './views/Landing';
import Auth from './views/Auth';
import Signup from './views/Signup';
import Dashboard from './views/Dashboard';
import ProtectedRoute from './views/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
