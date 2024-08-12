const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppDataSource = require('../config/database');
const User = require('../entities/User');
const passport = require('passport');
const {
    checkIfUserExists, 
    hashPassword, 
    createNewUser, 
    saveUser, 
    handlePhoneRegistration, 
    handleEmailRegistration, 
    generateToken, 
    phoneLogin, 
    emailLogin, 
    usernameLogin,
    verifyToken,
    findUserById,
    activateUserAccount,
    handleGoogleCallback 
} = require('./authHelpers');

// Register a new user
const register = async (req, res) => {
    const { username, email, password, phone } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    try {
        // Check if user already exists
        const existingUser = await checkIfUserExists(userRepository, username, email, phone);
        if (existingUser) {
            return res.status(400).json({ message: 'ব্যবহারকারী ইতোমধ্যে নিবন্ধিত' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user instance
        const newUser = createNewUser(userRepository, username, email, hashedPassword, phone);

        // Save the new user
        await saveUser(userRepository, newUser);

        let response;
        if (email) {
            response = await handleEmailRegistration(userRepository, newUser);
        } else if (phone) {
            response = await handlePhoneRegistration(userRepository, newUser, phone);
        } else {
            // Default activation
            newUser.isActivated = true;
            await saveUser(userRepository, newUser);
            response = { success: true, message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত। প্রয়োজনীয় যাচাই সম্পন্ন করুন।' };
        }

        if (response.success) {
            return res.status(201).json({ message: response.message });
        } else {
            return res.status(500).json({ message: response.message, error: response.error });
        }
    } catch (err) {
        return res.status(500).json({ message: 'ব্যবহারকারী নিবন্ধন করতে ত্রুটি', error: err.message });
    }
};







// Login
const login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);

        // Regular expressions for phone and email validation
        const phoneRegex = /^\+?\d{10,15}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (phoneRegex.test(identifier)) {
            await phoneLogin(identifier, userRepository, res);
        } else if (emailRegex.test(identifier)) {
            await emailLogin(identifier, password, userRepository, res);
        } else {
            await usernameLogin(identifier, password, userRepository, res);
        }
    } catch (err) {
        console.error("Error logging in user:", err);
        res.status(500).send('Error logging in user.');
    }
};

const activateAccount = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = await verifyToken(token);
        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(400).json({ message: 'Invalid activation link' });
        }

        await activateUserAccount(user);
        res.status(200).json({ message: 'Account activated successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired activation link', error: err.message });
    }
};

// Initiate Google OAuth Login
const googleLogin = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};


// Handle Google OAuth Callback
const googleCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err, user, info) => {
        if (err) {
            console.error("Error during authentication:", err);
            return res.status(400).json({ message: 'Login failed', error: err.message });
        }

        if (!user) {
            console.error("No user found:", info);
            return res.status(400).json({ message: 'Login failed', error: info || 'No user found' });
        }

        // Log the user information
        console.log("Authenticated user:", user);

        // Use the handleGoogleCallback method to manage token generation and response
        await handleGoogleCallback(user, res);
    })(req, res, next);
};


// Export the functions
module.exports = {
    register,
    activateAccount,
    login,
    googleLogin,
    googleCallback
};
