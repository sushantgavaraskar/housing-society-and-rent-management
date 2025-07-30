const Society = require('../models/Society');
const Building = require('../models/Building');
const Flat = require('../models/Flat');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Maintenance = require('../models/Maintenance');
const Rent = require('../models/Rent');
const OwnershipRequest = require('../models/OwnershipRequest');
const Announcement = require('../models/Announcement');

class DashboardService {
  // Admin Dashboard - Enhanced with more meaningful data
  static async getAdminDashboard(adminId) {
    try {
      const [
        totalSocieties,
        totalUsers,
        pendingOwnershipRequests,
        complaintsByCategory,
        recentComplaints,
        maintenanceStats,
        rentStats
      ] = await Promise.all([
        // Count societies managed by this admin
        Society.countDocuments({ admin: adminId }),
        
        // Count users by role
        User.aggregate([
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 }
            }
          }
        ]),
        
        // Count pending ownership requests
        OwnershipRequest.countDocuments({ status: 'pending' }),
        
        // Complaints by category
        Complaint.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ]),
        
        // Recent complaints (last 7 days)
        Complaint.find({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
        .populate('raisedBy', 'name')
        .populate('society', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
        
        // Maintenance statistics
        Maintenance.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              paid: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
              unpaid: { $sum: { $cond: [{ $eq: ['$status', 'unpaid'] }, 1, 0] } }
            }
          }
        ]),
        
        // Rent statistics
        Rent.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              paid: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
              overdue: { $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] } }
            }
          }
        ])
      ]);

      // Transform user counts into object
      const userCounts = totalUsers.reduce((acc, user) => {
        acc[user._id] = user.count;
        return acc;
      }, {});

      // Transform complaint categories into object
      const complaintCategories = complaintsByCategory.reduce((acc, category) => {
        acc[category._id] = category.count;
        return acc;
      }, {});

      return {
        societies: {
          total: totalSocieties
        },
        users: {
          total: Object.values(userCounts).reduce((a, b) => a + b, 0),
          byRole: userCounts
        },
        ownershipRequests: {
          pending: pendingOwnershipRequests
        },
        complaints: {
          byCategory: complaintCategories,
          recent: recentComplaints
        },
        maintenance: maintenanceStats[0] || { total: 0, paid: 0, unpaid: 0 },
        rent: rentStats[0] || { total: 0, paid: 0, overdue: 0 }
      };
    } catch (error) {
      throw error;
    }
  }

  // Owner Dashboard
  static async getOwnerDashboard(ownerId) {
    try {
      const [
        myFlats,
        complaints,
        maintenanceDue,
        rentHistory,
        recentAnnouncements
      ] = await Promise.all([
        // Get owner's flats
        Flat.find({ owner: ownerId })
          .populate('society', 'name')
          .populate('building', 'name')
          .populate('tenant', 'name email phone'),
        
        // Get complaints filed by owner
        Complaint.find({ raisedBy: ownerId })
          .populate('society', 'name')
          .sort({ createdAt: -1 })
          .limit(5),
        
        // Get unpaid maintenance
        Maintenance.find({ 
          flat: { $in: await Flat.find({ owner: ownerId }).distinct('_id') },
          status: 'unpaid'
        })
        .populate('flat', 'flatNumber')
        .populate('society', 'name'),
        
        // Get rent history
        Rent.find({ 
          flat: { $in: await Flat.find({ owner: ownerId }).distinct('_id') }
        })
        .populate('flat', 'flatNumber')
        .populate('tenant', 'name')
        .sort({ dueDate: -1 })
        .limit(10),
        
        // Get recent announcements for owner's societies
        Announcement.find({
          society: { $in: await Flat.find({ owner: ownerId }).distinct('society') }
        })
        .populate('society', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
      ]);

      const totalRentCollected = rentHistory
        .filter(rent => rent.status === 'paid')
        .reduce((sum, rent) => sum + rent.amount, 0);

      const totalMaintenanceDue = maintenanceDue
        .reduce((sum, maintenance) => sum + maintenance.amount, 0);

      return {
        flats: {
          total: myFlats.length,
          details: myFlats
        },
        complaints: {
          total: complaints.length,
          recent: complaints
        },
        maintenance: {
          due: totalMaintenanceDue,
          unpaidCount: maintenanceDue.length,
          details: maintenanceDue
        },
        rent: {
          totalCollected: totalRentCollected,
          history: rentHistory
        },
        announcements: recentAnnouncements
      };
    } catch (error) {
      throw error;
    }
  }

  // Tenant Dashboard
  static async getTenantDashboard(tenantId) {
    try {
      const [
        myFlat,
        complaints,
        maintenanceDue,
        rentDue,
        announcements
      ] = await Promise.all([
        // Get tenant's flat
        Flat.findOne({ tenant: tenantId })
          .populate('society', 'name')
          .populate('building', 'name')
          .populate('owner', 'name email phone'),
        
        // Get complaints filed by tenant
        Complaint.find({ raisedBy: tenantId })
          .populate('society', 'name')
          .sort({ createdAt: -1 })
          .limit(5),
        
        // Get unpaid maintenance for tenant's flat
        Maintenance.find({ 
          flat: await Flat.findOne({ tenant: tenantId }).then(flat => flat?._id),
          status: 'unpaid'
        })
        .populate('society', 'name'),
        
        // Get current rent due
        Rent.findOne({ 
          flat: await Flat.findOne({ tenant: tenantId }).then(flat => flat?._id),
          status: { $in: ['unpaid', 'overdue'] }
        })
        .populate('society', 'name'),
        
        // Get announcements for tenant's society
        Announcement.find({
          society: await Flat.findOne({ tenant: tenantId }).then(flat => flat?.society)
        })
        .populate('society', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
      ]);

      const totalMaintenanceDue = maintenanceDue
        .reduce((sum, maintenance) => sum + maintenance.amount, 0);

      return {
        flat: myFlat,
        complaints: {
          total: complaints.length,
          recent: complaints
        },
        maintenance: {
          due: totalMaintenanceDue,
          unpaidCount: maintenanceDue.length,
          details: maintenanceDue
        },
        rent: {
          current: rentDue,
          due: rentDue?.amount || 0
        },
        announcements: announcements
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DashboardService; 