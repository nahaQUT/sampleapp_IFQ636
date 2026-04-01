const mongoose = require('mongoose');

const courierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    vehicle: {
        type: String,
        enum: ['bicycle', 'motorcycle', 'car', 'van', 'truck'],
        required: true
    },
    zone: { type: String, required: true },
    status: {
        type: String,
        enum: ['available', 'on_delivery', 'off_duty'],
        default: 'available'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Courier', courierSchema);
