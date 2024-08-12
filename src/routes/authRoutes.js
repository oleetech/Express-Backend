// src/routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const { register,activateAccount,login,googleLogin,googleCallback  } = require('../controllers/authController');
const verifyOtpController = require('../controllers/verifyOtpController');

const router = express.Router();

router.post('/register', register);
router.get('/activate/:token', activateAccount);
router.post('/verify-otp', verifyOtpController);
router.post('/login', login);
// Route to initiate Google OAuth login
router.get('/google', googleLogin);

// Route to handle Google OAuth callback
router.get('/google/callback', googleCallback);

module.exports = router;
