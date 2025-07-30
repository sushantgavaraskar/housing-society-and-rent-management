const Rent = require('../models/Rent');
const Flat = require('../models/Flat');
const User = require('../models/User');

class RentService {
  // Generate rent for a specific month
  static async generateRentForMonth(billingMonth, societyId = null) {
    // Find all rented flats
    const filter = { isRented: true };
    if (societyId) filter.society = societyId;

    const rentedFlats = await Flat.find(filter)
      .populate('owner', 'name email')
      .populate('tenant', 'name email')
      .populate('society', 'name');

    if (rentedFlats.length === 0) {
      throw new Error('No rented flats found');
    }

    const rentRecords = [];
    const existingRentRecords = await Rent.find({ billingMonth });
    const existingFlatIds = existingRentRecords.map(rent => rent.flat.toString());

    for (const flat of rentedFlats) {
      // Skip if rent record already exists for this flat and month
      if (existingFlatIds.includes(flat._id.toString())) {
        continue;
      }

      // Get rent amount from flat or use default
      const rentAmount = flat.rentAmount || 0;

      if (rentAmount > 0) {
        rentRecords.push({
          flat: flat._id,
          building: flat.building,
          society: flat.society,
          owner: flat.owner,
          tenant: flat.tenant,
          billingMonth,
          amount: rentAmount,
          status: 'unpaid',
          dueDate: new Date(new Date(billingMonth + '-01').getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from start of month
        });
      }
    }

    if (rentRecords.length === 0) {
      throw new Error('No valid rent records to generate');
    }

    const createdRentRecords = await Rent.insertMany(rentRecords);

    return {
      message: `${createdRentRecords.length} rent records generated for ${billingMonth}`,
      count: createdRentRecords.length,
      records: createdRentRecords
    };
  }

  // Get rent history with filtering
  static async getRentHistory(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;
    const { status, society, flat, tenant, owner } = filters;

    const filter = {};
    if (status) filter.status = status;
    if (society) filter.society = society;
    if (flat) filter.flat = flat;
    if (tenant) filter.tenant = tenant;
    if (owner) filter.owner = owner;

    const [rents, total] = await Promise.all([
      Rent.find(filter)
        .populate('flat', 'flatNumber')
        .populate('building', 'name')
        .populate('society', 'name')
        .populate('owner', 'name email')
        .populate('tenant', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ billingMonth: -1, dueDate: -1 }),
      Rent.countDocuments(filter)
    ]);

    return {
      rents,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  // Get rent by ID
  static async getRentById(rentId) {
    const rent = await Rent.findById(rentId)
      .populate('flat', 'flatNumber')
      .populate('building', 'name')
      .populate('society', 'name')
      .populate('owner', 'name email')
      .populate('tenant', 'name email');

    if (!rent) {
      throw new Error('Rent record not found');
    }

    return rent;
  }

  // Update rent status
  static async updateRentStatus(rentId, status, paymentDetails = {}) {
    const rent = await Rent.findById(rentId);
    if (!rent) {
      throw new Error('Rent record not found');
    }

    rent.status = status;
    if (status === 'paid') {
      rent.paidOn = new Date();
      rent.paymentMethod = paymentDetails.paymentMethod;
      rent.transactionId = paymentDetails.transactionId;
    }

    await rent.save();

    return rent;
  }

  // Get overdue rents
  static async getOverdueRents(societyId = null) {
    const filter = {
      status: { $in: ['unpaid', 'overdue'] },
      dueDate: { $lt: new Date() }
    };

    if (societyId) filter.society = societyId;

    const overdueRents = await Rent.find(filter)
      .populate('flat', 'flatNumber')
      .populate('building', 'name')
      .populate('society', 'name')
      .populate('owner', 'name email')
      .populate('tenant', 'name email')
      .sort({ dueDate: 1 });

    return overdueRents;
  }

  // Get rent statistics
  static async getRentStatistics(societyId = null) {
    const filter = {};
    if (societyId) filter.society = societyId;

    const [totalRents, paidRents, unpaidRents, overdueRents] = await Promise.all([
      Rent.countDocuments(filter),
      Rent.countDocuments({ ...filter, status: 'paid' }),
      Rent.countDocuments({ ...filter, status: 'unpaid' }),
      Rent.countDocuments({ ...filter, status: 'overdue' })
    ]);

    const totalAmount = await Rent.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const paidAmount = await Rent.aggregate([
      { $match: { ...filter, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return {
      total: totalRents,
      paid: paidRents,
      unpaid: unpaidRents,
      overdue: overdueRents,
      totalAmount: totalAmount[0]?.total || 0,
      paidAmount: paidAmount[0]?.total || 0,
      outstandingAmount: (totalAmount[0]?.total || 0) - (paidAmount[0]?.total || 0)
    };
  }

  // Get current month rent for a user
  static async getCurrentMonthRent(userId, userRole) {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const filter = {
      billingMonth: currentMonth
    };

    if (userRole === 'tenant') {
      filter.tenant = userId;
    } else if (userRole === 'owner') {
      filter.owner = userId;
    }

    const rent = await Rent.findOne(filter)
      .populate('flat', 'flatNumber')
      .populate('building', 'name')
      .populate('society', 'name')
      .populate('owner', 'name email')
      .populate('tenant', 'name email');

    if (!rent) {
      throw new Error('No rent record found for this month');
    }

    return rent;
  }
}

module.exports = RentService; 