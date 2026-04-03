import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect if not admin
        if (!user || user.role !== 'admin') {
            navigate('/resources');
            return;
        }

        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get('/api/admin/dashboard', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setStats(response.data);
            } catch (error) {
                alert('Failed to load dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, navigate]);

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axiosInstance.delete(`/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStats({
                ...stats,
                recentUsers: stats.recentUsers.filter((u) => u._id !== id),
                totalUsers: stats.totalUsers - 1
            });
        } catch (error) {
            alert('Failed to delete user.');
        }
    };

    if (loading) return <p className="text-center mt-20">Loading dashboard...</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-blue-600 text-white p-6 rounded shadow text-center">
                    <p className="text-5xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xl mt-2">Total Users</p>
                </div>
                <div className="bg-green-600 text-white p-6 rounded shadow text-center">
                    <p className="text-5xl font-bold">{stats.totalResources}</p>
                    <p className="text-xl mt-2">Total Resources</p>
                </div>
            </div>

            {/* Recent Resources */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Recent Resources</h2>
                {stats.recentResources.length === 0 ? (
                    <p className="text-gray-500">No resources yet.</p>
                ) : (
                    stats.recentResources.map((resource) => (
                        <div key={resource._id} className="bg-white p-4 shadow rounded mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{resource.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {resource.subject} • {resource.category}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        By: {resource.createdBy?.name || 'Unknown'}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400">
                                    {new Date(resource.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Recent Users */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
                {stats.recentUsers.length === 0 ? (
                    <p className="text-gray-500">No users yet.</p>
                ) : (
                    stats.recentUsers.map((u) => (
                        <div key={u._id} className="bg-white p-4 shadow rounded mb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{u.name}</p>
                                    <p className="text-sm text-gray-500">{u.email}</p>
                                    <span className={`text-xs px-2 py-1 rounded ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {u.role}
                                    </span>
                                </div>
                                {u.role !== 'admin' && (
                                    <button
                                        onClick={() => handleDeleteUser(u._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                    >
                                        Delete User
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;