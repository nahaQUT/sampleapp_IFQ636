import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ResourceForm = ({ resources, setResources, editingResource, setEditingResource }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        url: '',
        category: 'other'
    });

    // When editing, fill the form with existing data
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
            setFormData({
                title: '',
                description: '',
                subject: '',
                url: '',
                category: 'other'
            });
        }
    }, [editingResource]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingResource) {
                // UPDATE existing resource
                const response = await axiosInstance.put(
                    `/api/resources/${editingResource._id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setResources(resources.map((r) =>
                    r._id === response.data._id ? response.data : r
                ));
            } else {
                // CREATE new resource
                const response = await axiosInstance.post(
                    '/api/resources',
                    formData,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setResources([response.data, ...resources]);
            }

            // Reset form
            setEditingResource(null);
            setFormData({
                title: '',
                description: '',
                subject: '',
                url: '',
                category: 'other'
            });

        } catch (error) {
            alert('Failed to save resource.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
            <h1 className="text-2xl font-bold mb-4">
                {editingResource ? 'Edit Resource' : 'Share a New Resource'}
            </h1>

            <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
                required
            />

            <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
                rows={3}
                required
            />

            <input
                type="text"
                placeholder="Subject (e.g. Mathematics, Science)"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
                required
            />

            <input
                type="url"
                placeholder="Resource Link (optional)"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
            />

            <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
            >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="book">Book</option>
                <option value="course">Course</option>
                <option value="other">Other</option>
            </select>

            <div className="flex gap-2">
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    {editingResource ? 'Update Resource' : 'Share Resource'}
                </button>

                {editingResource && (
                    <button
                        type="button"
                        onClick={() => setEditingResource(null)}
                        className="w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ResourceForm;