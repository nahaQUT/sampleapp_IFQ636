const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Resource = require('../models/Resource');

// GET dashboard stats - admin only
router.get('/dashboard', protect, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalResources = await Resource.countDocuments();
        const recentResources = await Resource.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);
        const recentUsers = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalUsers,
            totalResources,
            recentResources,
            recentUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE any user - admin only
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;