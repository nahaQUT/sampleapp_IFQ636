const Courier = require('../models/Courier');

const createCourier = async (req, res) => {
    const { name, email, phone, vehicle, zone } = req.body;
    try {
        const exists = await Courier.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Courier with this email already exists' });

        const courier = await Courier.create({
            name,
            email,
            phone,
            vehicle,
            zone,
            createdBy: req.user.id,
        });
        res.status(201).json(courier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCouriers = async (req, res) => {
    try {
        const couriers = await Courier.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.json(couriers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourierById = async (req, res) => {
    try {
        const courier = await Courier.findById(req.params.id);
        if (!courier) return res.status(404).json({ message: 'Courier not found' });
        if (courier.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(courier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCourier = async (req, res) => {
    try {
        const courier = await Courier.findById(req.params.id);
        if (!courier) return res.status(404).json({ message: 'Courier not found' });
        if (courier.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { name, email, phone, vehicle, zone, status } = req.body;
        courier.name = name || courier.name;
        courier.email = email || courier.email;
        courier.phone = phone || courier.phone;
        courier.vehicle = vehicle || courier.vehicle;
        courier.zone = zone || courier.zone;
        courier.status = status || courier.status;

        const updatedCourier = await courier.save();
        res.json(updatedCourier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCourier = async (req, res) => {
    try {
        const courier = await Courier.findById(req.params.id);
        if (!courier) return res.status(404).json({ message: 'Courier not found' });
        if (courier.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await courier.deleteOne();
        res.json({ message: 'Courier removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCourier, getCouriers, getCourierById, updateCourier, deleteCourier };
