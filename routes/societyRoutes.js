const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createSociety, getMySocieties } = require('../controllers/societyController');

const router = express.Router();

router.post('/', protect, createSociety);
router.get('/my', protect, getMySocieties);

module.exports = router;
