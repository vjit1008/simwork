const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getQuestions, submitInterview, getResult, getHistory } = require('../controllers/interviewController');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found.' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitInterview);
router.get('/result/:id', protect, getResult);
router.get('/history', protect, getHistory);

module.exports = router;