const WasteRecord = require('../models/WasteRecord');

// CREATE
const createWasteRecord = async (req, res) => {
  try {
    const { wasteType, quantity, unit, location, collectionDate, status, notes } = req.body;
    const record = await WasteRecord.create({
      wasteType, quantity, unit, location, collectionDate, status, notes,
      createdBy: req.user._id,
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ ALL
const getWasteRecords = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const records = await WasteRecord.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
const getWasteRecordById = async (req, res) => {
  try {
    const record = await WasteRecord.findById(req.params.id)
      .populate('createdBy', 'name email');
    if (!record) return res.status(404).json({ message: 'Record not found' });
    if (req.user.role !== 'admin' && record.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateWasteRecord = async (req, res) => {
  try {
    const record = await WasteRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    if (req.user.role !== 'admin' && record.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to update this record' });
    }
    const updated = await WasteRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
const deleteWasteRecord = async (req, res) => {
  try {
    const record = await WasteRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete records' });
    }
    await record.deleteOne();
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWasteRecord, getWasteRecords, getWasteRecordById,
  updateWasteRecord, deleteWasteRecord,
};