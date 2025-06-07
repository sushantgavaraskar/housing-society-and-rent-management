const Request = require('../models/request');

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
