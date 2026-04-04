import { useState } from 'react';

const dummyOrders = [
  {
    id: 'ORD-1001',
    customer: 'John Doe',
    date: 'April 2, 2025',
    items: 3,
    total: 120.5,
    status: 'Processing',
  },
  {
    id: 'ORD-1002',
    customer: 'Jane Smith',
    date: 'April 1, 2025',
    items: 2,
    total: 75.0,
    status: 'Delivered',
  },
];

const ALL = 'All';
const statuses = [
  ALL,
  'Processing',
  'Shipped',
  'Completed',
  'Out for Delivery',
  'Delivered',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [activeTab, setActiveTab] = useState(ALL);

  const filteredOrders =
    activeTab === ALL
      ? orders
      : orders.filter(o => o.status === activeTab);

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="mx-auto mt-20 px-6 max-w-5xl">

      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-500">{orders.length} total orders</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full border text-sm ${
              activeTab === tab
                ? 'bg-[#286934] text-white border-[#286934]'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="bg-white border rounded-xl p-5 shadow-sm flex justify-between flex-wrap gap-4"
          >
            <div>
              <p className="font-bold text-lg">{order.id}</p>
              <p className="text-sm text-gray-500">
                👤 {order.customer}
              </p>
              <p className="text-sm text-gray-500">
                📅 {order.date}
              </p>
              <p className="text-sm text-gray-500">
                📦 {order.items} items
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="text-lg font-bold text-[#286934]">
                ${order.total}
              </p>

              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order.id, e.target.value)
                }
                className="border rounded px-3 py-1 text-sm"
              >
                {statuses.slice(1).map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No orders found
        </p>
      )}
    </div>
  );
};

export default AdminOrders;