import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', university: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          university: response.data.university || '',
          address: response.data.address || ''
        });
      } catch (error) {
        alert('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSuccess(true);
    } catch (error) {
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 uppercase tracking-widest text-sm">Loading...</p>
      </div>
  );

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-bold mb-3">
              {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-widest">{formData.name}</h1>
            <span className="text-xs uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full mt-1">
            {user?.role || 'user'}
          </span>
          </div>

          {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded mb-4 text-center">
                Profile updated successfully!
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Name</label>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
            />

            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Email</label>
            <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
            />

            <label className="block text-xs font-bold uppercase tracking-wider mb-1">University</label>
            <input
                type="text"
                placeholder="Your university"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
            />

            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Address</label>
            <input
                type="text"
                placeholder="Your address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
            />

            <button
                type="submit"
                className="w-full bg-black text-white p-3 rounded uppercase tracking-widest font-bold hover:bg-gray-800 transition"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
  );
};

export default Profile;