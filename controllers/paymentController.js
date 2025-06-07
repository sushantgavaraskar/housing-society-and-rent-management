// controllers/paymentController.js
const Transaction = require('../models/Transaction');
const Property = require('../models/Property');
const Maintenance = require('../models/Maintenance');

exports.payRent = async (req, res) => {
    try {
        const { propertyId, amount } = req.body;
        const userId = req.user._id;

        const property = await Property.findById(propertyId);
        if (!property || !property.tenant.equals(userId)) {
            return res.status(403).json({ message: 'Unauthorized or invalid property' });
        }

        const transaction = await Transaction.create({
            user: userId,
            type: 'rent',
            amount,
            referenceId: propertyId,
        });

        res.json({ message: 'Rent payment recorded', transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error recording rent payment' });
    }
};

exports.payMaintenance = async (req, res) => {
    try {
        const { maintenanceId, amount } = req.body;
        const userId = req.user._id;

        const maintenance = await Maintenance.findById(maintenanceId);
        if (!maintenance || !maintenance.tenant.equals(userId)) {
            return res.status(403).json({ message: 'Unauthorized or invalid maintenance record' });
        }

        await Maintenance.findByIdAndUpdate(maintenanceId, {
            status: 'paid',
            paidDate: new Date()
        });

        const transaction = await Transaction.create({
            user: userId,
            type: 'maintenance',
            amount,
            referenceId: maintenanceId,
        });

        res.json({ message: 'Maintenance payment recorded', transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error recording maintenance payment' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const userId = req.user._id;

        const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};
