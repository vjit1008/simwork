const mongoose = require('mongoose');

const workflowEventSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  fromDept: { type: String },
  toDept: { type: String },
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: {
    type: String,
    enum: ['push', 'pullback', 'approve', 'resolve'],
    required: true,
  },
  note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('WorkflowEvent', workflowEventSchema);