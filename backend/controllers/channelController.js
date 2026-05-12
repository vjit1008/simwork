const Channel = require('../models/Channel');

const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({
      members: req.user._id,
    }).select('-messages');
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
    const { name, projectId, department, members } = req.body;
    const channel = await Channel.create({
      name, projectId, department,
      members: [...new Set([...members, req.user._id.toString()])],
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

    const msg = { sender: req.user._id, senderName: req.user.name, text };
    channel.messages.push(msg);
    await channel.save();

    res.status(201).json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getChannels, getChannel, createChannel, postMessage };