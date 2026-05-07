const User = require('../models/User');

// GET /api/user/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/user/me
const updateMe = async (req, res) => {
  try {
    const allowed = ['name','lname','city','role','college','degree',
                     'branch','gradyear','skills','avatarColor',
                     'xp','certs','notifications','privacy'];

    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Prevent email/password change via this route
    delete updates.email;
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getMe, updateMe };