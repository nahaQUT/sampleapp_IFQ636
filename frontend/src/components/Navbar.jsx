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
      backgroundColor: '#0F0E1A', padding: '15px 30px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <h2 style={{ color: '#7C5CFC', margin: 0, cursor: 'pointer' }}
        onClick={() => navigate('/dashboard')}>
        🎬 Watchlist Manager
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: 'white' }}>Hi, {user.name}</span>
        {user.role === 'admin' && (
          <button onClick={() => navigate('/admin')} style={{
            backgroundColor: '#7C5CFC', color: 'white', border: 'none',
            padding: '8px 16px', borderRadius: '6px', cursor: 'pointer'
          }}>Admin Panel</button>
        )}
        <button onClick={handleLogout} style={{
          backgroundColor: '#EF4444', color: 'white', border: 'none',
          padding: '8px 16px', borderRadius: '6px', cursor: 'pointer'
        }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;