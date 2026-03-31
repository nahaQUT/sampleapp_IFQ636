const mongoose = require('mongoose');

const wasteRecordSchema = new mongoose.Schema(
  {
    wasteType: {
      type: String,
      required: [true, 'Waste type is required'],
      enum: ['General', 'Recyclable', 'Hazardous', 'Organic', 'Electronic'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    unit: {
      type: String,
      default: 'kg',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    collectionDate: {
      type: Date,
      required: [true, 'Collection date is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Collected', 'Disposed'],
      default: 'Pending',
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WasteRecord', wasteRecordSchema);