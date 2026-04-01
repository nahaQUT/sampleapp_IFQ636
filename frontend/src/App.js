// Online Podcast Manager - App Routes
// Author: liperdio
// IFN636 Assessment 1.2
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PodcastList from './pages/PodcastList';
import AdminDashboard from './pages/AdminDashboard';

// Protected route - must be logged in
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Admin route - must be logged in AND be admin
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/podcasts" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PodcastList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/podcasts"
          element={
            <ProtectedRoute>
              <PodcastList />
            </ProtectedRoute>
          }
        />

        {/* Admin only routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;