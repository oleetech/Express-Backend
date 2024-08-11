// src/utils/sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure environment variables are loaded

/**
 * Sends an email using Nodemailer with the provided options.
 * @param {Object} options - The email options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.text - The body text of the email.
 */
const sendEmail = async (options) => {
    // Create a Nodemailer transporter using environment variables
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // Email service from environment variables
        auth: {
            user: process.env.EMAIL_USER, // Your email address from environment variables
            pass: process.env.EMAIL_PASS, // Your email password (or app password) from environment variables
        },
        port: parseInt(process.env.EMAIL_PORT, 10) || 465, // Port from environment variables, default to 465
        secure: process.env.EMAIL_SECURE === 'true', // Secure option (true for port 465, false for port 587)
        // Optional settings
        connectionTimeout: parseInt(process.env.EMAIL_CONNECTION_TIMEOUT, 10) || 5000, // Connection timeout
        maxConnections: parseInt(process.env.EMAIL_MAX_CONNECTIONS, 10) || 5, // Max simultaneous connections
        // host: process.env.EMAIL_HOST, // Optionally set host if not using 'service'
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email address
        to: options.to,             // Recipient's email address
        subject: options.subject,   // Email subject
        text: options.text,         // Email body text
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
