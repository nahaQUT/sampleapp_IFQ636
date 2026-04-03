const Habit = require('../models/Habit');
const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find()
      .populate('user', 'name email role')
      .populate('category', 'name description')
      .sort({ createdAt: -1 });

    return res.status(200).json(habits);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getHabitByIdForAdmin = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('category', 'name description');

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    return res.status(200).json(habit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllHabits,
  getHabitByIdForAdmin,
};