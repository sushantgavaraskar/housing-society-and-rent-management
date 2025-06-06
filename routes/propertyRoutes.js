const express = require('express');
const { createProperty, getProperties, rentProperty, getMyProperties } = require('../controllers/propertyController');


const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/', protect, createProperty);
router.get('/', getProperties);
router.put('/:id/rent', protect, rentProperty);
router.get('/my', protect, getMyProperties);



module.exports = router;
