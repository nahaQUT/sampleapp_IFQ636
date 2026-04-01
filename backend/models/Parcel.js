const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    senderAddress: { type: String, required: true },
    senderPhone: { type: String, required: true },
    recipient: { type: String, required: true },
    recipientAddress: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    weight: { type: Number, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
        default: 'pending'
    },
    trackingNumber: { type: String, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

parcelSchema.pre('save', function (next) {
    if (!this.trackingNumber) {
        this.trackingNumber = 'PKG-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Parcel', parcelSchema);
