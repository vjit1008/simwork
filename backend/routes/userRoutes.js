const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

// ✅ Check these function names match exactly what's exported above
router.get('/me',  protect, getProfile);
router.put('/me',  protect, updateProfile);

module.exports = router;