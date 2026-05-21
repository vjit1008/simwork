const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
});

// ─────────────────────────────────────────────
// POST /api/auth/signup
// ─────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Please provide name, email and password.' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing)
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });

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
    if (err.name === 'ValidationError')
      return res.status(400).json({ success: false, message: Object.values(err.errors).map(e => e.message).join('. ') });
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    return res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
};

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      console.log(`⚠️  Login attempt for unknown email: ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`⚠️  Wrong password for: ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
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

// ─────────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Don't reveal whether email exists — always return same message
    if (!user) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate token
    const token  = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    user.resetPasswordToken  = hashed;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 min
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send via Resend using verified simworkapp.com domain
    const { error } = await resend.emails.send({
      from:    'SimWork <noreply@simworkapp.com>',
      to:      user.email,
      subject: 'Reset your SimWork password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;background:#0f1117;border-radius:12px;border:1px solid #1e2433">
          <div style="margin-bottom:24px">
            <span style="font-size:22px;font-weight:800;color:#7C6EFA">SimWork</span>
          </div>
          <h2 style="color:#e2e8f0;font-size:20px;margin:0 0 12px">Reset your password</h2>
          <p style="color:#94a3b8;margin:0 0 24px;line-height:1.6">
            We received a request to reset your password. Click the button below — 
            this link expires in <b style="color:#e2e8f0">30 minutes</b>.
          </p>
          <a href="${resetUrl}"
            style="display:inline-block;padding:13px 30px;background:#7C6EFA;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;margin-bottom:28px">
            Reset Password →
          </a>
          <p style="color:#475569;font-size:12px;margin:0 0 6px">
            Or copy this link into your browser:
          </p>
          <p style="color:#7C6EFA;font-size:12px;word-break:break-all;margin:0 0 24px">
            ${resetUrl}
          </p>
          <hr style="border:none;border-top:1px solid #1e2433;margin:0 0 20px"/>
          <p style="color:#475569;font-size:12px;margin:0">
            If you didn't request a password reset, you can safely ignore this email. 
            Your password will not be changed.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return res.status(500).json({ success: false, message: 'Failed to send reset email. Please try again.' });
    }

    console.log(`✅ Password reset email sent to ${user.email}`);
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

  } catch (err) {
    console.error('❌ forgotPassword error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
};

// ─────────────────────────────────────────────
// POST /api/auth/reset-password/:token
// ─────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken:  hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired.' });

    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    user.password            = await bcrypt.hash(password, 10);
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log(`✅ Password reset successful for ${user.email}`);
    return res.json({ success: true, message: 'Password reset successful. You can now log in.' });

  } catch (err) {
    console.error('❌ resetPassword error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { signup, login, forgotPassword, resetPassword };