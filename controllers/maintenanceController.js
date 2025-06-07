const Maintenance = require('../models/maintenance');

exports.createMaintenance = async (req, res, next) => {
  try {
    const record = new Maintenance(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

exports.getMyMaintenance = async (req, res, next) => {
  try {
    const records = await Maintenance.find({ tenant: req.user._id });
    res.json(records);
  } catch (err) {
    next(err);
  }
};

exports.updateMaintenanceStatus = async (req, res, next) => {
  try {
    const record = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(record);
  } catch (err) {
    next(err);
  }
};
