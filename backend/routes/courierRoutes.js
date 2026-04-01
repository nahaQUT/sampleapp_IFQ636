const express = require('express');
const { createCourier, getCouriers, getCourierById, updateCourier, deleteCourier } = require('../controllers/courierController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createCourier);
router.get('/', protect, getCouriers);
router.get('/:id', protect, getCourierById);
router.put('/:id', protect, updateCourier);
router.delete('/:id', protect, deleteCourier);

module.exports = router;
