import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const UpdateShipment = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [parcel, setParcel] = useState(null);
  const [formData, setFormData] = useState({
    sender: '', senderPhone: '', senderAddress: '',
    recipient: '', recipientPhone: '', recipientAddress: '',
    weight: '', description: '', status: '',
  });

  const statuses = ['pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'];

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const response = await axiosInstance.get(`/api/parcels/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setParcel(response.data);
        setFormData({
          sender: response.data.sender || '',
          senderPhone: response.data.senderPhone || '',
          senderAddress: response.data.senderAddress || '',
          recipient: response.data.recipient || '',
          recipientPhone: response.data.recipientPhone || '',
          recipientAddress: response.data.recipientAddress || '',
          weight: response.data.weight || '',
          description: response.data.description || '',
          status: response.data.status || 'pending',
        });
      } catch (error) {
        alert('Failed to load parcel.');
      }
    };
    if (user) fetchParcel();
  }, [id, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/parcels/${id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Shipment updated successfully!');
      navigate('/shipment-history');
    } catch (error) {
      alert('Failed to update shipment.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this shipment?')) return;
    try {
      await axiosInstance.delete(`/api/parcels/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Shipment deleted.');
      navigate('/shipment-history');
    } catch (error) {
      alert('Failed to delete shipment.');
    }
  };

  if (!parcel) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tracking Number & Status */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-gray-400">Tracking Number</span>
                <p className="text-sm font-semibold text-gray-700">{parcel.trackingNumber}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {statuses.filter(s => s !== 'cancelled').map((s) => (
                <button type="button" key={s}
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={`flex-1 py-2 text-xs rounded transition ${
                    formData.status === s
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                  {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Sender & Receiver */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-t">Sender</h2>
              <div className="bg-white border border-gray-200 rounded-b p-4 space-y-3">
                <div className="flex items-center">
                  <label className="w-20 text-sm text-gray-600">Name</label>
                  <input name="sender" value={formData.sender} onChange={handleChange}
                    className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
                </div>
                <div className="flex items-center">
                  <label className="w-20 text-sm text-gray-600">Phone</label>
                  <input name="senderPhone" value={formData.senderPhone} onChange={handleChange}
                    className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
                </div>
                <div className="flex items-center">
                  <label className="w-20 text-sm text-gray-600">Address</label>
                  <input name="senderAddress" value={formData.senderAddress} onChange={handleChange}
                    className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-t">Receiver</h2>
              <div className="bg-white border border-gray-200 rounded-b p-4 space-y-3">
                <div className="flex items-center">
                  <label className="w-20 text-sm text-gray-600">Name</label>
                  <input name="recipient" value={formData.recipient} onChange={handleChange}
                    className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
                </div>
                <div className="flex items-center">
                  <label className="w-20 text-sm text-gray-600">Phone</label>
                  <input name="recipientPhone" value={formData.recipientPhone} onChange={handleChange}
                    className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
                </div>
                <div className="flex items-center">
                  <label className="w-20 text-sm text-gray-600">Address</label>
                  <input name="recipientAddress" value={formData.recipientAddress} onChange={handleChange}
                    className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Package Info */}
          <div>
            <h2 className="bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-t">Package Info</h2>
            <div className="bg-white border border-gray-200 rounded-b p-4 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <label className="w-20 text-sm text-gray-600">Weight</label>
                <input name="weight" type="number" value={formData.weight} onChange={handleChange}
                  className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
              <div className="flex items-center">
                <label className="w-20 text-sm text-gray-600">Description</label>
                <input name="description" value={formData.description} onChange={handleChange}
                  className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <div className="flex space-x-3">
              <button type="button" onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition">
                Delete
              </button>
              <button type="button" onClick={() => navigate('/shipment-history')}
                className="px-6 py-2 bg-gray-300 text-gray-600 text-sm rounded hover:bg-gray-400 transition">
                Archive
              </button>
            </div>
            <button type="submit"
              className="px-8 py-2 border border-gray-300 bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 rounded transition">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateShipment;
