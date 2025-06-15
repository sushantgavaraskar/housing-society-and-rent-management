const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin-only routes
router.use(authMiddleware);
router.use(roleMiddleware('admin'));
const validate = require('../middleware/validate');
const {
  societyCreateValidator,
} = require('../validators/societyValidator');
const {
  
  assignOwnerValidator,
} = require('../validators/flatValidator');

// Core society & building management
router.post('/societies', societyCreateValidator, validate, adminController.createSociety);

router.get('/societies/my', adminController.getMySocieties);
router.post('/buildings', adminController.createBuilding);
router.delete('/buildings/:id', adminController.deleteBuilding);

// Flat management
router.patch('/flats/:flatId/assign-owner', assignOwnerValidator, validate, adminController.assignOwnerToFlat);
router.patch('/flats/:flatId/remove-owner', adminController.removeFlatOwner);

router.patch('/flats/:flatId/remove-tenant', adminController.removeFlatTenant);

// Maintenance
router.post('/maintenance', adminController.generateMaintenance);
router.get('/maintenance/status', adminController.getMaintenanceStatus);

// Rent
router.get('/rent/history', adminController.getRentHistory);

// Ownership requests
router.get('/ownership-requests', adminController.getOwnershipRequests);
router.patch('/ownership-requests/:id', adminController.reviewOwnershipRequest);

// Announcements
router.post('/announcements', adminController.createAnnouncement);

// Complaints
router.get('/complaints', adminController.getComplaints);
router.patch('/complaints/:id', adminController.updateComplaintStatus);

// Dashboard & documents
router.get('/dashboard/overview', adminController.getAdminDashboard);
// router.get('/documents', adminController.getAllAgreements);
router.get('/flats/:flatId/info', adminController.getFlatInfo);

// Notes & reminders
router.patch('/societies/:id/note', adminController.addSocietyNote);
router.post('/users/:userID/reminder', adminController.sendReminderToUser);

module.exports = router;
