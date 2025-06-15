const formatResponse = require('../utils/responseFormatter');
const Flat = require('../models/Flat');

const verifyOwnerAssigned = async (req, res, next) => {
  const flat = await Flat.findOne({ owner: req.user._id });
  if (!flat) {
    return res.status(403).json(formatResponse({
      success: false,
      message: 'Owner not assigned to any flat',
      statusCode: 403
    }));
  }
  next();
};

const verifyTenantAssigned = async (req, res, next) => {
  const flat = await Flat.findOne({ tenant: req.user._id });
  if (!flat) {
    return res.status(403).json(formatResponse({
      success: false,
      message: 'Tenant not assigned to any flat',
      statusCode: 403
    }));
  }
  next();
};

module.exports = { verifyOwnerAssigned, verifyTenantAssigned };
