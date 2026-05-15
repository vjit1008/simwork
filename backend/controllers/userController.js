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
    const {
      name, city, role, skills,
      college, degree, branch, gradyear,
      notifications, privacy, avatarColor,
    } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        name, city, role, skills,
        college, degree, branch, gradyear,
        notifications, privacy, avatarColor,
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, updateProfile };