const express = require('express');
const { signup, login } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/forgot-password',          forgotPassword);
router.post('/reset-password/:token',    resetPassword);
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;