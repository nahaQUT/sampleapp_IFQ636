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
        if (!window.confirm('Delete this user?')) return;
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400 uppercase tracking-widest text-sm animate-pulse">
                Loading Dashboard...
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <div className="bg-black text-white px-8 py-10">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Admin Panel</p>
                <h1 className="text-4xl font-bold uppercase tracking-widest">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-2">Welcome back, {user?.name}</p>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="bg-white rounded-lg shadow p-8 border-l-4 border-black">
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Total Users</p>
                        <p className="text-6xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-black text-white rounded-lg shadow p-8">
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Total Resources</p>
                        <p className="text-6xl font-bold">{stats.totalResources}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">

                    {/* Recent Resources */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-2">
                            Recent Resources
                        </h2>
                        {stats.recentResources.length === 0 ? (
                            <p className="text-gray-400 text-sm">No resources yet.</p>
                        ) : (
                            stats.recentResources.map((resource) => (
                                <div key={resource._id} className="bg-white rounded-lg p-4 shadow mb-3 border border-gray-100">
                                    <p className="font-bold text-sm">{resource.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {resource.subject} • {resource.category}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        By: {resource.createdBy?.name || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-gray-300 mt-1">
                                        {new Date(resource.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Recent Users */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-2">
                            Recent Users
                        </h2>
                        {stats.recentUsers.length === 0 ? (
                            <p className="text-gray-400 text-sm">No users yet.</p>
                        ) : (
                            stats.recentUsers.map((u) => (
                                <div key={u._id} className="bg-white rounded-lg p-4 shadow mb-3 border border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{u.name}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-medium ${u.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="text-xs bg-gray-100 text-black px-2 py-1 rounded hover:bg-black hover:text-white transition"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;