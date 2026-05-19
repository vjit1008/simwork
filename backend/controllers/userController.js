const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    // ✅ Whitelist every field that any part of the app may update
    const ALLOWED = [
      'name', 'lname', 'city', 'role', 'skills',
      'college', 'degree', 'branch', 'gradyear',
      'notifications', 'privacy', 'avatarColor',
      'xp', 'certs', 'preferredLanguage',          // ← IDE fields
    ];

    // ✅ Build $set from only the keys that were actually sent
    const $set = {};
    for (const key of ALLOWED) {
      if (req.body[key] !== undefined) {
        $set[key] = req.body[key];
      }
    }

    if (Object.keys($set).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update.' });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set },
      { new: true, runValidators: false }   // ← false: don't validate unrelated required fields
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, user: updated });
  } catch (err) {
    console.error('❌ updateProfile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, updateProfile };