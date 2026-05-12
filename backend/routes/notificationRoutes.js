const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getNotifications, markRead } = require('../controllers/notificationController');

router.get('/', protect, getNotifications);
router.post('/mark-read', protect, markRead);

module.exports = router;
