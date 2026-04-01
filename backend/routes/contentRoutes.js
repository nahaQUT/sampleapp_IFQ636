const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getAllContent,
    addContent,
    updateContent,
    deleteContent
} = require('../controllers/contentController');

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

router.route('/')
    .get(getAllContent)
    .post(protect, adminOnly, addContent);

router.route('/:id')
    .put(protect, adminOnly, updateContent)
    .delete(protect, adminOnly, deleteContent);

module.exports = router;