const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: { type: String },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  department: { type: String, default: 'general' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Channel', channelSchema);