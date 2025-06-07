const Maintenance = require('../models/Maintenance');

exports.createMaintenance = async (req, res) => {
    try {
        const { flat, amount, month, dueDate, tenant, society } = req.body;

        const maintenance = await Maintenance.create({
            flat,
            amount,
            month,
            dueDate,
            tenant,
            society,
            status: 'unpaid'
        });

        res.status(201).json(maintenance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating maintenance' });
    }
};

exports.getMaintenanceByTenant = async (req, res) => {
    try {
        const tenantId = req.user._id;

        const records = await Maintenance.find({ tenant: tenantId })
            .populate('flat', 'title address')
            .populate('society', 'name');

        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching records' });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const record = await Maintenance.findById(id);
        if (!record) return res.status(404).json({ message: 'Record not found' });

        record.status = status;
        if (status === 'paid') {
            record.paidDate = new Date();
        }

        await record.save();

        res.json({ message: 'Status updated', record });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating status' });
    }
};
