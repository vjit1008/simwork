const jwt  = require('jsonwebtoken');
const User = require('../models/User');
const crypto    = require('crypto');
const nodemailer = require('nodemailer');
const User      = require('../models/User');

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
// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate token
    const token   = crypto.randomBytes(32).toString('hex');
    const hashed  = crypto.createHash('sha256').update(token).digest('hex');

    user.resetPasswordToken  = hashed;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use an App Password, not your real password
      },
    });

    await transporter.sendMail({
      from:    `"SimWork" <${process.env.EMAIL_USER}>`,
      to:      user.email,
      subject: 'Reset your SimWork password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#7C6EFA">Reset your password</h2>
          <p>Click the button below to reset your password. This link expires in <b>30 minutes</b>.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;background:#7C6EFA;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">
            Reset Password
          </a>
          <p style="color:#888;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken:  hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired.' });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Hash password the same way your register does (bcrypt)
    const bcrypt = require('bcryptjs');
    user.password            = await bcrypt.hash(password, 10);
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { forgotPassword, resetPassword };

module.exports = { signup, login };