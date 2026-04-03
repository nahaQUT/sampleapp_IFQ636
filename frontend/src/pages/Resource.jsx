import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ResourceForm from '../components/ResourceForm';
import ResourceList from '../components/ResourceList';
import { useAuth } from '../context/AuthContext';

const Resources = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [editingResource, setEditingResource] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axiosInstance.get('/api/resources');
                setResources(response.data);
            } catch (error) {
                alert('Failed to fetch resources.');
            }
        };

        fetchResources();
    }, []);

    return (
        <div className="container mx-auto p-6">
            {user && (
                <ResourceForm
                    resources={resources}
                    setResources={setResources}
                    editingResource={editingResource}
                    setEditingResource={setEditingResource}
                />
            )}
            <ResourceList
                resources={resources}
                setResources={setResources}
                setEditingResource={setEditingResource}
                user={user}
            />
        </div>
    );
};

export default Resources;