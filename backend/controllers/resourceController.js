const Resource = require('../models/Resource');

// CREATE
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
            category,
            createdBy: req.user.id
        });

        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// READ ALL
const getResources = async (req, res) => {
    try {
        const resources = await Resource.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ ONE
const getResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE - only owner can update
const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check ownership
        if (resource.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this resource' });
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

// DELETE - owner or admin can delete
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Allow if admin OR owner
        if (req.user.role !== 'admin' && resource.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this resource' });
        }

        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createResource, getResources, getResource, updateResource, deleteResource };