const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateOtp = require('../utils/generateOtp');
const sendEmail = require('../utils/sendEmail');
const { sendSms } = require('../utils/sendSms');
const User = require('../entities/User');
// Check if User Exists
const checkIfUserExists = async (userRepository, username, email, phone) => {
    return await userRepository.findOne({ where: [{ username }, { email }, { phone }] });
};

// Hash Password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Create New User
const createNewUser = (userRepository, username, email, hashedPassword, phone) => {
    return userRepository.create({
        username,
        email,
        password: hashedPassword,
        phone,
        isActivated: false,
    });
};

// Save New User
const saveUser = async (userRepository, newUser) => {
    return await userRepository.save(newUser);
};

// Phone Registration Handler
const handlePhoneRegistration = async (userRepository, newUser, phone) => {
    if (process.env.PHONE_VERIFICATION_ENABLED === 'true') {
        // Send OTP to phone
        const otp = generateOtp();
        newUser.otp = otp;
        await saveUser(userRepository, newUser);

        await sendSms(phone, `Your OTP is ${otp}. Use this code to complete your registration.`);
        return { success: true, message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত। অ্যাকাউন্ট সক্রিয়করণের জন্য OTP পাঠানো হয়েছে।' };
    } else {
        // Default activation
        newUser.isActivated = true;
        await saveUser(userRepository, newUser);
        return { success: true, message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত। প্রয়োজনীয় যাচাই সম্পন্ন করুন।' };
    }
};

// Email Registration Handler
const handleEmailRegistration = async (userRepository, newUser) => {
    if (process.env.EMAIL_VERIFICATION_ENABLED === 'true') {
        if (process.env.OTP_VERIFICATION_ENABLED === 'true') {
            // Send OTP to email
            const otp = generateOtp();
            newUser.otp = otp;
            await saveUser(userRepository, newUser);

            try {
                await sendEmail({
                    to: newUser.email,
                    subject: 'OTP for Registration',
                    text: `Your OTP is ${otp}. Use this code to complete your registration.`,
                });
                return { success: true, message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত। OTP পাঠানো হয়েছে, দয়া করে যাচাই করুন।' };
            } catch (emailError) {
                return { success: false, message: 'ব্যবহারকারী নিবন্ধিত হয়েছে, কিন্তু ইমেল পাঠাতে ব্যর্থ হয়েছে।', error: emailError.message };
            }
        } else {
            // Send activation email
            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const activationLink = `${process.env.EMAIL_VERIFY_ACTIVATION_LINK}/${token}`;

            try {
                await sendEmail({
                    to: newUser.email,
                    subject: 'Account Activation',
                    text: `Please click the following link to activate your account: ${activationLink}`,
                });
                return { success: true, message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত। অ্যাকাউন্ট সক্রিয়করণের জন্য ইমেল পাঠানো হয়েছে।' };
            } catch (emailError) {
                return { success: false, message: 'ব্যবহারকারী নিবন্ধিত হয়েছে, কিন্তু অ্যাকাউন্ট সক্রিয়করণ ইমেল পাঠাতে ব্যর্থ হয়েছে।', error: emailError.message };
            }
        }
    } else {
        // Default activation
        newUser.isActivated = true;
        await saveUser(userRepository, newUser);
        return { success: true, message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত। প্রয়োজনীয় যাচাই সম্পন্ন করুন।' };
    }
};

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email }, // Payload
        process.env.JWT_SECRET, // Secret key
        { expiresIn: '1h' } // Options
    );
};


// Phone Login Logic
const phoneLogin = async (identifier, userRepository, res) => {
    const user = await userRepository.findOne({ where: { phone: identifier } });

    if (!user) {
        console.log("User not found with phone number:", identifier);
        return res.status(400).send('User not found or not activated.');
    }

    if (process.env.PHONE_VERIFICATION_ENABLED === 'true') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiration = new Date(Date.now() + 10 * 60000); // 10 minutes from now

        user.otp = otp;
        user.otp_expiration = otpExpiration;

        await userRepository.save(user);

        await sendSms(identifier, `Your OTP is ${otp}. Use this code to complete your login.`);
        console.log("OTP sent to phone:", identifier);
        return res.send('OTP sent to your phone.');
    } else {
        const token = generateToken(user);
        console.log("User logged in without OTP:", identifier);
        return res.json({ token });
    }
};

// Email Login Logic
const emailLogin = async (identifier, password, userRepository, res) => {
    const user = await userRepository.findOne({ where: { email: identifier } });

    if (!user) {
        console.log("User not found with email:", identifier);
        return res.status(400).send('User not found or not activated.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("Invalid password for email:", identifier);
        return res.status(400).send('Invalid password.');
    }

    if (process.env.EMAIL_VERIFICATION_ENABLED === 'true' && !user.isActivated) {
        return res.status(400).send('Please activate your account via email.');
    }

    const token = generateToken(user);
    console.log("User logged in with email:", identifier);
    return res.json({ token });
};

// Username Login Logic
const usernameLogin = async (identifier, password, userRepository, res) => {
    const user = await userRepository.findOne({ where: { username: identifier } });

    if (!user) {
        console.log("User not found with username:", identifier);
        return res.status(400).send('User not found or not activated.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("Invalid password for username:", identifier);
        return res.status(400).send('Invalid password.');
    }

    if (process.env.EMAIL_VERIFICATION_ENABLED === 'true' && !user.isActivated) {
        return res.status(400).send('Please activate your account via email.');
    }

    const token = generateToken(user);
    console.log("User logged in with username:", identifier);
    return res.json({ token });
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
};

const findUserById = async (id) => {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOne({ where: { id } });
};

const activateUserAccount = async (user) => {
    user.isActivated = true;
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.save(user);
};


// Handle Google OAuth Callback and Generate JWT
const handleGoogleCallback = async (user, res) => {
    try {
        // Generate JWT Token using your generateToken method
        const token = generateToken(user);

        // Return the token and user information
        return res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch (err) {
        console.error("Error during Google OAuth callback:", err);
        return res.status(500).json({ message: 'Error during login', error: err.message });
    }
};

module.exports = {
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
};