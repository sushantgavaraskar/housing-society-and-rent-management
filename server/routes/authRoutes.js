// routes/authRoutes.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const  protect  = require('../middleware/authMiddleware');

const  validate  = require('../middleware/validate');
const { registerValidator, loginValidator } = require('../validators/authValidator');
// Public Routes
router.post('/register', registerValidator, validate, authController.registerUser);
router.post('/login', loginValidator, validate, authController.loginUser);
// router.get('/token-status', authController.tokenStatus);

// Protected Routes
router.post('/logout', protect, authController.logoutUser);
router.get('/me', protect, authController.getMe);
router.patch('/change-password', protect, authController.changePassword);
router.patch('/profile', protect, authController.updateProfile);

module.exports = router;
