require('reflect-metadata');
require('dotenv').config(); // Load environment variables

const { DataSource } = require('typeorm');
const path = require('path');

// Import your entities here
const User = require('../entities/User'); 
const Product = require('../entities/Product');
const Category = require('../entities/Category');
const SubCategory = require('../entities/SubCategory');
const SubSubCategory = require('../entities/SubSubCategory');
const Contact = require('../entities/Contact');
const Enquiry = require('../entities/Enquiry');

// MySQL-specific configuration
const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'passportjs_example',
    synchronize: process.env.DB_SYNCHRONIZE === 'true', // Synchronize schema - set to 'false' for production
    logging: process.env.DB_LOGGING === 'true', // Enable query logging
    entities: [
        User, 
        Product, 
        Category, 
        SubCategory,
        SubSubCategory,
        Contact,
        Enquiry
    ], // Add your entities here
    migrations: [
        path.join(__dirname, 'migrations/*.js'), // Path to your migration files
    ],
});

// Export the data source for use in other parts of your application
module.exports = AppDataSource;
