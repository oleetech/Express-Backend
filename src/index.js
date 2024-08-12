const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const authenticateJWT = require('./middlewares/authenticateJWT');
require('./middlewares/passport-setup'); 

require('dotenv').config();

// TypeORM DataSource import
const AppDataSource = require('./config/database'); // Your database configuration file

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Routes setup
app.use('/auth', authRoutes);

// PORT setup
const port = process.env.PORT || 3000; 

// Initialize database connection and start server
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected successfully!');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error during database connection:', err);
        console.log('Server is running without a database connection.');
    });
