const Channel = require('../models/Channel');
const User = require('../models/User');

// GET all channels — every user sees every channel
const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .select('-messages')
      .sort({ createdAt: 1 });
    res.json({ success: true, channels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single channel with messages
const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('messages.sender', 'name');
    if (!channel) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, channel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createChannel = async (req, res) => {
  try {
    const { name, projectId, department } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'Channel name required.' });
    }

    // Prevent duplicate
    const existing = await Channel.findOne({ name: name.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Channel already exists.' });
    }

    // ✅ Safe way to get all user IDs
    const allUsers = await User.find({}).select('_id').lean();
    const memberIds = Array.isArray(allUsers) ? allUsers.map(u => u._id) : [];

    const channel = await Channel.create({
      name:       name.trim().toLowerCase(),
      projectId:  projectId  || null,
      department: department || 'general',
      members:    memberIds,
    });

    res.status(201).json({ success: true, channel });
  } catch (err) {
    console.error('❌ createChannel error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST send message
const postMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ success: false, message: 'Channel not found.' });

    // Auto-join if not already a member
    const isMember = channel.members.some(
      m => m.toString() === req.user._id.toString()
    );
    if (!isMember) channel.members.push(req.user._id);

    channel.messages.push({
      sender:     req.user._id,
      senderName: req.user.name,
      text:       text.trim(),
      createdAt:  new Date(),
    });

    await channel.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getChannels, getChannel, createChannel, postMessage };