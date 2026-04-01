const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    parcel: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel', required: true },
    courier: { type: mongoose.Schema.Types.ObjectId, ref: 'Courier', required: true },
    pickupTime: { type: Date },
    deliveredTime: { type: Date },
    status: {
        type: String,
        enum: ['assigned', 'picked_up', 'in_transit', 'delivered', 'failed'],
        default: 'assigned'
    },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
