const mongoose = require('mongoose');

const feedbackItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  score: { type: Number, min: 0, max: 10 },
  feedback: { type: String },
  improvement: { type: String }
}, { _id: false });

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  role: { type: String, default: 'Software Developer' },
  questions: [{ type: String }],
  answers: [{ type: String }],
  feedback: [feedbackItemSchema],
  totalScore: { type: Number, min: 0, max: 10, default: 0 },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);