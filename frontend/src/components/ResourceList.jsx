import axiosInstance from '../axiosConfig';

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
            <p className="text-center text-gray-500 mt-10">
                No resources shared yet. Be the first to share one!
            </p>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">All Resources</h2>
            {resources.map((resource) => {

                // Check if current user is the owner
                const isOwner = user && resource.createdBy?._id === user.id;

                // Check if current user is admin
                const isAdmin = user && user.role === 'admin';

                return (
                    <div
                        key={resource._id}
                        className="bg-white p-4 shadow-md rounded mb-4"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold">{resource.title}</h3>
                                <p className="text-sm text-gray-500 mb-1">
                                    {resource.subject} • {resource.category}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {/* Edit — owner only */}
                                {isOwner && (
                                    <button
                                        onClick={() => setEditingResource(resource)}
                                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                                    >
                                        Edit
                                    </button>
                                )}

                                {/* Delete — owner or admin */}
                                {(isOwner || isAdmin) && (
                                    <button
                                        onClick={() => handleDelete(resource._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>

</div>
);
})}
</div>
);
};

export default ResourceList;