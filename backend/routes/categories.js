const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
//const {protect} = require('../middleware/authMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const protect = authMiddleware.protect;
// GET all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ categoryName: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create category (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const category = new Category({ categoryName, description });
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE category (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;