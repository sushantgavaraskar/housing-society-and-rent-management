// services/paymentService.js
const Maintenance = require('../models/Maintenance');
const Rent = require('../models/Rent');

exports.payMaintenance = async ({ maintenanceId, userId, role }) => {
  const maintenance = await Maintenance.findById(maintenanceId).populate('flat');
  if (!maintenance) throw new Error('Maintenance record not found');
  if (maintenance.isPaid) throw new Error('Already paid');

  const { flat } = maintenance;

  const isValid = (role === 'owner' && flat.owner.toString() === userId && !flat.tenant) ||
                  (role === 'tenant' && flat.tenant.toString() === userId);
  if (!isValid) throw new Error('Unauthorized payment');

  maintenance.isPaid = true;
  maintenance.paidOn = new Date();
  await maintenance.save();

  return maintenance;
};

exports.payRent = async ({ rentId, userId }) => {
  const rent = await Rent.findById(rentId).populate('tenant');
  if (!rent) throw new Error('Rent record not found');
  if (rent.isPaid) throw new Error('Rent already paid');

  if (rent.tenant._id.toString() !== userId) throw new Error('Unauthorized rent payment');

  rent.isPaid = true;
  rent.paidOn = new Date();
  await rent.save();

  return rent;
};
