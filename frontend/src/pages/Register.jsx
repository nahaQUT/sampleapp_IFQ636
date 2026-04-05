import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Email may already be in use.');
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2 uppercase tracking-widest">
            Create Account
          </h1>
          <p className="text-center text-gray-400 text-sm mb-8">
            Join the learning resource community
          </p>

          {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-4">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Name</label>
            <input
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
            />

            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Email</label>
            <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
            />

            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Password</label>
            <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                required
            />

            <button
                type="submit"
                className="w-full bg-black text-white p-3 rounded uppercase tracking-widest font-bold hover:bg-gray-800 transition"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-bold underline">
              Login
            </Link>
          </p>
        </div>
      </div>
  );
};

export default Register;