import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0F0E1A 0%, #1a1535 100%)',
      padding: '15px 30px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '28px' }}>🎬</span>
        <h2 style={{
          margin: 0, cursor: 'pointer',
          background: 'linear-gradient(135deg, #7C5CFC, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }} onClick={() => navigate('/dashboard')}>
          Watchlist Manager
        </h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
          backgroundColor: 'rgba(124, 92, 252, 0.2)',
          borderRadius: '20px', padding: '6px 14px'
        }}>
          <span style={{ color: '#a78bfa', fontSize: '14px' }}>👤 {user.name}</span>
        </div>
        {user.role === 'admin' && (
          <button onClick={() => navigate('/admin')} style={{
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            color: 'white', border: 'none',
            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
            fontWeight: 'bold', fontSize: '13px'
          }}>⚙️ Admin</button>
        )}
        <button onClick={handleLogout} style={{
          background: 'linear-gradient(135deg, #EF4444, #dc2626)',
          color: 'white', border: 'none',
          padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
          fontWeight: 'bold', fontSize: '13px'
        }}>🚪 Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;