const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getChannels, getChannel, createChannel,
  postMessage, editMessage, deleteMessage,
  reactToMessage, updateTyping,
} = require('../controllers/channelController');

router.get('/',                              protect, getChannels);
router.get('/:id',                           protect, getChannel);
router.post('/',                             protect, createChannel);

router.post('/:id/message',                  protect, postMessage);
router.put('/:id/message/:msgId',            protect, editMessage);
router.delete('/:id/message/:msgId',         protect, deleteMessage);
router.post('/:id/message/:msgId/react',     protect, reactToMessage);
router.post('/:id/typing',                   protect, updateTyping);

module.exports = router;