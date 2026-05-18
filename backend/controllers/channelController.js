const Channel = require('../models/Channel');
const User    = require('../models/User');

/* ─────────────────────────────────────────────
   GET all channels
───────────────────────────────────────────── */
const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find().select('-messages').sort({ createdAt: 1 });
    res.json({ success: true, channels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────
   GET single channel with messages
───────────────────────────────────────────── */
const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('messages.sender', 'name');
    if (!channel) return res.status(404).json({ success: false, message: 'Not found.' });

    /* auto-clear stale typing users (> 5 s) */
    const before = channel.typingUsers.length;
    channel.typingUsers = channel.typingUsers.filter(
      t => Date.now() - new Date(t.updatedAt).getTime() < 5000
    );
    if (channel.typingUsers.length !== before) await channel.save();

    res.json({ success: true, channel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────
   POST create channel
───────────────────────────────────────────── */
const createChannel = async (req, res) => {
  try {
    const { name, projectId, department, isPrivate } = req.body;
    if (!name?.trim())
      return res.status(400).json({ success: false, message: 'Channel name required.' });

    const existing = await Channel.findOne({ name: name.trim().toLowerCase() });
    if (existing)
      return res.status(400).json({ success: false, message: 'Channel already exists.' });

    const allUsers = await User.find({}).select('_id').lean();
    const memberIds = allUsers.map(u => u._id);

    const channel = await Channel.create({
      name:       name.trim().toLowerCase(),
      projectId:  projectId  || null,
      department: department || 'general',
      isPrivate:  isPrivate  || false,
      members:    memberIds,
    });

    res.status(201).json({ success: true, channel });
  } catch (err) {
    console.error('❌ createChannel error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────
   POST send message
───────────────────────────────────────────── */
const postMessage = async (req, res) => {
  try {
    const { text, replyTo } = req.body;
    if (!text?.trim())
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });

    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ success: false, message: 'Channel not found.' });

    const isMember = channel.members.some(m => m.toString() === req.user._id.toString());
    if (!isMember) channel.members.push(req.user._id);

    channel.messages.push({
      sender:     req.user._id,
      senderName: req.user.name,
      text:       text.trim(),
      createdAt:  new Date(),
      replyTo:    replyTo?.text ? { text: replyTo.text, senderName: replyTo.senderName } : undefined,
    });

    await channel.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────
   PUT edit message
───────────────────────────────────────────── */
const editMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim())
      return res.status(400).json({ success: false, message: 'Text required.' });

    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ success: false, message: 'Channel not found.' });

    const message = channel.messages.id(req.params.msgId);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found.' });
    if (message.senderName !== req.user.name)
      return res.status(403).json({ success: false, message: 'Not authorised.' });

    message.text   = text.trim();
    message.edited = true;
    await channel.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────
   DELETE soft-delete message
───────────────────────────────────────────── */
const deleteMessage = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ success: false, message: 'Channel not found.' });

    const message = channel.messages.id(req.params.msgId);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found.' });
    if (message.senderName !== req.user.name)
      return res.status(403).json({ success: false, message: 'Not authorised.' });

    message.deleted = true;
    message.text    = 'This message was deleted.';
    await channel.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────
   POST toggle emoji reaction
───────────────────────────────────────────── */
const reactToMessage = async (req, res) => {
  try {
    const { emoji } = req.body;
    if (!emoji) return res.status(400).json({ success: false, message: 'Emoji required.' });

    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ success: false, message: 'Channel not found.' });

    const message = channel.messages.id(req.params.msgId);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found.' });

    const userName = req.user.name;
    const existing = message.reactions.find(r => r.emoji === emoji);

    if (existing) {
      if (existing.users.includes(userName)) {
        existing.users = existing.users.filter(u => u !== userName);
        if (existing.users.length === 0)
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
      } else {
        existing.users.push(userName);
      }
    } else {
      message.reactions.push({ emoji, users: [userName] });
    }

    await channel.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────
   POST update typing status
───────────────────────────────────────────── */
const updateTyping = async (req, res) => {
  try {
    const { isTyping } = req.body;
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ success: false });

    const name = req.user.name;
    channel.typingUsers = channel.typingUsers.filter(t => t.name !== name);
    if (isTyping) channel.typingUsers.push({ name, updatedAt: new Date() });

    await channel.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getChannels, getChannel, createChannel,
  postMessage, editMessage, deleteMessage,
  reactToMessage, updateTyping,
};