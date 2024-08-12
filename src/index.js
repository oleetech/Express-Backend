// src/index.js
// Express এবং body-parser প্যাকেজ ইম্পোর্ট করা
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const authenticateJWT = require('./middlewares/authenticateJWT');

require('dotenv').config();

// TypeORM DataSource ইম্পোর্ট করা
const AppDataSource = require('./config/database'); // আপনার database ফাইলের পাথ দিন

const app = express();

// Middleware সেটআপ
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Routes সেটআপ
app.use('/auth', authRoutes);

// PORT সেটআপ
const port = process.env.PORT || 3000; // যদি env থেকে PORT না পাওয়া যায়, তবে 3000 ব্যবহার হবে

// Server চালু করুন
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    // Database connection চেষ্টা করুন
    AppDataSource.initialize()
        .then(() => {
            console.log('Database connected successfully!');
        })
        .catch((err) => {
            console.error('Error during database connection:', err);
            console.log('Server is running without a database connection.');
        });
});
