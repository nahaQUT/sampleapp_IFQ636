const Delivery = require('../models/Delivery');

const createDelivery = async (req, res) => {
    const { parcel, courier, pickupTime, notes } = req.body;
    try {
        const delivery = await Delivery.create({
            parcel,
            courier,
            pickupTime,
            notes,
            createdBy: req.user.id,
        });
        const populated = await delivery.populate(['parcel', 'courier']);
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find({ createdBy: req.user.id })
            .populate('parcel')
            .populate('courier')
            .sort({ createdAt: -1 });
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id)
            .populate('parcel')
            .populate('courier');
        if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        if (delivery.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(delivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        if (delivery.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { parcel, courier, pickupTime, deliveredTime, status, notes } = req.body;
        delivery.parcel = parcel || delivery.parcel;
        delivery.courier = courier || delivery.courier;
        delivery.pickupTime = pickupTime || delivery.pickupTime;
        delivery.deliveredTime = deliveredTime || delivery.deliveredTime;
        delivery.status = status || delivery.status;
        delivery.notes = notes !== undefined ? notes : delivery.notes;

        const updatedDelivery = await delivery.save();
        const populated = await updatedDelivery.populate(['parcel', 'courier']);
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        if (delivery.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await delivery.deleteOne();
        res.json({ message: 'Delivery removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createDelivery, getDeliveries, getDeliveryById, updateDelivery, deleteDelivery };
