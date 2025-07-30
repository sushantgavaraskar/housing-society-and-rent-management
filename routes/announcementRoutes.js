// routes/announcementRoutes.js

const express = require('express');
const router = express.Router();

const { createAnnouncement, getAllAnnouncements, getRelevantAnnouncements, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const { announcementCreateValidator, announcementUpdateValidator } = require('../validators/announcementValidator');

router.use(authMiddleware);

// POST /api/announcements/ - Create a new announcement (Admin only)
router.post('/', roleMiddleware('admin'), announcementCreateValidator, validate, createAnnouncement);

// GET /api/announcements/ - Get all announcements (Admin only)
router.get('/', roleMiddleware('admin'), getAllAnnouncements);

// GET /api/announcements/relevant - Get relevant announcements for user (Owner/Tenant)
router.get('/relevant', roleMiddleware(['owner', 'tenant']), getRelevantAnnouncements);

// PUT /api/announcements/:id - Update announcement (Admin only)
router.put('/:id', roleMiddleware('admin'), announcementUpdateValidator, validate, updateAnnouncement);

// DELETE /api/announcements/:id - Delete announcement (Admin only)
router.delete('/:id', roleMiddleware('admin'), deleteAnnouncement);

module.exports = router;
