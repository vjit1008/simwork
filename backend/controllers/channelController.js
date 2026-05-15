const Channel = require('../models/Channel');

const getChannels = async (req, res) => {
  try {
    // ✅ ALL users see ALL channels — no filte
    const channels = await Channel.find()
      .select('-messages')
      .sort({ createdAt: 1 });
    res.json({ success: true, channels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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

    // ✅ Get all users to add to channel by default
    const User = require('../models/User');
    const allUsers = await User.find().select('_id');
    const allUserIds = allUsers.map(u => u._id);

    const channel = await Channel.create({
      name,
      projectId: projectId || null,
      department: department || 'general',
      members: allUserIds, // ✅ everyone is a member
    });

    res.status(201).json({ success: true, channel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const createChannel = async (req, res) => {
  try {
    const { name, projectId, department } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Channel name required.' });

    // ✅ Prevent duplicate channel names
    const existing = await Channel.findOne({ name: name.trim().toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: 'Channel already exists.' });

    const User = require('../models/User');
    const allUsers = await User.find().select('_id');

    const channel = await Channel.create({
      name: name.trim().toLowerCase(),
      projectId: projectId || null,
      department: department || 'general',
      members: allUsers.map(u => u._id),
    });

    res.status(201).json({ success: true, channel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const postMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ success: false, message: 'Not found.' });

    // ✅ Auto-join channel when posting
    if (!channel.members.includes(req.user._id)) {
      channel.members.push(req.user._id);
    }

    const msg = {
      sender:     req.user._id,
      senderName: req.user.name,
      text,
    };
    channel.messages.push(msg);
    await channel.save();

    res.status(201).json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getChannels, getChannel, createChannel, postMessage };