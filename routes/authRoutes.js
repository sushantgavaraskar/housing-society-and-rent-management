const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');
const {registerValidation, loginValidation} = require('../validations/userValidation')


router.post('/register', registerValidation, authController.registerUser);
router.post('/login', loginValidation, authController.loginUser);

// Protected Routes
router.post('/logout', authMiddleware, authController.logoutUser);
router.get('/me', authMiddleware, authController.getMe);
router.put('/change-password', authMiddleware, authController.changePassword);
router.get('/token-status', authMiddleware, authController.tokenStatus);
module.exports = router;
