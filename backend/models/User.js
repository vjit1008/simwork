const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  lname:       { type: String, trim: true, default: '' },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true,
                 match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
  password:    { type: String, required: true, minlength: 6, select: false },
  city:        { type: String, trim: true, default: '' },
  role:        { type: String, default: 'Software Developer' },
  college:     { type: String, default: '' },
  degree:      { type: String, default: '' },
  branch:      { type: String, default: '' },
  gradyear:    { type: String, default: '' },
  skills:      [{ type: String }],
  avatarColor: { type: String, default: '#7C6EFA' },
  xp:          { type: Number, default: 0 },
  certs:       [{ type: mongoose.Schema.Types.Mixed }],
  notifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  privacy:       { type: mongoose.Schema.Types.Mixed, default: {} },

  role: {
  type: String,
  enum: ['student', 'mentor', 'admin'],
  default: 'student',
},
skills: [{ type: String }],
xp: { type: Number, default: 0 },
}, { timestamps: true });

// No next() — modern Mongoose handles async pre-save via returned Promise
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);