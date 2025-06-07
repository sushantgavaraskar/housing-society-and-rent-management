const Request = require('../models/Request');

// Create a new maintenance request (tenant)
exports.createRequest = async (req, res) => {
    try {
        const { title, description, flat, society } = req.body;

        const request = await Request.create({
            title,
            description,
            flat,
            society,
            tenant: req.user._id
        });

        res.status(201).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating request' });
    }
};

// View requests for current tenant
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ tenant: req.user._id })
            .populate('flat', 'title address')
            .populate('society', 'name')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests' });
    }
};

// Admin: View all requests in society
exports.getSocietyRequests = async (req, res) => {
    try {
        const { societyId } = req.params;

        const requests = await Request.find({ society: societyId })
            .populate('tenant', 'name email')
            .populate('flat', 'title address');

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching society requests' });
    }
};

// Admin: Update request status
exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, feedback, assignedTo } = req.body;

        const request = await Request.findById(id);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status;
        request.feedback = feedback || request.feedback;
        request.assignedTo = assignedTo || request.assignedTo;

        if (status === 'resolved') {
            request.resolvedAt = new Date();
        }

        await request.save();
        res.json({ message: 'Request updated', request });
    } catch (error) {
        res.status(500).json({ message: 'Error updating request' });
    }
};
