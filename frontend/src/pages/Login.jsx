import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);

      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/podcasts');
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div style={styles.container}>

      {/* Left side - image */}
      <div style={styles.leftSide}>
        <div style={styles.brandText}>
          <h1 style={styles.podkas}>PODKAS</h1>
          <p style={styles.tagline}>Listen to your favorite pinoy podcast</p>
          <p style={styles.taglineSub}>More than 100+ best talks ever</p>
        </div>
        <img
          src="/headset.png"
          alt="Headset"
          style={styles.headsetImage}
        />
      </div>

      {/* Right side - login form */}
      <div style={styles.rightSide}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Welcome back!</h2>
          <p style={styles.subheading}>Glad to see you. Again!</p>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.field}>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={styles.input}
              required
            />
          </div>

          <button onClick={handleSubmit} style={styles.loginBtn}>
            Login
          </button>

          <p style={styles.registerText}>
            Don't have an account?{' '}
            <a href="/register" style={styles.registerLink}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    background: '#1ED7E2',
  },
  leftSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    position: 'relative',
  },
  brandText: {
    textAlign: 'center',
    zIndex: 1,
  },
  podkas: {
    fontSize: '64px',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '8px',
    margin: '0',
    textShadow: '2px 2px 10px rgba(0,0,0,0.2)',
  },
  tagline: {
    fontSize: '18px',
    color: '#fff',
    margin: '12px 0 4px',
    fontWeight: '500',
  },
  taglineSub: {
    fontSize: '14px',
    color: '#e0f7f4',
    margin: '0',
  },
  headsetImage: {
    width: '320px',
    height: '320px',
    objectFit: 'contain',
    marginTop: '20px',
    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
  },
  rightSide: {
    width: '420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '36px 28px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '4px',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '14px',
    color: '#999',
    textAlign: 'center',
    marginBottom: '28px',
  },
  field: {
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#f9f9f9',
  },
  loginBtn: {
    width: '100%',
    padding: '13px',
    background: '#1ED7E2',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(18,181,160,0.4)',
  },
  error: {
    color: 'red',
    fontSize: '13px',
    textAlign: 'center',
    marginBottom: '12px',
  },
  registerText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#999',
    marginTop: '20px',
  },
  registerLink: {
    color: '#1ED7E2',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Login;
