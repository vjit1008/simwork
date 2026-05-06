const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type:      String,
    required:  [true, 'Name is required'],
    trim:      true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type:      String,
    required:  [true, 'Email is required'],
    unique:    true,
    lowercase: true,   // Atlas stores it lowercase
    trim:      true,
    // ✅ Basic email format validation
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type:      String,
    required:  [true, 'Password is required'],
    minlength: 6,
    select:    false,  // Never returned in queries unless explicitly .select('+password')
  },
}, { timestamps: true });

// ✅ FIX: original hook was missing next() — on some Mongoose versions this
//    causes the save to hang silently, so the document never actually writes
//    to Atlas even though no error is thrown.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);