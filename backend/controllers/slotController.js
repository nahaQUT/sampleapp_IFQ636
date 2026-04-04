const Slot = require('../models/Slot');

const getSlots = async (req, res) => {
  try {
    const slots = await Slot.find().populate('doctor', 'name specialization email phone');
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ isBooked: false }).populate(
      'doctor',
      'name specialization email phone'
    );
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSlotById = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate(
      'doctor',
      'name specialization email phone'
    );

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSlot = async (req, res) => {
  try {
    const { doctor, date, startTime, endTime, isBooked } = req.body;

    const slot = await Slot.create({
      doctor,
      date,
      startTime,
      endTime,
      isBooked,
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    slot.doctor = req.body.doctor || slot.doctor;
    slot.date = req.body.date || slot.date;
    slot.startTime = req.body.startTime || slot.startTime;
    slot.endTime = req.body.endTime || slot.endTime;

    if (req.body.isBooked !== undefined) {
      slot.isBooked = req.body.isBooked;
    }

    const updatedSlot = await slot.save();
    res.status(200).json(updatedSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    await slot.deleteOne();
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSlots,
  getAvailableSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
};