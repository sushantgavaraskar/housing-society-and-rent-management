// controllers/dashboardController.js

const Property = require('../models/Property');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');

exports.getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user._id;

        const properties = await Property.find({ owner: ownerId }).populate('tenant', 'name email');

        const rented = properties.filter(p => p.isRented).length;
        const available = properties.length - rented;

        const maintenance = await Maintenance.find({ flat: { $in: properties.map(p => p._id) } });

        res.json({
            properties,
            rented,
            available,
            tenants: properties.map(p => p.tenant).filter(Boolean),
            maintenance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Dashboard error' });
    }
};

exports.getTenantDashboard = async (req, res) => {
    try {
        const tenantId = req.user._id;

        const property = await Property.findOne({ tenant: tenantId });
        const maintenance = await Maintenance.find({ tenant: tenantId });

        res.json({
            property,
            rentAmount: property?.rentAmount,
            maintenance,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Dashboard error' });
    }
};

const Society = require('../models/Society');
const Request = require('../models/Request');

exports.getAdminDashboard = async (req, res) => {
    try {
        const societies = await Society.find();
        const users = await User.find();
        const maintenance = await Maintenance.find();
        const requests = await Request.find();

        const totalDue = maintenance.filter(m => m.status === 'unpaid' || m.status === 'late').length;

        res.json({
            societiesCount: societies.length,
            usersCount: users.length,
            owners: users.filter(u => u.role === 'owner').length,
            tenants: users.filter(u => u.role === 'tenant').length,
            requestsCount: requests.length,
            totalDue
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Dashboard error' });
    }
};
