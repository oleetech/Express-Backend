const bcrypt = require('bcryptjs');
const AppDataSource = require('../config/database');
const User = require('../entities/User');

// Registration OTP verification callback
const registrationCallback = async (user) => {
    user.isActivated = true;
    await AppDataSource.getRepository(User).save(user);
    return { status: 200, message: 'অ্যাকাউন্ট সফলভাবে সক্রিয় করা হয়েছে।' };
};

// Login OTP verification callback
const loginCallback = async (user) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { status: 200, message: 'লগইন সফল', token };
};

// Reset password OTP verification callback
const resetPasswordCallback = async (user, newPassword) => {
    user.password = await bcrypt.hash(newPassword, 10);
    await AppDataSource.getRepository(User).save(user);
    return { status: 200, message: 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে।' };
};

module.exports = {
    registrationCallback,
    loginCallback,
    resetPasswordCallback,
};
