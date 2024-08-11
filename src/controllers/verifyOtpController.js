const verifyOtp = require('../utils/verifyOtp');
const {
    registrationCallback,
    loginCallback,
    resetPasswordCallback
} = require('../utils/otpCallbacks');

const verifyOtpController = async (req, res) => {
    const { contact, otp, params } = req.body;

    try {
        let result;
        
        // Call the appropriate callback based on the params value
        if (params === 'register') {
            result = await verifyOtp(contact, otp, registrationCallback);
        } else if (params === 'login') {
            result = await verifyOtp(contact, otp, loginCallback);
        } else if (params === 'reset-password') {
            const { newPassword } = req.body;
            result = await verifyOtp(contact, otp, async (user) => {
                return await resetPasswordCallback(user, newPassword);
            });
        } else {
            return res.status(400).json({ message: 'Invalid params value' });
        }

        res.status(result.status).json({ message: result.message, token: result.token || null });
    } catch (err) {
        res.status(500).json({ message: 'Error verifying OTP', error: err.message });
    }
};

module.exports = verifyOtpController;
