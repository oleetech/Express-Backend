const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppDataSource = require('../config/database');
const User = require('../entities/User');
const sendEmail = require('../utils/sendEmail');
const generateOtp = require('../utils/generateOtp');
const sendSms = require('../utils/sendSms');


const register = async (req, res) => {
    const { username, email, password, phone } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    try {
        // Check if user already exists
        const existingUser = await userRepository.findOne({ where: [{ username }, { email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'ব্যবহারকারী ইতোমধ্যে নিবন্ধিত' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance using the repository's create method
        const newUser = userRepository.create({
            username,
            email,
            password: hashedPassword,
            phone,
            isActivated: false,
        });

        // Save the new user
        await userRepository.save(newUser);

        if (email) {
            // Handle email verification
            if (process.env.EMAIL_VERIFICATION_ENABLED === 'true') {
                if (process.env.OTP_VERIFICATION_ENABLED === 'true') {
                    // Send OTP to email
                    const otp = generateOtp();
                    newUser.otp = otp;
                    await userRepository.save(newUser);

                    try {
                        await sendEmail({
                            to: newUser.email,
                            subject: 'OTP for Registration',
                            text: `Your OTP is ${otp}. Use this code to complete your registration.`,
                        });
                        return res.status(201).json({ message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত। OTP পাঠানো হয়েছে, দয়া করে যাচাই করুন।' });
                    } catch (emailError) {
                        return res.status(500).json({ message: 'ব্যবহারকারী নিবন্ধিত হয়েছে, কিন্তু ইমেল পাঠাতে ব্যর্থ হয়েছে।', error: emailError.message });
                    }
                } 

                else {
                    // Send activation email
                    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    const activationLink = `${process.env.EMAIL_VERIFY_ACTIVATION_LINK}/${token}`;

                    try {
                        await sendEmail({
                            to: newUser.email,
                            subject: 'Account Activation',
                            text: `Please click the following link to activate your account: ${activationLink}`,
                        });
                        return res.status(201).json({ message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত। অ্যাকাউন্ট সক্রিয়করণের জন্য ইমেল পাঠানো হয়েছে।' });
                    } catch (emailError) {
                        return res.status(500).json({ message: 'ব্যবহারকারী নিবন্ধিত হয়েছে, কিন্তু অ্যাকাউন্ট সক্রিয়করণ ইমেল পাঠাতে ব্যর্থ হয়েছে।', error: emailError.message });
                    }
                }
            } else {
                // Default activation
                newUser.isActivated = true;
                await userRepository.save(newUser);
            }
        }

        

        res.status(201).json({ message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত। প্রয়োজনীয় যাচাই সম্পন্ন করুন।' });
    } catch (err) {
        res.status(500).json({ message: 'ব্যবহারকারী নিবন্ধন করতে ত্রুটি', error: err.message });
    }
};

const activateAccount = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userRepository = AppDataSource.getRepository(User);

        let user = await userRepository.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid activation link' });
        }

        user.isActivated = true;
        await userRepository.save(user);

        res.status(200).json({ message: 'Account activated successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired activation link', error: err.message });
    }
};




module.exports = { register,activateAccount };


