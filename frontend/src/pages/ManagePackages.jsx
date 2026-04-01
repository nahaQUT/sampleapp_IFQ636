import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const ManagePackages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await axiosInstance.get('/api/parcels', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setParcels(response.data);
      } catch (error) {
        alert('Failed to load packages.');
      }
    };
    if (user) fetchParcels();
  }, [user]);

  const statusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'in_transit': return 'bg-blue-500';
      case 'picked_up': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await axiosInstance.delete(`/api/parcels/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setParcels(parcels.filter((p) => p._id !== id));
    } catch (error) {
      alert('Failed to delete package.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {parcels.length === 0 ? (
          <p className="text-center text-gray-500">No packages found.</p>
        ) : (
          parcels.map((parcel) => (
            <div key={parcel._id} className="bg-white border border-gray-200 rounded p-4 flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">{parcel.trackingNumber}</span>
                  <span className={`text-white text-xs px-3 py-0.5 rounded-full ${statusColor(parcel.status)}`}>
                    {parcel.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <p className="font-medium text-gray-700">{parcel.sender}</p>
                    <p>{parcel.senderAddress}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{parcel.recipient}</p>
                    <p>{parcel.recipientAddress}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 ml-4">
                <button onClick={() => navigate(`/update-shipment/${parcel._id}`)}
                  className="text-gray-400 hover:text-gray-600" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button onClick={() => handleDelete(parcel._id)}
                  className="text-gray-400 hover:text-red-500" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagePackages;
