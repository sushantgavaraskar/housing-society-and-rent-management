const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin-only routes
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Core society & building management
router.get('/societies', adminController.getMySocieties);
router.post('/buildings', adminController.createBuilding);
router.delete('/buildings/:id', adminController.deleteBuilding);

// Flat management
router.patch('/flats/:flatId/assign-owner', adminController.assignFlatOwner);
router.patch('/flats/:flatId/remove-owner', adminController.removeFlatOwner);
router.patch('/flats/:flatId/assign-tenant', adminController.assignFlatTenant);
router.patch('/flats/:flatId/remove-tenant', adminController.removeFlatTenant);

// Maintenance
router.post('/maintenance', adminController.generateMaintenance);
router.get('/maintenance/status', adminController.getMaintenanceStatus);

// Rent
router.get('/rent/history', adminController.getRentHistory);

// Ownership requests
router.get('/ownership-requests', adminController.getOwnershipRequests);
router.post('/ownership-requests/review', adminController.reviewOwnershipRequest);

// Announcements
router.post('/announcements', adminController.createAnnouncement);

// Complaints
router.get('/complaints', adminController.getComplaints);
router.patch('/complaints', adminController.updateComplaintStatus);

// Dashboard & documents
router.get('/dashboard/overview', adminController.getAdminDashboard);
router.get('/documents', adminController.getAllAgreements);

// Notes & reminders
router.post('/societies/:id/note', adminController.addSocietyNote);
router.post('/reminders', adminController.sendReminderToUser);

module.exports = router;
