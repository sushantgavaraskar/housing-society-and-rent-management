// routes/announcementRoutes.js

const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protected routes for admin
router.post('/', authMiddleware, roleMiddleware(['admin']), announcementController.createAnnouncement);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), announcementController.deleteAnnouncement);

// Public route to fetch announcements for a society (optionally filter by building)
router.get('/:societyId', authMiddleware, announcementController.getAnnouncements);

module.exports = router;
