const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Movie', 'Series'],
        required: true
    },
    genre: {
        type: [String]
    },
    releaseYear: {
        type: Number
    },
    platform: {
        type: String
    },
    posterUrl: {
        type: String
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Content', contentSchema);