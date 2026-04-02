const express = require('express');
const router = express.Router();
const Podcast = require('../models/Podcast');
//const authMiddleware = require('../middleware/authMiddleware');
//const { protect } = require('../middleware/authMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const protect = authMiddleware.protect;
// GET all podcasts (public)
router.get('/', async (req, res) => {
  try {
    const podcasts = await Podcast.find()
      .populate('category', 'categoryName')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(podcasts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single podcast (public)
router.get('/:id', async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id)
      .populate('category', 'categoryName')
      .populate('createdBy', 'username');
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    res.json(podcast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create podcast (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, audioUrl, category, duration } = req.body;
    const podcast = new Podcast({
      title,
      description,
      audioUrl,
      category,
      duration,
      createdBy: req.user.id,
    });
    const newPodcast = await podcast.save();
    res.status(201).json(newPodcast);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update podcast (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, audioUrl, category, duration } = req.body;
    const podcast = await Podcast.findByIdAndUpdate(
      req.params.id,
      { title, description, audioUrl, category, duration },
      { new: true }
    );
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    res.json(podcast);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE podcast (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndDelete(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    res.json({ message: 'Podcast deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;