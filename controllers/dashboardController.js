const Property = require('../models/property');
const Request = require('../models/request');
const Maintenance = require('../models/maintenance');

exports.ownerDashboard = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    const rented = properties.filter((p) => p.tenant);
    res.json({
      totalProperties: properties.length,
      rentedProperties: rented.length,
    });
  } catch (err) {
    next(err);
  }
};

exports.tenantDashboard = async (req, res, next) => {
  try {
    const requests = await Request.find({ raisedBy: req.user._id });
    res.json({
      totalRequests: requests.length,
      resolvedRequests: requests.filter((r) => r.status === 'resolved').length,
    });
  } catch (err) {
    next(err);
  }
};

exports.adminDashboard = async (req, res, next) => {
  try {
    const maintenances = await Maintenance.find();
    const requests = await Request.find();
    res.json({
      totalMaintenanceRecords: maintenances.length,
      totalRequests: requests.length,
    });
  } catch (err) {
    next(err);
  }
};
