const mongoose = require('mongoose');

const watchlistItemSchema = new mongoose.Schema({
    watchlistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Watchlist',
        required: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true
    },
    status: {
        type: String,
        enum: ['watched', 'pending', 'watching'],
        default: 'pending'
    },
    priority: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('WatchlistItem', watchlistItemSchema);