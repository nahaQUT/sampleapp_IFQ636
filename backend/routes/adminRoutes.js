const express = require('express');
const {
  getAllUsers,
  getAllHabits,
  getHabitByIdForAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/habits', protect, adminOnly, getAllHabits);
router.get('/habits/:id', protect, adminOnly, getHabitByIdForAdmin);

module.exports = router;