// services/paymentService.js
const Maintenance = require('../models/Maintenance');
const Rent = require('../models/Rent');
const Flat = require('../models/Flat');

class PaymentService {
  // Validate payment authorization
  static async validatePaymentAuthorization(userId, userRole, flatId) {
    const flat = await Flat.findById(flatId);
    if (!flat) {
      throw new Error('Flat not found');
    }

    // ✅ FIXED: Remove restrictive condition that prevented owners from paying when they have tenants
    const isValid = (userRole === 'owner' && flat.owner.toString() === userId) ||
                    (userRole === 'tenant' && flat.tenant.toString() === userId);

    if (!isValid) {
      throw new Error('You are not authorized to make payments for this flat');
    }

    return flat;
  }

  // Pay maintenance
  static async payMaintenance(maintenanceId, userId, userRole, paymentDetails) {
    const maintenance = await Maintenance.findById(maintenanceId);
    if (!maintenance) {
      throw new Error('Maintenance record not found');
    }

    // Validate authorization
    await this.validatePaymentAuthorization(userId, userRole, maintenance.flat);

    if (maintenance.status === 'paid') {
      throw new Error('Maintenance is already paid');
    }

    // Update maintenance record
    maintenance.status = 'paid';
    maintenance.paidOn = new Date();
    maintenance.paymentMethod = paymentDetails.paymentMethod;
    maintenance.transactionId = paymentDetails.transactionId;
    maintenance.paidBy = userId;

    await maintenance.save();

    return maintenance;
  }

  // Pay rent
  static async payRent(rentId, userId, userRole, paymentDetails) {
    const rent = await Rent.findById(rentId);
    if (!rent) {
      throw new Error('Rent record not found');
    }

    // Validate authorization
    await this.validatePaymentAuthorization(userId, userRole, rent.flat);

    if (rent.status === 'paid') {
      throw new Error('Rent is already paid');
    }

    // Update rent record
    rent.status = 'paid';
    rent.paidOn = new Date();
    rent.paymentMethod = paymentDetails.paymentMethod;
    rent.transactionId = paymentDetails.transactionId;
    rent.paidBy = userId;

    await rent.save();

    return rent;
  }

  // Get payment history for a user
  static async getPaymentHistory(userId, userRole, filters = {}) {
    const { page = 1, limit = 10, type } = filters;
    const skip = (page - 1) * limit;

    let query = {};
    if (type === 'maintenance') {
      query = { paidBy: userId };
    } else if (type === 'rent') {
      query = { paidBy: userId };
    } else {
      // Get both maintenance and rent payments
      const [maintenancePayments, rentPayments] = await Promise.all([
        Maintenance.find({ paidBy: userId }).populate('flat building society'),
        Rent.find({ paidBy: userId }).populate('flat building society')
      ]);

      return {
        maintenance: maintenancePayments,
        rent: rentPayments,
        total: maintenancePayments.length + rentPayments.length
      };
    }

    const payments = await Maintenance.find(query)
      .populate('flat building society')
      .skip(skip)
      .limit(limit)
      .sort({ paidOn: -1 });

    const total = await Maintenance.countDocuments(query);

    return {
      payments,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  // Get overdue payments
  static async getOverduePayments(userId, userRole) {
    const currentDate = new Date();

    // Get user's flats
    const userFlats = await Flat.find({
      $or: [
        { owner: userId },
        { tenant: userId }
      ]
    });

    const flatIds = userFlats.map(flat => flat._id);

    // Get overdue maintenance
    const overdueMaintenance = await Maintenance.find({
      flat: { $in: flatIds },
      status: 'unpaid',
      dueDate: { $lt: currentDate }
    }).populate('flat building society');

    // Get overdue rent
    const overdueRent = await Rent.find({
      flat: { $in: flatIds },
      status: 'unpaid',
      dueDate: { $lt: currentDate }
    }).populate('flat building society');

    return {
      maintenance: overdueMaintenance,
      rent: overdueRent,
      total: overdueMaintenance.length + overdueRent.length
    };
  }

  // Validate payment details
  static validatePaymentDetails(paymentDetails) {
    const { paymentMethod, transactionId } = paymentDetails;

    if (!paymentMethod || !['cash', 'online', 'bank-transfer', 'upi'].includes(paymentMethod)) {
      throw new Error('Invalid payment method');
    }

    if (!transactionId || transactionId.trim().length === 0) {
      throw new Error('Transaction ID is required');
    }

    return true;
  }
}

module.exports = PaymentService;
