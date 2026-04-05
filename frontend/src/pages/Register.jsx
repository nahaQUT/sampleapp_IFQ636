import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { name: userName, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '20px',
        padding: '40px', width: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>✨</div>
          <h2 style={{ color: '#110E24', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: '#5C5580' }}>Join Streaming Watchlist Manager</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2', color: '#EF4444',
            padding: '12px', borderRadius: '8px', marginBottom: '15px',
            textAlign: 'center', fontSize: '14px'
          }}>{error}</div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#5C5580', fontSize: '14px' }}>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px',
                border: '2px solid #E8E4FF', borderRadius: '10px',
                fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#5C5580', fontSize: '14px' }}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px',
                border: '2px solid #E8E4FF', borderRadius: '10px',
                fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#5C5580', fontSize: '14px' }}>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px',
                border: '2px solid #E8E4FF', borderRadius: '10px',
                fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>
          <button type="submit" style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)'
          }}>Create Account</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#5C5580', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#7C5CFC', fontWeight: 'bold', textDecoration: 'none' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;