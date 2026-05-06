const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
});

// ─────────────────────────────────────────────
// POST /api/auth/signup
// ─────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // ✅ Always normalise email to lowercase before any DB operation
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({ name: name.trim(), email: normalizedEmail, password });

    console.log(`✅ New user created: ${user.email} (${user._id})`);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error('❌ Signup error:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors).map(e => e.message).join('. '),
      });
    }

    // Mongo duplicate key (race condition safeguard)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    return res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
};

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // ✅ FIX: normalise email — without this, "User@Email.com" won't match
    //    "user@email.com" stored in Atlas even though schema has lowercase:true
    const normalizedEmail = email.toLowerCase().trim();

    // ✅ FIX: must explicitly select password because schema has select:false
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      console.log(`⚠️  Login attempt for unknown email: ${normalizedEmail}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`⚠️  Wrong password for: ${normalizedEmail}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    console.log(`✅ User logged in: ${user.email} (${user._id})`);

    return res.json({
      success: true,
      message: 'Login successful.',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

module.exports = { signup, login };