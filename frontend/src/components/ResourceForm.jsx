import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ResourceForm = ({ resources, setResources, editingResource, setEditingResource }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '', description: '', subject: '', url: '', category: 'other'
    });

    useEffect(() => {
        if (editingResource) {
            setFormData({
                title: editingResource.title,
                description: editingResource.description,
                subject: editingResource.subject,
                url: editingResource.url || '',
                category: editingResource.category
            });
        } else {
            setFormData({ title: '', description: '', subject: '', url: '', category: 'other' });
        }
    }, [editingResource]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingResource) {
                const response = await axiosInstance.put(
                    `/api/resources/${editingResource._id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setResources(resources.map((r) =>
                    r._id === response.data._id ? response.data : r
                ));
            } else {
                const response = await axiosInstance.post(
                    '/api/resources',
                    formData,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setResources([response.data, ...resources]);
            }
            setEditingResource(null);
            setFormData({ title: '', description: '', subject: '', url: '', category: 'other' });
        } catch (error) {
            alert('Failed to save resource.');
        }
    };

    return (
        <div className="bg-white shadow-xl rounded-lg p-8 mb-8 border-l-4 border-black">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">
                {editingResource ? '✏️ Edit Resource' : '+ Share a Resource'}
            </h2>

            <form onSubmit={handleSubmit}>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Title</label>
                <input
                    type="text"
                    placeholder="Resource title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    required
                />

                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Description</label>
                <textarea
                    placeholder="What is this resource about?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    rows={3}
                    required
                />

                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Subject</label>
                <input
                    type="text"
                    placeholder="e.g. Mathematics, Computer Science"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    required
                />

                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Link (optional)</label>
                <input
                    type="url"
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />

                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Category</label>
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="book">Book</option>
                    <option value="course">Course</option>
                    <option value="other">Other</option>
                </select>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 bg-black text-white p-3 rounded uppercase tracking-widest font-bold hover:bg-gray-800 transition"
                    >
                        {editingResource ? 'Update' : 'Share'}
                    </button>
                    {editingResource && (
                        <button
                            type="button"
                            onClick={() => setEditingResource(null)}
                            className="flex-1 bg-gray-200 text-black p-3 rounded uppercase tracking-widest font-bold hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ResourceForm;