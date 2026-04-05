import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WatchlistDetail from './pages/WatchlistDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentCatalog from './pages/admin/ContentCatalog';
import AddEditTitle from './pages/admin/AddEditTitle';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return token && user.role === 'admin' ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/watchlist/:id" element={
          <ProtectedRoute><WatchlistDetail /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/content" element={
          <AdminRoute><ContentCatalog /></AdminRoute>
        } />
        <Route path="/admin/content/new" element={
          <AdminRoute><AddEditTitle /></AdminRoute>
        } />
        <Route path="/admin/content/:id" element={
          <AdminRoute><AddEditTitle /></AdminRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;