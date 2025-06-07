const express = require('express');
const router = express.Router();
const { createSociety } = require('../controllers/societyController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, authorizeRoles('admin'), createSociety);

module.exports = router;
