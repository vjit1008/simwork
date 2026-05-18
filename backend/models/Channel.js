const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  emoji: { type: String },
  users: [{ type: String }],   // store senderNames for simplicity
}, { _id: false });

const messageSchema = new mongoose.Schema({
  sender:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: { type: String },
  text:       { type: String, required: true },
  createdAt:  { type: Date, default: Date.now },
  edited:     { type: Boolean, default: false },
  deleted:    { type: Boolean, default: false },
  replyTo: {
    text:       { type: String, default: null },
    senderName: { type: String, default: null },
  },
  reactions:  [reactionSchema],
});

const typingUserSchema = new mongoose.Schema({
  name:      { type: String },
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

const channelSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  projectId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  department: { type: String, default: 'general' },
  isPrivate:  { type: Boolean, default: false },
  members:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages:   [messageSchema],
  typingUsers:[typingUserSchema],
}, { timestamps: true });

module.exports = mongoose.model('Channel', channelSchema);