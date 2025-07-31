const Announcement = require('../models/Announcement');
const Flat = require('../models/Flat');
const Society = require('../models/Society');
const formatResponse = require('../utils/responseFormatter');

// Create a new announcement (Admin only)
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, societyId, priority = 'medium' } = req.body;

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'Society not found',
        statusCode: 404
      }));
    }

    const announcement = await Announcement.create({
      title,
      content,
      society: societyId,
      priority,
      createdBy: req.user._id,
    });

    res.status(201).json(formatResponse({
      message: 'Announcement created successfully',
      data: announcement
    }));
  } catch (err) {
    next(err);
  }
};

// Get all announcements (Admin only)
exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const { page, limit, skip } = req.pagination || { page: 1, limit: 10, skip: 0 };
    const { society, priority } = req.query;

    const filter = {};
    if (society) filter.society = society;
    if (priority) filter.priority = priority;

    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .populate('createdBy', 'name email')
        .populate('society', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Announcement.countDocuments(filter)
    ]);

    res.json(formatResponse({
      message: 'Announcements retrieved successfully',
      data: announcements,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (err) {
    next(err);
  }
};

// Get relevant announcements for the logged-in user (Owner/Tenant)
exports.getRelevantAnnouncements = async (req, res, next) => {
  try {
    const { priority, page = 1, limit = 10 } = req.query;
    
    const flat = await Flat.findOne({
      $or: [
        { owner: req.user._id },
        { tenant: req.user._id }
      ]
    });

    if (!flat) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'No assigned flat found',
        statusCode: 404
      }));
    }

    const filter = { society: flat.society };
    if (priority) filter.priority = priority;

    const skip = (page - 1) * limit;
    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .populate('society', 'name')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Announcement.countDocuments(filter)
    ]);

    res.json(formatResponse({
      message: 'Relevant announcements retrieved successfully',
      data: announcements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (err) {
    next(err);
  }
};

// Update announcement (Admin only)
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'Announcement not found',
        statusCode: 404
      }));
    }

    res.json(formatResponse({
      message: 'Announcement updated successfully',
      data: announcement
    }));
  } catch (err) {
    next(err);
  }
};

// Delete announcement (Admin only)
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndDelete(id);
    
    if (!announcement) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'Announcement not found',
        statusCode: 404
      }));
    }

    res.json(formatResponse({
      message: 'Announcement deleted successfully'
    }));
  } catch (err) {
    next(err);
  }
}; 