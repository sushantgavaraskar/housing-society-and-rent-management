// services/flatService.js
const Flat = require('../models/Flat');
const User = require('../models/User');

exports.assignTenant = async ({ flatId, tenantId, ownerId }) => {
  const flat = await Flat.findOne({ _id: flatId, owner: ownerId }).populate('society');
  if (!flat) throw new Error('Unauthorized or flat not found');

  const tenant = await User.findById(tenantId);
  if (!tenant || tenant.role !== 'tenant') throw new Error('Invalid tenant');

  flat.tenant = tenant._id;
  flat.isRented = true;
  flat.occupancyStatus = 'occupied-tenant';
  await flat.save();

  if (!tenant.society) {
    tenant.society = flat.society._id;
    await tenant.save();
  }

  return flat;
};
