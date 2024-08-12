// src/routes/authRoutes.js
const express = require('express');
const { register,activateAccount,login  } = require('../controllers/authController');
const verifyOtpController = require('../controllers/verifyOtpController');

const router = express.Router();

router.post('/register', register);
router.get('/activate/:token', activateAccount);
router.post('/verify-otp', verifyOtpController);
router.post('/login', login);

module.exports = router;
