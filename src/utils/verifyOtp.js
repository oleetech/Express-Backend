const AppDataSource = require('../config/database');
const User = require('../entities/User');

const verifyOtp = async (contact, otp, callback) => {
    try {
        const userRepository = AppDataSource.getRepository(User);

        // Determine if contact is an email or phone number
        const query = contact.includes('@') ? { email: contact } : { phone: contact };

        // Find the user by email or phone
        const user = await userRepository.findOne({ where: query });
        if (!user) {
            return { status: 400, message: 'ব্যবহারকারী পাওয়া যায়নি' };
        }

        // OTP verification
        if (user.otp !== otp) {
            return { status: 400, message: 'অবৈধ OTP' };
        }

        // Execute callback function if OTP is valid
        const result = await callback(user);

        // Clear OTP field after successful verification
        user.otp = null;
        await userRepository.save(user);

        return result;
    } catch (err) {
        return { status: 500, message: 'OTP যাচাই করার সময় ত্রুটি', error: err.message };
    }
};

module.exports = verifyOtp;
