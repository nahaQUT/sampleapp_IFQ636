const Content = require('../models/Content');

// Get all content - available to all users
const getAllContent = async (req, res) => {
    try {
        const { genre, platform, type } = req.query;
        let filter = {};
        if (genre) filter.genre = { $in: [genre] };
        if (platform) filter.platform = platform;
        if (type) filter.type = type;
        const content = await Content.find(filter);
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add content - admin only
const addContent = async (req, res) => {
    const { title, type, genre, releaseYear, platform, posterUrl, description } = req.body;
    try {
        const content = await Content.create({
            title, type, genre, releaseYear, platform, posterUrl, description
        });
        res.status(201).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update content - admin only
const updateContent = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) return res.status(404).json({ message: 'Content not found' });
        const { title, type, genre, releaseYear, platform, posterUrl, description } = req.body;
        content.title = title || content.title;
        content.type = type || content.type;
        content.genre = genre || content.genre;
        content.releaseYear = releaseYear || content.releaseYear;
        content.platform = platform || content.platform;
        content.posterUrl = posterUrl || content.posterUrl;
        content.description = description || content.description;
        const updated = await content.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete content - admin only
const deleteContent = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) return res.status(404).json({ message: 'Content not found' });
        await Content.findByIdAndDelete(req.params.id);
        res.json({ message: 'Content deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllContent, addContent, updateContent, deleteContent };