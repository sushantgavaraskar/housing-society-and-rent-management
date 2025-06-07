const Request = require('../models/request');
const Society = require('../models/society');

exports.createRequest = async (req, res, next) => {
  try {
    const request = new Request({ ...req.body, raisedBy: req.user._id });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ raisedBy: req.user._id });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.getRequestsBySociety = async (req, res, next) => {
  try {
    const requests = await Request.find({ society: req.params.id });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

exports.updateRequestStatus = async (req, res, next) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    next(err);
  }
};
exports.getAllComplaintsGroupedBySociety = async (req, res, next) => {
    try {
        // Fetch all complaints and populate society and raisedBy fields
        const complaints = await Request.find()
          .populate('society', 'name')      // populate society name only
          .populate('raisedBy', 'name email') // populate raisedBy user info
    
        res.status(200).json(complaints);
      } catch (error) {
        console.error('Error fetching complaints grouped by society:', error);
        res.status(500).json({ message: 'Server error' });
      }
    };
