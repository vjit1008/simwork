const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  stage: { type: String, required: true },
  points: { type: Number, default: 10 },
  awardedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Credit', creditSchema);