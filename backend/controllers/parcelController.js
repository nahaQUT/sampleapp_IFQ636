const Parcel = require('../models/Parcel');

const createParcel = async (req, res) => {
    const { sender, senderAddress, senderPhone, recipient, recipientAddress, recipientPhone, weight, description } = req.body;
    try {
        const parcel = await Parcel.create({
            sender,
            senderAddress,
            senderPhone,
            recipient,
            recipientAddress,
            recipientPhone,
            weight,
            description,
            createdBy: req.user.id,
        });
        res.status(201).json(parcel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getParcels = async (req, res) => {
    try {
        const parcels = await Parcel.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.json(parcels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getParcelById = async (req, res) => {
    try {
        const parcel = await Parcel.findById(req.params.id);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(parcel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateParcel = async (req, res) => {
    try {
        const parcel = await Parcel.findById(req.params.id);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { sender, senderAddress, senderPhone, recipient, recipientAddress, recipientPhone, weight, description, status } = req.body;
        parcel.sender = sender || parcel.sender;
        parcel.senderAddress = senderAddress || parcel.senderAddress;
        parcel.senderPhone = senderPhone || parcel.senderPhone;
        parcel.recipient = recipient || parcel.recipient;
        parcel.recipientAddress = recipientAddress || parcel.recipientAddress;
        parcel.recipientPhone = recipientPhone || parcel.recipientPhone;
        parcel.weight = weight || parcel.weight;
        parcel.description = description !== undefined ? description : parcel.description;
        parcel.status = status || parcel.status;

        const updatedParcel = await parcel.save();
        res.json(updatedParcel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getParcelByTracking = async (req, res) => {
    try {
        const parcel = await Parcel.findOne({ trackingNumber: req.params.trackingNumber });
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        res.json(parcel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteParcel = async (req, res) => {
    try {
        const parcel = await Parcel.findById(req.params.id);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await parcel.deleteOne();
        res.json({ message: 'Parcel removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createParcel, getParcels, getParcelById, getParcelByTracking, updateParcel, deleteParcel };
