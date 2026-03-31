const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createWatchlist,
    getAllWatchlists,
    updateWatchlist,
    deleteWatchlist,
    addItem,
    updateItemStatus,
    removeItem
} = require('../controllers/watchlistController');

router.route('/')
    .post(protect, createWatchlist)
    .get(protect, getAllWatchlists);

router.route('/:id')
    .put(protect, updateWatchlist)
    .delete(protect, deleteWatchlist);

router.route('/:id/items')
    .post(protect, addItem);

router.route('/:id/items/:itemId')
    .put(protect, updateItemStatus)
    .delete(protect, removeItem);

module.exports = router;