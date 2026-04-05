const express = require('express');
const {
  createHabit,
  getMyHabits,
  getMyHabitById,
  updateHabit,
  deleteHabit,
  markHabitComplete,
} = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createHabit);
router.get('/', protect, getMyHabits);
router.get('/:id', protect, getMyHabitById);
router.put('/:id', protect, updateHabit);
router.delete('/:id', protect, deleteHabit);
router.put('/:id/complete', protect, markHabitComplete);

module.exports = router;