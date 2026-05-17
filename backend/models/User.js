const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  lname:       { type: String, trim: true, default: '' },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true,
                 match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
  password:    { type: String, required: true, minlength: 6, select: false },
  city:        { type: String, trim: true, default: '' },
  role:        { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' }, // ✅ only once
  college:     { type: String, default: '' },
  degree:      { type: String, default: '' },
  branch:      { type: String, default: '' },
  gradyear:    { type: String, default: '' },
  skills:      [{ type: String }],   // ✅ only once
  avatarColor: { type: String, default: '#7C6EFA' },
  xp:          { type: Number, default: 0 },  // ✅ only once
  certs:       [{ type: mongoose.Schema.Types.Mixed }],

  // ✅ reset token fields at TOP LEVEL (not inside notifications)
  resetPasswordToken:  { type: String },
  resetPasswordExpire: { type: Date },

  notifications: {
    email:   { type: Boolean, default: true },
    browser: { type: Boolean, default: true },
    weekly:  { type: Boolean, default: true },
  },

  privacy: {
    publicProfile:     { type: Boolean, default: true },
    showEducation:     { type: Boolean, default: true },
    showOnLeaderboard: { type: Boolean, default: true },
  },

}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);