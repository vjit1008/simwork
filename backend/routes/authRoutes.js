const express = require('express');
const router  = express.Router(); // ✅ defined FIRST

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController'); // ✅ single import

router.post('/signup',               signup);
router.post('/login',                login);
router.post('/forgot-password',      forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;