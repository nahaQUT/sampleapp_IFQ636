import axiosInstance from '../axiosConfig';

const categoryColors = {
    article: 'bg-gray-100 text-gray-700',
    video: 'bg-gray-200 text-gray-800',
    book: 'bg-gray-300 text-gray-900',
    course: 'bg-black text-white',
    other: 'bg-gray-100 text-gray-600'
};

const ResourceList = ({ resources, setResources, setEditingResource, user }) => {

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await axiosInstance.delete(`/api/resources/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setResources(resources.filter((r) => r._id !== id));
        } catch (error) {
            alert('Failed to delete resource.');
        }
    };

    if (resources.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-4xl mb-4">📚</p>
                <p className="text-gray-400 uppercase tracking-widest text-sm">
                    No resources shared yet. Be the first!
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b pb-3">
                All Resources ({resources.length})
            </h2>

            <div className="grid gap-4">
                {resources.map((resource) => {
                    const isOwner = user && resource.createdBy?._id === user.id;
                    const isAdmin = user && user.role === 'admin';

                    return (
                        <div
                            key={resource._id}
                            className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold">{resource.title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-medium ${categoryColors[resource.category]}`}>
                      {resource.category}
                    </span>
                                    </div>

                                </div>

                                {(isOwner || isAdmin) && (
                                    <div className="flex flex-col gap-2 ml-4">
                                        {isOwner && (
                                            <button
                                                onClick={() => setEditingResource(resource)}
                                                className="text-xs uppercase tracking-wider bg-gray-100 text-black px-3 py-2 rounded hover:bg-gray-200 transition"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(resource._id)}
                                            className="text-xs uppercase tracking-wider bg-black text-white px-3 py-2 rounded hover:bg-gray-800 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    By: <span className="font-medium text-gray-600">{resource.createdBy?.name || 'Unknown'}</span>
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(resource.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResourceList;