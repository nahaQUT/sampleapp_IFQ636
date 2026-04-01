import { useState } from 'react';
import axiosInstance from '../axiosConfig';

const TrackPackage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setParcel(null);
    try {
      const response = await axiosInstance.get(`/api/parcels/track/${trackingNumber}`);
      setParcel(response.data);
    } catch (err) {
      setError('Parcel not found. Please check the tracking number.');
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'in_transit': return 'bg-blue-500';
      case 'picked_up': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center mb-8">
          <input
            type="text"
            placeholder="Enter tracking number..."
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-full text-sm focus:outline-none focus:border-gray-500"
          />
          <button type="submit"
            className="px-5 py-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="text-center text-red-500 text-sm mb-4">{error}</div>
        )}

        {/* Result */}
        {parcel && (
          <div className="bg-white border border-gray-200 rounded p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">Tracking: {parcel.trackingNumber}</h3>
              <span className={`text-white text-xs px-3 py-1 rounded-full ${statusColor(parcel.status)}`}>
                {parcel.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              {/* Sender */}
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Sender</h4>
                <div className="space-y-1 text-sm text-gray-500">
                  <p><span className="text-gray-600">Name:</span> {parcel.sender}</p>
                  <p><span className="text-gray-600">Phone:</span> {parcel.senderPhone}</p>
                  <p><span className="text-gray-600">Address:</span> {parcel.senderAddress}</p>
                </div>
              </div>
              {/* Receiver */}
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Receiver</h4>
                <div className="space-y-1 text-sm text-gray-500">
                  <p><span className="text-gray-600">Name:</span> {parcel.recipient}</p>
                  <p><span className="text-gray-600">Phone:</span> {parcel.recipientPhone}</p>
                  <p><span className="text-gray-600">Address:</span> {parcel.recipientAddress}</p>
                </div>
              </div>
            </div>

            {parcel.weight && (
              <div className="mt-4 text-sm text-gray-500">
                <span className="text-gray-600">Weight:</span> {parcel.weight} kg
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPackage;
