import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const AdminRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', { ...formData, role: 'admin' });
      alert('Admin registration successful. Please log in.');
      navigate('/admin');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400">
      <div className="w-full max-w-5xl mx-4 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-7xl font-bold text-gray-500/70 leading-tight tracking-wide">
            Courier<br />Management<br />System
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-end">
          <form onSubmit={handleSubmit} className="w-80 space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 bg-white text-gray-700 placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 bg-white text-gray-700 placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border border-gray-300 bg-white text-gray-700 placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full py-2 border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              Register as Admin
            </button>
          </form>

          <Link to="/admin" className="mt-8 text-gray-600 hover:underline">
            Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
