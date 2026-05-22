const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/userController');

router.get('/me',    protect, getProfile);
router.put('/me',    protect, updateProfile);
router.delete('/me', protect, deleteAccount); // ✅ NEW

module.exports = router;