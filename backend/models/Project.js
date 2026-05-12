const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'review', 'completed'],
    default: 'pending',
  },
  currentTask: { type: String, default: '' },
  completedAt: { type: Date },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [String],
  type: {
    type: String,
    enum: ['web', 'app', 'data', 'design', 'other'],
    default: 'web',
  },
  departments: [departmentSchema],
  currentDeptIndex: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['open', 'active', 'completed', 'on-hold'],
    default: 'open',
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  repoUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);