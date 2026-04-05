import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '20px',
        padding: '40px', width: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎬</div>
          <h2 style={{ color: '#110E24', marginBottom: '8px' }}>Welcome Back!</h2>
          <p style={{ color: '#5C5580' }}>Login to your Watchlist Manager</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2', color: '#EF4444',
            padding: '12px', borderRadius: '8px', marginBottom: '15px',
            textAlign: 'center', fontSize: '14px'
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
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
            background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(124, 92, 252, 0.4)'
          }}>Login</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#5C5580', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#7C5CFC', fontWeight: 'bold', textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;