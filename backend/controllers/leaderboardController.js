const User = require('../models/User');

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ 'privacy.showOnLeaderboard': { $ne: false } })
      .select('name avatarColor xp role city')
      .sort({ xp: -1 })
      .limit(50);

    const board = users.map((u, i) => ({
      rank:        i + 1,
      id:          u._id,
      name:        u.name,
      avatarColor: u.avatarColor || '#7C6EFA',
      xp:          u.xp || 0,
      role:        u.role || '',
      city:        u.city || '',
      avatar:      u.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
    }));

    res.json({ success: true, leaderboard: board });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getLeaderboard };