// controllers/announcementController.js

const Announcement = require('../models/Announcement');
const Society = require('../models/Society');

// Create a new announcement (Admin only)
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, society, building, audience, validTill } = req.body;

    const newAnnouncement = await Announcement.create({
      title,
      message,
      society,
      building: building || null,
      audience,
      validTill: validTill || null,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Announcement created successfully', data: newAnnouncement });
  } catch (err) {
    next(err);
  }
};

// Get all announcements for a society or building
exports.getAnnouncements = async (req, res, next) => {
  try {
    const { societyId } = req.params;
    const { buildingId } = req.query;

    const filter = { society: societyId };
    if (buildingId) filter.building = buildingId;

    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ count: announcements.length, announcements });
  } catch (err) {
    next(err);
  }
};

// Delete an announcement (Admin only)
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.deleteOne();
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    next(err);
  }
};
