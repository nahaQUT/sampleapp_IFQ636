const express = require('express');
const { createDelivery, getDeliveries, getDeliveryById, updateDelivery, deleteDelivery } = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createDelivery);
router.get('/', protect, getDeliveries);
router.get('/:id', protect, getDeliveryById);
router.put('/:id', protect, updateDelivery);
router.delete('/:id', protect, deleteDelivery);

module.exports = router;
