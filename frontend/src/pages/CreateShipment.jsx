import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const CreateShipment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sender: '',
    senderPhone: '',
    senderAddress: '',
    recipientAddress: '',
    recipientPhone: '',
    recipient: '',
    weight: '',
    description: '',
    shippingMethod: 'courier_pickup',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/parcels', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Shipment created successfully!');
      navigate('/shipment-history');
    } catch (error) {
      alert('Failed to create shipment.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sender Section */}
          <div>
            <h2 className="bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-t">
              Sender
            </h2>
            <div className="bg-white border border-gray-200 rounded-b p-4 space-y-3">
              <div className="flex items-center">
                <label className="w-28 text-sm text-gray-600">Name</label>
                <input name="sender" value={formData.sender} onChange={handleChange}
                  className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
              <div className="flex items-center">
                <label className="w-28 text-sm text-gray-600">Phone</label>
                <input name="senderPhone" value={formData.senderPhone} onChange={handleChange}
                  className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
              <div className="flex items-center">
                <label className="w-28 text-sm text-gray-600">Address</label>
                <input name="senderAddress" value={formData.senderAddress} onChange={handleChange}
                  className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
            </div>
          </div>

          {/* Receiver Section */}
          <div>
            <h2 className="bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-t">
              Receiver
            </h2>
            <div className="bg-white border border-gray-200 rounded-b p-4 space-y-3">
              <div className="flex items-center">
                <label className="w-28 text-sm text-gray-600">Name</label>
                <input name="recipient" value={formData.recipient} onChange={handleChange}
                  className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
              <div className="flex items-center">
                <label className="w-28 text-sm text-gray-600">Phone</label>
                <input name="recipientPhone" value={formData.recipientPhone} onChange={handleChange}
                  className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
              <div className="flex items-center">
                <label className="w-28 text-sm text-gray-600">Address</label>
                <input name="recipientAddress" value={formData.recipientAddress} onChange={handleChange}
                  className="flex-1 border-b border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div>
            <h2 className="bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-t">
              Shipping Method
            </h2>
            <div className="bg-white border border-gray-200 rounded-b p-4 flex space-x-8">
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input type="radio" name="shippingMethod" value="courier_pickup"
                  checked={formData.shippingMethod === 'courier_pickup'} onChange={handleChange}
                  className="text-gray-600" />
                <span>Courier pick up</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input type="radio" name="shippingMethod" value="self_dropoff"
                  checked={formData.shippingMethod === 'self_dropoff'} onChange={handleChange}
                  className="text-gray-600" />
                <span>Self drop off to post office</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
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

export default CreateShipment;
