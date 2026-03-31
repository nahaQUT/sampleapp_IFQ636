const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createWasteRecord, getWasteRecords, getWasteRecordById,
  updateWasteRecord, deleteWasteRecord,
} = require('../controllers/wasteRecordController');

router.route('/')
  .get(protect, getWasteRecords)
  .post(protect, createWasteRecord);

router.route('/:id')
  .get(protect, getWasteRecordById)
  .put(protect, updateWasteRecord)
  .delete(protect, deleteWasteRecord);

module.exports = router;