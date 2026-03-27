import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        🎙️ Podcast Manager
      </div>
      <div style={styles.links}>
        {token ? (
          <>
            <Link to="/podcasts" style={styles.link}>Episodes</Link>
            <Link to="/admin" style={styles.link}>Admin</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    background: '#6c63ff',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  brand: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
  },
  logoutBtn: {
    padding: '8px 18px',
    background: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default Navbar;