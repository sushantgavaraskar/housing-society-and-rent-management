const Society = require('../models/Society');
const Building = require('../models/Building');
const Flat = require('../models/Flat');
const User = require('../models/User');
const Maintenance = require('../models/Maintenance');
const OwnershipRequest = require('../models/OwnershipRequest');
const Complaint = require('../models/Complaint');
const Rent = require('../models/Rent');
const sendEmail = require('../utils/sendEmail');
const formatResponse = require('../utils/responseFormatter');
const { updateComplaintStatus, getAllComplaints } = require('../services/complaintService');
const DashboardService = require('../services/dashboardService');
const SocietyService = require('../services/societyService');
const BuildingService = require('../services/buildingService');
const FlatService = require('../services/flatService');
const UserService = require('../services/userService');
const RentService = require('../services/rentService');

// === SOCIETIES ===

exports.createSociety = async (req, res, next) => {
  try {
    const society = await SocietyService.createSociety(req.body, req.user._id);

    res.status(201).json(formatResponse({
      message: 'Society created successfully',
      data: society
    }));
  } catch (err) {
    next(err);
  }
};

exports.getMySocieties = async (req, res, next) => {
  try {
    const result = await SocietyService.getSocietiesByAdmin(req.user._id, req.pagination);

    res.json(formatResponse({
      message: 'Societies retrieved successfully',
      data: result.societies,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.pages
      }
    }));
  } catch (err) {
    next(err);
  }
};

exports.updateSociety = async (req, res, next) => {
  try {
    const { id } = req.params;
    const society = await SocietyService.updateSociety(id, req.body, req.user._id);

    res.json(formatResponse({
      message: 'Society updated successfully',
      data: society
    }));
  } catch (err) {
    next(err);
  }
};

exports.deleteSociety = async (req, res, next) => {
  try {
    const { id } = req.params;
    await SocietyService.deleteSociety(id, req.user._id);

    res.json(formatResponse({
      message: 'Society and all associated buildings/flats deleted successfully'
    }));
  } catch (err) {
    next(err);
  }
};

// === BUILDINGS ===

exports.createBuilding = async (req, res, next) => {
  try {
    const building = await BuildingService.createBuilding(req.body);

    res.status(201).json(formatResponse({
      message: 'Building created successfully',
      data: building
    }));
  } catch (err) {
    next(err);
  }
};

exports.updateBuilding = async (req, res, next) => {
  try {
    const { id } = req.params;
    const building = await BuildingService.updateBuilding(id, req.body);

    res.json(formatResponse({
      message: 'Building updated successfully',
      data: building
    }));
  } catch (err) {
    next(err);
  }
};

exports.deleteBuilding = async (req, res, next) => {
  try {
    const { id } = req.params;
    await BuildingService.deleteBuilding(id);

    res.json(formatResponse({
      message: 'Building deleted successfully'
    }));
  } catch (err) {
    next(err);
  }
};

// === FLAT MANAGEMENT ===

exports.createFlats = async (req, res, next) => {
  try {
    const { buildingId, totalFlats } = req.body;
    const createdFlats = await FlatService.createFlatsForBuilding(buildingId, totalFlats, req.user._id);

    res.status(201).json(formatResponse({
      message: `${createdFlats.length} flats created successfully`,
      data: { count: createdFlats.length, building: buildingId }
    }));
  } catch (err) {
    next(err);
  }
};

exports.assignFlatOwner = async (req, res, next) => {
  try {
    const { ownerId } = req.body;
    const flat = await FlatService.assignOwnerToFlat(req.params.flatId, ownerId);

    res.json(formatResponse({
      message: 'Owner assigned successfully',
      data: flat
    }));
  } catch (err) {
    next(err);
  }
};

exports.removeFlatOwner = async (req, res, next) => {
  try {
    const flat = await FlatService.removeOwnerFromFlat(req.params.flatId);

    res.json(formatResponse({
      message: 'Owner removed successfully',
      data: flat
    }));
  } catch (err) {
    next(err);
  }
};

exports.removeFlatTenant = async (req, res, next) => {
  try {
    const flat = await FlatService.removeTenantFromFlat(req.params.flatId, req.user._id);

    res.json(formatResponse({
      message: 'Tenant removed successfully',
      data: flat
    }));
  } catch (err) {
    next(err);
  }
};

// === USER MANAGEMENT ===

exports.getAllUsers = async (req, res, next) => {
  try {
    const filters = {
      role: req.query.role,
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
      society: req.query.society
    };

    const result = await UserService.getAllUsers(filters, req.pagination);

    res.json(formatResponse({
      message: 'Users retrieved successfully',
      data: result.users,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.pages
      }
    }));
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);

    res.json(formatResponse({
      message: 'User details retrieved successfully',
      data: user
    }));
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);

    res.json(formatResponse({
      message: 'User updated successfully',
      data: user
    }));
  } catch (err) {
    next(err);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await UserService.toggleUserStatus(req.params.id);

    res.json(formatResponse({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    }));
  } catch (err) {
    next(err);
  }
};

// === RENT MANAGEMENT ===

exports.generateRent = async (req, res, next) => {
  try {
    const { billingMonth, societyId } = req.body;
    const result = await RentService.generateRentForMonth(billingMonth, societyId);

    res.status(201).json(formatResponse({
      message: result.message,
      data: result
    }));
  } catch (err) {
    next(err);
  }
};

exports.getRentHistory = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      society: req.query.society,
      flat: req.query.flat,
      tenant: req.query.tenant,
      owner: req.query.owner
    };

    const result = await RentService.getRentHistory(filters, req.pagination);

    res.json(formatResponse({
      message: 'Rent history retrieved successfully',
      data: result.rents,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.pages
      }
    }));
  } catch (err) {
    next(err);
  }
};

// === MAINTENANCE ===

exports.generateMaintenance = async (req, res, next) => {
  try {
    const { societyId, billingMonth } = req.body;
    const society = await Society.findById(societyId);
    if (!society) return res.status(404).json(formatResponse({ success: false, message: 'Society not found', statusCode: 404 }));

    const flats = await Flat.find({ society: societyId });
    const amount = society.maintenancePolicy.amountPerFlat;

    const records = await Maintenance.insertMany(flats.map(flat => ({
      flat: flat._id,
      building: flat.building,
      society: flat.society,
      billingMonth,
      amount,
      generatedBy: req.user._id,
    })));

    res.status(201).json(formatResponse({ message: 'Maintenance generated', data: records }));
  } catch (err) {
    next(err);
  }
};

exports.getMaintenanceStatus = async (req, res, next) => {
  try {
    const { filterBy, id } = req.query;
    const { page, limit, skip } = req.pagination || { page: 1, limit: 10, skip: 0 };
    let query = {};

    if (filterBy === 'society') query.society = id;
    else if (filterBy === 'flat') query.flat = id;
    else if (filterBy === 'user') {
      const flats = await Flat.find({ $or: [{ owner: id }, { tenant: id }] }, '_id');
      query.flat = { $in: flats.map(f => f._id) };
    }

    const [records, total] = await Promise.all([
      Maintenance.find(query).populate('flat building').skip(skip).limit(limit),
      Maintenance.countDocuments(query)
    ]);

    res.json(formatResponse({
      message: 'Maintenance records retrieved',
      data: records,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    }));
  } catch (err) {
    next(err);
  }
};

// === OWNERSHIP REQUESTS ===

exports.getOwnershipRequests = async (req, res, next) => {
  try {
    const requests = await OwnershipRequest.find({ status: 'pending' }).populate('flat currentOwner');
    res.json(formatResponse({ message: 'Ownership requests fetched', data: requests }));
  } catch (err) {
    next(err);
  }
};

const { reviewOwnershipRequest } = require('../services/ownershipService');

exports.reviewOwnershipRequest = async (req, res, next) => {
  try {
    const { requestId, status, note } = req.body;
    const result = await reviewOwnershipRequest({
      requestId,
      status,
      note,
      reviewerId: req.user._id
    });

    res.json(formatResponse({
      message: 'Request reviewed',
      data: result
    }));
  } catch (err) {
    next(err);
  }
};

// === COMPLAINTS ===

exports.getComplaints = async (req, res, next) => {
  try {
    const complaints = await getAllComplaints();
    res.json(formatResponse({
      message: 'All complaints retrieved',
      data: complaints
    }));
  } catch (err) {
    next(err);
  }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { complaintId, status, adminNote } = req.body;
    const complaint = await updateComplaintStatus({
      complaintId,
      status,
      adminNote,
      resolvedBy: req.user._id
    });

    res.json(formatResponse({
      message: 'Complaint updated',
      data: complaint
    }));
  } catch (err) {
    next(err);
  }
};

// === DASHBOARD ===

exports.getAdminDashboard = async (req, res, next) => {
  try {
    const dashboardData = await DashboardService.getAdminDashboard(req.user._id);

    res.json(formatResponse({
      message: 'Admin dashboard data retrieved successfully',
      data: dashboardData
    }));
  } catch (err) {
    next(err);
  }
};

// === NOTES & REMINDERS ===

exports.addSocietyNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const society = await SocietyService.addSocietyNote(req.params.id, note, req.user._id);

    res.json(formatResponse({
      message: 'Note added to society successfully',
      data: society
    }));
  } catch (err) {
    next(err);
  }
};

exports.sendReminderToUser = async (req, res, next) => {
  try {
    const { userId, subject, message } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json(formatResponse({ success: false, message: 'User not found', statusCode: 404 }));

    await sendEmail(user.email, subject, message);
    res.json(formatResponse({ message: 'Reminder sent' }));
  } catch (err) {
    next(err);
  }
};

// Get full flat info (owner, tenant, society, building)
exports.getFlatInfo = async (req, res, next) => {
  try {
    const flat = await FlatService.getFlatById(req.params.flatId);

    res.json(formatResponse({
      message: 'Flat details retrieved successfully',
      data: flat
    }));
  } catch (err) {
    next(err);
  }
};

