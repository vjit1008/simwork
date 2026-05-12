const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getChannels, getChannel, createChannel, postMessage } = require('../controllers/channelController');

router.get('/',              protect, getChannels);
router.get('/:id',           protect, getChannel);
router.post('/',             protect, createChannel);
router.post('/:id/message',  protect, postMessage);

module.exports = router;