const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const paginationMiddleware = require('../middleware/paginationMiddleware');

const validate = require('../middleware/validate');

const { societyCreateValidator, societyUpdateValidator, buildingCreateValidator, buildingUpdateValidator, flatCreateValidator, flatAssignOwnerValidator, complaintStatusUpdateValidator, ownershipRequestReviewValidator, reminderValidator, societyNoteValidator, complaintsQueryValidator, userUpdateValidator } = require('../validators/adminValidator');

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// === SOCIETY MANAGEMENT ===
router.post('/societies', societyCreateValidator, validate, adminController.createSociety);
router.get('/societies/my', paginationMiddleware, adminController.getMySocieties);
router.put('/societies/:id', societyUpdateValidator, validate, adminController.updateSociety);
router.delete('/societies/:id', adminController.deleteSociety);

// === BUILDING MANAGEMENT ===
router.post('/buildings', buildingCreateValidator, validate, adminController.createBuilding);
router.put('/buildings/:id', buildingUpdateValidator, validate, adminController.updateBuilding);
router.delete('/buildings/:id', adminController.deleteBuilding);

// === FLAT MANAGEMENT ===
router.post('/flats', flatCreateValidator, validate, adminController.createFlats);
router.patch('/flats/:flatId/assign-owner', flatAssignOwnerValidator, validate, adminController.assignFlatOwner);
router.patch('/flats/:flatId/remove-owner', adminController.removeFlatOwner);
router.patch('/flats/:flatId/remove-tenant', adminController.removeFlatTenant);

// === USER MANAGEMENT ===
router.get('/users', paginationMiddleware, adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id', userUpdateValidator, validate, adminController.updateUser);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);

// === RENT MANAGEMENT ===
router.post('/rent/generate', adminController.generateRent);
router.get('/rent/history', paginationMiddleware, adminController.getRentHistory);

// === MAINTENANCE ===
router.post('/maintenance', adminController.generateMaintenance);
router.get('/maintenance/status', paginationMiddleware, adminController.getMaintenanceStatus);

// === OWNERSHIP REQUESTS ===
router.get('/ownership-requests', adminController.getOwnershipRequests);
router.patch('/ownership-requests/:id', ownershipRequestReviewValidator, validate, adminController.reviewOwnershipRequest);

// === COMPLAINTS ===
router.get('/complaints', complaintsQueryValidator, validate, adminController.getComplaints);
router.patch('/complaints/:id', complaintStatusUpdateValidator, validate, adminController.updateComplaintStatus);

// === DASHBOARD & DOCUMENTS ===
router.get('/dashboard/overview', adminController.getAdminDashboard);
router.get('/flats/:flatId/info', adminController.getFlatInfo);

// === NOTES & REMINDERS ===
router.patch('/societies/:id/note', societyNoteValidator, validate, adminController.addSocietyNote);
router.post('/users/:userID/reminder', reminderValidator, validate, adminController.sendReminderToUser);

module.exports = router;
