const express = require('express');
const router = express.Router();
const { register, login, getAllTenants } = require('../controllers/authController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/tenants', authenticateUser, authorizeRoles('owner', 'admin'), getAllTenants);

module.exports = router;
