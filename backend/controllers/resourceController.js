const Resource = require('../models/Resource');

const createResource = async (req, res) => {
    try {
        const { title, description, subject, url, category } = req.body;

        if (!title || !description || !subject) {
            return res.status(400).json({
                message: 'Title, description and subject are required'
            });
        }

        const resource = await Resource.create({
            title,
            description,
            subject,
            url,
            category
        });

        res.status(201).json(resource);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.json(resource);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const updated = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updated);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: 'Resource deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createResource,
    getResources,
    getResource,
    updateResource,
    deleteResource
};