const Flat = require('../models/Flat');
const Maintenance = require('../models/Maintenance');
const Rent = require('../models/Rent');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

class DashboardService {
  // Get admin dashboard data
  static async getAdminDashboard(adminId) {
    try {
      // Get admin's societies
      const societies = await Flat.distinct('society', { owner: adminId });
      
      // Get total flats managed by admin
      const totalFlats = await Flat.countDocuments({ owner: adminId });
      
      // Get occupied flats
      const occupiedFlats = await Flat.countDocuments({ 
        owner: adminId, 
        tenant: { $exists: true, $ne: null } 
      });

      // Get vacant flats
      const vacantFlats = totalFlats - occupiedFlats;

      // Get maintenance statistics
      const maintenanceStats = await this.getMaintenanceStats(societies);

      // Get rent statistics
      const rentStats = await this.getRentStats(societies);

      // Get complaint statistics
      const complaintStats = await this.getComplaintStats(societies);

      return {
        totalFlats,
        occupiedFlats,
        vacantFlats,
        maintenance: maintenanceStats,
        rent: rentStats,
        complaints: complaintStats
      };
    } catch (error) {
      console.error('Dashboard service error:', error);
      throw new Error('Failed to load dashboard data');
    }
  }

  // Get owner dashboard data
  static async getOwnerDashboard(ownerId) {
    try {
      // Get owner's flats
      const flats = await Flat.find({ owner: ownerId })
        .populate('tenant', 'name email')
        .populate('building', 'name')
        .populate('society', 'name');

      // Get maintenance due
      const maintenanceDue = await Maintenance.find({
        flat: { $in: flats.map(flat => flat._id) },
        status: 'unpaid'
      }).populate('flat building society');

      // Get rent due
      const rentDue = await Rent.find({
        flat: { $in: flats.map(flat => flat._id) },
        status: 'unpaid'
      }).populate('flat building society tenant');

      // Calculate total amounts with proper null checks
      const totalMaintenanceDue = maintenanceDue
        .reduce((sum, maintenance) => sum + (maintenance.amount || 0), 0);

      const totalRentDue = rentDue
        .reduce((sum, rent) => sum + (rent.amount || 0), 0);

      return {
        flats,
        maintenanceDue: {
          records: maintenanceDue,
          total: totalMaintenanceDue,
          count: maintenanceDue.length
        },
        rentDue: {
          records: rentDue,
          total: totalRentDue,
          count: rentDue.length
        }
      };
    } catch (error) {
      console.error('Owner dashboard service error:', error);
      throw new Error('Failed to load owner dashboard data');
    }
  }

  // Get tenant dashboard data
  static async getTenantDashboard(tenantId) {
    try {
      // Get tenant's flat with proper null check
      const flat = await Flat.findOne({ tenant: tenantId })
        .populate('owner', 'name email')
        .populate('building', 'name')
        .populate('society', 'name');

      // If no flat is assigned, return a default dashboard
      if (!flat) {
        return {
          flat: null,
          maintenanceDue: {
            records: [],
            total: 0,
            count: 0
          },
          rentDue: {
            records: [],
            total: 0,
            count: 0
          },
          message: 'No flat assigned to tenant'
        };
      }

      // Get maintenance due for tenant's flat
      const maintenanceDue = await Maintenance.find({
        flat: flat._id,
        status: 'unpaid'
      }).populate('flat building society');

      // Get rent due for tenant's flat
      const rentDue = await Rent.find({
        flat: flat._id,
        status: 'unpaid'
      }).populate('flat building society');

      // Calculate totals with null checks
      const totalMaintenanceDue = maintenanceDue
        .reduce((sum, maintenance) => sum + (maintenance.amount || 0), 0);

      const totalRentDue = rentDue
        .reduce((sum, rent) => sum + (rent.amount || 0), 0);

      return {
        flat,
        maintenanceDue: {
          records: maintenanceDue,
          total: totalMaintenanceDue,
          count: maintenanceDue.length
        },
        rentDue: {
          records: rentDue,
          total: totalRentDue,
          count: rentDue.length
        }
      };
    } catch (error) {
      console.error('Tenant dashboard service error:', error);
      throw new Error('Failed to load tenant dashboard data');
    }
  }

  // Get maintenance statistics
  static async getMaintenanceStats(societyIds) {
    try {
      const [totalMaintenance, paidMaintenance, unpaidMaintenance] = await Promise.all([
        Maintenance.countDocuments({ society: { $in: societyIds } }),
        Maintenance.countDocuments({ 
          society: { $in: societyIds }, 
          status: 'paid' 
        }),
        Maintenance.countDocuments({ 
          society: { $in: societyIds }, 
          status: 'unpaid' 
        })
      ]);

      const totalAmount = await Maintenance.aggregate([
        { $match: { society: { $in: societyIds } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const paidAmount = await Maintenance.aggregate([
        { $match: { society: { $in: societyIds }, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      return {
        total: totalMaintenance,
        paid: paidMaintenance,
        unpaid: unpaidMaintenance,
        totalAmount: totalAmount[0]?.total || 0,
        paidAmount: paidAmount[0]?.total || 0,
        outstandingAmount: (totalAmount[0]?.total || 0) - (paidAmount[0]?.total || 0)
      };
    } catch (error) {
      console.error('Maintenance stats error:', error);
      return {
        total: 0,
        paid: 0,
        unpaid: 0,
        totalAmount: 0,
        paidAmount: 0,
        outstandingAmount: 0
      };
    }
  }

  // Get rent statistics
  static async getRentStats(societyIds) {
    try {
      const [totalRent, paidRent, unpaidRent] = await Promise.all([
        Rent.countDocuments({ society: { $in: societyIds } }),
        Rent.countDocuments({ 
          society: { $in: societyIds }, 
          status: 'paid' 
        }),
        Rent.countDocuments({ 
          society: { $in: societyIds }, 
          status: 'unpaid' 
        })
      ]);

      const totalAmount = await Rent.aggregate([
        { $match: { society: { $in: societyIds } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const paidAmount = await Rent.aggregate([
        { $match: { society: { $in: societyIds }, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      return {
        total: totalRent,
        paid: paidRent,
        unpaid: unpaidRent,
        totalAmount: totalAmount[0]?.total || 0,
        paidAmount: paidAmount[0]?.total || 0,
        outstandingAmount: (totalAmount[0]?.total || 0) - (paidAmount[0]?.total || 0)
      };
    } catch (error) {
      console.error('Rent stats error:', error);
      return {
        total: 0,
        paid: 0,
        unpaid: 0,
        totalAmount: 0,
        paidAmount: 0,
        outstandingAmount: 0
      };
    }
  }

  // Get complaint statistics
  static async getComplaintStats(societyIds) {
    try {
      const [totalComplaints, openComplaints, resolvedComplaints] = await Promise.all([
        Complaint.countDocuments({ society: { $in: societyIds } }),
        Complaint.countDocuments({ 
          society: { $in: societyIds }, 
          status: { $in: ['open', 'in-progress'] } 
        }),
        Complaint.countDocuments({ 
          society: { $in: societyIds }, 
          status: 'resolved' 
        })
      ]);

      return {
        total: totalComplaints,
        open: openComplaints,
        resolved: resolvedComplaints,
        pending: totalComplaints - openComplaints - resolvedComplaints
      };
    } catch (error) {
      console.error('Complaint stats error:', error);
      return {
        total: 0,
        open: 0,
        resolved: 0,
        pending: 0
      };
    }
  }
}

module.exports = DashboardService;