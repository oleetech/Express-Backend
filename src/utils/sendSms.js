// utils/sendSms.js
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendSms = async (phone, otp) => {
    try {
        await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });
        console.log('OTP sent successfully');
    } catch (err) {
        console.error('Error sending OTP:', err);
    }
};

module.exports = { sendSms };
