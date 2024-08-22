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




/**
 * নতুন ব্যবহারকারী নিবন্ধন করার জন্য এই ফাংশনটি ব্যবহৃত হয়।
 * @function register
 * @description ইউজার ডিভাইস থেকে প্রাপ্ত প্যারামিটারগুলো (যেমন ইউজারনেম, ইমেইল, পাসওয়ার্ড, ফোন নম্বর) প্রক্রিয়া করে এবং নতুন ব্যবহারকারী তৈরি করে।
 * @param {object} req - রিকোয়েস্ট অবজেক্ট যা ব্যবহারকারীর ইনপুট ডেটা ধারণ করে।
 * @param {object} res - রেসপন্স অবজেক্ট যা ক্লায়েন্টকে রেসপন্স পাঠাতে ব্যবহৃত হয়।
 * @returns {Promise<void>} - ফাংশনটি একটি প্রমিস রিটার্ন করে যা রিকোয়েস্ট সম্পন্ন হওয়ার পর রেসপন্স প্রদান করে।
 */
const register = async (req, res) => {
    // রিকোয়েস্ট বডি থেকে প্যারামিটারগুলো গ্রহণ করা হচ্ছে
    const { username, email, password, phone } = req.body;

    // ইউজার রেপোজিটরি তৈরি করা হচ্ছে যা ডাটাবেজে ব্যবহারকারীর তথ্য পরিচালনা করবে
    const userRepository = AppDataSource.getRepository(User);

    try {
        // চেক করা হচ্ছে ব্যবহারকারী ইতোমধ্যে বিদ্যমান কিনা
        const existingUser = await checkIfUserExists(userRepository, username, email, phone);
        if (existingUser) {
            // যদি ব্যবহারকারী ইতোমধ্যে বিদ্যমান থাকে, তাহলে 400 স্টেটাস কোড এবং একটি মেসেজ পাঠানো হচ্ছে
            return res.status(400).json({ message: 'ব্যবহারকারী ইতোমধ্যে নিবন্ধিত' });
        }

        // পাসওয়ার্ড হ্যাশ করা হচ্ছে যাতে নিরাপত্তা নিশ্চিত করা যায়
        const hashedPassword = await hashPassword(password);

        // নতুন ব্যবহারকারী তৈরি করা হচ্ছে দেওয়া ইনপুট তথ্য ব্যবহার করে
        const newUser = createNewUser(userRepository, username, email, hashedPassword, phone);

        // নতুন ব্যবহারকারী ডাটাবেজে সংরক্ষণ করা হচ্ছে
        await saveUser(userRepository, newUser);

        let response;
        if (email) {
            // যদি ইমেইল প্রদান করা হয়, তাহলে ইমেইল দ্বারা নিবন্ধন পরিচালনা করা হচ্ছে
            response = await handleEmailRegistration(userRepository, newUser);
        } else if (phone) {
            // যদি ফোন নম্বর প্রদান করা হয়, তাহলে ফোন দ্বারা নিবন্ধন পরিচালনা করা হচ্ছে
            response = await handlePhoneRegistration(userRepository, newUser, phone);
        } else {
            // যদি না ইমেইল না ফোন প্রদান করা হয়, তাহলে ব্যবহারকারী সরাসরি সক্রিয় করা হচ্ছে
            newUser.isActivated = true;
            await saveUser(userRepository, newUser);
            response = { success: true, message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত। প্রয়োজনীয় যাচাই সম্পন্ন করুন।' };
        }

        // যদি নিবন্ধন সফল হয়, তাহলে 201 স্টেটাস কোড এবং সফলতার মেসেজ পাঠানো হচ্ছে
        if (response.success) {
            return res.status(201).json({ message: response.message });
        } else {
            // যদি কোন ত্রুটি ঘটে, তাহলে 500 স্টেটাস কোড এবং ত্রুটির মেসেজ পাঠানো হচ্ছে
            return res.status(500).json({ message: response.message, error: response.error });
        }
    } catch (err) {
        // যদি কোন অপ্রত্যাশিত ত্রুটি ঘটে, তাহলে 500 স্টেটাস কোড এবং ত্রুটির মেসেজ পাঠানো হচ্ছে
        return res.status(500).json({ message: 'ব্যবহারকারী নিবন্ধন করতে ত্রুটি', error: err.message });
    }
};









/**
 * @function login
 * @description ব্যবহারকারী লগইন পরিচালনার জন্য ফাংশনটি ব্যবহৃত হয়। ব্যবহারকারী ইনপুট হিসাবে identifier (যা হতে পারে ইউজারনেম, ইমেইল, বা ফোন নম্বর) এবং পাসওয়ার্ড গ্রহণ করা হয়।
 * @param {object} req - রিকোয়েস্ট অবজেক্ট যা ব্যবহারকারীর ইনপুট ডেটা ধারণ করে।
 * @param {object} res - রেসপন্স অবজেক্ট যা ক্লায়েন্টকে রেসপন্স পাঠাতে ব্যবহৃত হয়।
 * @returns {Promise<void>} - ফাংশনটি একটি প্রমিস রিটার্ন করে যা রিকোয়েস্ট সম্পন্ন হওয়ার পর রেসপন্স প্রদান করে।
 */
const login = async (req, res) => {
    // রিকোয়েস্ট বডি থেকে প্যারামিটারগুলো গ্রহণ করা হচ্ছে
    const { identifier, password } = req.body;

    try {
        // ইউজার রেপোজিটরি তৈরি করা হচ্ছে যা ডাটাবেজে ব্যবহারকারীর তথ্য পরিচালনা করবে
        const userRepository = AppDataSource.getRepository(User);

        // ফোন নম্বর এবং ইমেইল যাচাইয়ের জন্য রেগুলার এক্সপ্রেশন ডিফাইন করা হচ্ছে
        const phoneRegex = /^\+?\d{10,15}$/; // আন্তর্জাতিক ফরম্যাটে ফোন নম্বর যাচাই
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ইমেইল ফরম্যাট যাচাই

        // ব্যবহারকারীর ইনপুট অনুযায়ী লগইন পদ্ধতি নির্ধারণ করা হচ্ছে
        if (phoneRegex.test(identifier)) {
            // যদি ইনপুট ফোন নম্বর হয়, তাহলে ফোন লগইন মেথড কল করা হচ্ছে
            await phoneLogin(identifier, userRepository, res);
        } else if (emailRegex.test(identifier)) {
            // যদি ইনপুট ইমেইল হয়, তাহলে ইমেইল লগইন মেথড কল করা হচ্ছে
            await emailLogin(identifier, password, userRepository, res);
        } else {
            // যদি ইনপুট ইউজারনেম হয়, তাহলে ইউজারনেম লগইন মেথড কল করা হচ্ছে
            await usernameLogin(identifier, password, userRepository, res);
        }
    } catch (err) {
        // যদি কোন ত্রুটি ঘটে, তাহলে কনসোলে ত্রুটির বার্তা এবং রেসপন্স হিসাবে 500 স্টেটাস কোড পাঠানো হচ্ছে
        console.error("ব্যবহারকারী লগইন করতে ত্রুটি:", err);
        res.status(500).send('ব্যবহারকারী লগইন করতে ত্রুটি।');
    }
};


/**
 * @function activateAccount
 * @description ব্যবহারকারীর অ্যাকাউন্ট অ্যাক্টিভেশনের জন্য ফাংশনটি ব্যবহৃত হয়। অ্যাক্টিভেশন টোকেনের মাধ্যমে অ্যাকাউন্ট অ্যাক্টিভ করা হয়।
 * @param {object} req - রিকোয়েস্ট অবজেক্ট যা ক্লায়েন্ট থেকে প্রেরিত ডেটা ধারণ করে। এখানে প্যারামস থেকে অ্যাক্টিভেশন টোকেন গ্রহণ করা হয়।
 * @param {object} res - রেসপন্স অবজেক্ট যা ক্লায়েন্টকে রেসপন্স পাঠাতে ব্যবহৃত হয়।
 * @returns {Promise<void>} - ফাংশনটি একটি প্রমিস রিটার্ন করে যা রিকোয়েস্ট সম্পন্ন হওয়ার পর রেসপন্স প্রদান করে।
 */
const activateAccount = async (req, res) => {
    // রিকোয়েস্ট প্যারামস থেকে টোকেন গ্রহণ করা হচ্ছে
    const { token } = req.params;
    
    try {
        // টোকেন যাচাই করা হচ্ছে এবং এর মাধ্যমে ইউজার আইডি ডিকোড করা হচ্ছে
        const decoded = await verifyToken(token);
        
        // ডাটাবেজ থেকে ইউজার আইডি দ্বারা ব্যবহারকারী খুঁজে বের করা হচ্ছে
        const user = await findUserById(decoded.id);

        // যদি ব্যবহারকারী পাওয়া না যায়, তাহলে ইনভ্যালিড অ্যাক্টিভেশন লিঙ্ক বার্তা রিটার্ন করা হচ্ছে
        if (!user) {
            return res.status(400).json({ message: 'অবৈধ অ্যাক্টিভেশন লিঙ্ক' });
        }

        // ব্যবহারকারীর অ্যাকাউন্ট অ্যাক্টিভ করা হচ্ছে
        await activateUserAccount(user);

        // সফল অ্যাক্টিভেশনের পর ব্যবহারকারীকে সাফল্যের বার্তা পাঠানো হচ্ছে
        res.status(200).json({ message: 'অ্যাকাউন্ট সফলভাবে অ্যাক্টিভ করা হয়েছে' });
    } catch (err) {
        // যদি কোন ত্রুটি ঘটে, তাহলে ত্রুটির বার্তা সহ রেসপন্স পাঠানো হচ্ছে
        res.status(400).json({ message: 'অবৈধ বা মেয়াদোত্তীর্ণ অ্যাক্টিভেশন লিঙ্ক', error: err.message });
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
