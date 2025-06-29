const Announcement = require('../models/Announcement');
const Flat = require('../models/Flat');
const formatResponse = require('../utils/responseFormatter');

// Create a new announcement
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, audience, society, building, validTill } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      audience,
      society,
      building: building || null,
      validTill: validTill || null,
      createdBy: req.user._id,
    });

    res.status(201).json(formatResponse({
      message: 'Announcement created',
      data: announcement
    }));
  } catch (err) {
    next(err);
  }
};

// Get announcements for logged-in user based on role and society/building
exports.getMyAnnouncements = async (req, res, next) => {
  try {
    const flat = await Flat.findOne({
      $or: [
        { tenant: req.user._id },
        { owner: req.user._id }
      ]
    });

    if (!flat) {
      return res.status(404).json(formatResponse({
        success: false,
        message: 'No assigned flat found',
        statusCode: 404
      }));
    }

    const announcements = await Announcement.find({
      society: flat.society,
      $or: [
        { audience: 'all' },
        { audience: req.user.role },
        { building: null },
        { building: flat.building }
      ],
      $or: [
        { validTill: null },
        { validTill: { $gte: new Date() } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(formatResponse({
      message: 'Relevant announcements retrieved',
      data: announcements
    }));
  } catch (err) {
    next(err);
  }
};

// Get all announcements (admin use)
exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const { page, limit, skip } = require('../utils/pagination').paginateQuery(req);
    const [announcements, total] = await Promise.all([
      Announcement.find().populate('createdBy society building').skip(skip).limit(limit),
      Announcement.countDocuments()
    ]);

    res.status(200).json(formatResponse({
      message: 'All announcements retrieved',
      data: announcements,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    }));
  } catch (err) {
    next(err);
  }
};
