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
      minHeight: '100vh', backgroundColor: '#F6F4FF',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        padding: '40px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#110E24', marginBottom: '8px', textAlign: 'center' }}>Welcome Back!</h2>
        <p style={{ color: '#5C5580', textAlign: 'center', marginBottom: '30px' }}>Login to your account</p>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2', color: '#EF4444',
            padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center'
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%', padding: '12px', marginBottom: '15px',
              border: '1px solid #E8E4FF', borderRadius: '8px',
              fontSize: '14px', boxSizing: 'border-box'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%', padding: '12px', marginBottom: '20px',
              border: '1px solid #E8E4FF', borderRadius: '8px',
              fontSize: '14px', boxSizing: 'border-box'
            }}
          />
          <button type="submit" style={{
            width: '100%', padding: '12px', backgroundColor: '#7C5CFC',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '16px', cursor: 'pointer'
          }}>Login</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#5C5580' }}>
          Don't have an account? <Link to="/register" style={{ color: '#7C5CFC' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;