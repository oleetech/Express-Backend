const bcrypt = require('bcryptjs');
const AppDataSource = require('../config/database');
const User = require('../entities/User');

const register = async (req, res) => {
    const { username, email, password, phone } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    try {
        const existingUser = await userRepository.findOneBy({
            username,
            email,
            phone
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            username,
            email,
            password: hashedPassword,
            phone,
            isActivated: false
        });

        await userRepository.save(newUser);

        res.status(201).json({ message: 'User registered successfully. Please check your email to activate your account.' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

module.exports = { register };
