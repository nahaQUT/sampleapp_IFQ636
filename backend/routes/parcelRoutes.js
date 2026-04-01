const express = require('express');
const { createParcel, getParcels, getParcelById, getParcelByTracking, updateParcel, deleteParcel } = require('../controllers/parcelController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createParcel);
router.get('/', protect, getParcels);
router.get('/track/:trackingNumber', getParcelByTracking);
router.get('/:id', protect, getParcelById);
router.put('/:id', protect, updateParcel);
router.delete('/:id', protect, deleteParcel);

module.exports = router;
