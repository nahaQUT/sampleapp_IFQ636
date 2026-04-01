import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [parcels, setParcels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await axiosInstance.get('/api/parcels', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setParcels(response.data);
      } catch (error) {
        console.error('Failed to load parcels');
      }
    };
    if (user) fetchParcels();
  }, [user]);

  const totalCount = parcels.length;
  const activeCount = parcels.filter(p => ['pending', 'picked_up', 'in_transit'].includes(p.status)).length;
  const deliveredCount = parcels.filter(p => p.status === 'delivered').length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/track-package?q=${searchTerm}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Stats */}
        <div className="flex justify-center space-x-12 mb-16">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-gray-400 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">{totalCount}</span>
            </div>
            <span className="mt-2 text-sm text-gray-500">Total</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-indigo-400 flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">{activeCount}</span>
            </div>
            <span className="mt-2 text-sm text-gray-500">Active</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-gray-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">{deliveredCount}</span>
            </div>
            <span className="mt-2 text-sm text-gray-500">Delivered</span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            placeholder="Search by tracking number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-full text-sm focus:outline-none focus:border-gray-500"
          />
          <button type="submit"
            className="px-5 py-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
