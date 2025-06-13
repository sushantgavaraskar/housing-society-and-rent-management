const Flat = require('../models/Flat');

// Check if owner is assigned to any flat
const verifyOwnerAssigned = async (req, res, next) => {
  const flat = await Flat.findOne({ owner: req.user._id });
  if (!flat) return res.status(403).json({ message: "Owner is not registered or assigned to any flat yet." });
  next();
};

// Check if tenant is assigned to any flat
const verifyTenantAssigned = async (req, res, next) => {
  const flat = await Flat.findOne({ tenant: req.user._id });
  if (!flat) return res.status(403).json({ message: "Tenant is not assigned to any flat yet." });
  next();
};

module.exports = {
  verifyOwnerAssigned,
  verifyTenantAssigned
};
