const Watchlist = require('../models/Watchlist');
const WatchlistItem = require('../models/WatchlistItem');

// Create a new watchlist
const createWatchlist = async (req, res) => {
    const { name, description } = req.body;
    try {
        const watchlist = await Watchlist.create({
            name,
            description,
            ownerId: req.user._id
        });
        res.status(201).json(watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all watchlists for logged in user
const getAllWatchlists = async (req, res) => {
    try {
        const watchlists = await Watchlist.find({ ownerId: req.user._id });
        res.json(watchlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a watchlist
const updateWatchlist = async (req, res) => {
    const { name, description } = req.body;
    try {
        const watchlist = await Watchlist.findById(req.params.id);
        if (!watchlist) return res.status(404).json({ message: 'Watchlist not found' });
        if (watchlist.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        watchlist.name = name || watchlist.name;
        watchlist.description = description || watchlist.description;
        const updated = await watchlist.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a watchlist
const deleteWatchlist = async (req, res) => {
    try {
        const watchlist = await Watchlist.findById(req.params.id);
        if (!watchlist) return res.status(404).json({ message: 'Watchlist not found' });
        if (watchlist.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await Watchlist.findByIdAndDelete(req.params.id);
        await WatchlistItem.deleteMany({ watchlistId: req.params.id });
        res.json({ message: 'Watchlist deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add item to watchlist
const addItem = async (req, res) => {
    const { contentId, status, priority, rating } = req.body;
    try {
        const watchlist = await Watchlist.findById(req.params.id);
        if (!watchlist) return res.status(404).json({ message: 'Watchlist not found' });
        const item = await WatchlistItem.create({
            watchlistId: req.params.id,
            contentId,
            status,
            priority,
            rating
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update item status
const updateItemStatus = async (req, res) => {
    const { status, rating, priority } = req.body;
    try {
        const item = await WatchlistItem.findById(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        item.status = status || item.status;
        item.rating = rating ?? item.rating;
        item.priority = priority ?? item.priority;
        const updated = await item.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from watchlist
const removeItem = async (req, res) => {
    try {
        const item = await WatchlistItem.findById(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        await WatchlistItem.findByIdAndDelete(req.params.itemId);
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createWatchlist,
    getAllWatchlists,
    updateWatchlist,
    deleteWatchlist,
    addItem,
    updateItemStatus,
    removeItem
};