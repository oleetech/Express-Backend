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

// Determine the database type from environment variables
const dbType = process.env.DB_TYPE || 'mysql';

// Common configuration options
const commonConfig = {
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: [User, Product, Category, SubCategory,SubSubCategory,Contact,Enquiry], // Add your entities here
    migrations: [
        path.join(__dirname, 'migrations/*.js'), // Path to your migration files
    ],
    subscribers: [], // Add your subscribers here or load from a specific file
};

// Conditional configuration based on DB type
let dbConfig;

if (dbType === 'sqlite') {
    // SQLite configuration
    dbConfig = {
        type: 'sqlite',
        database: process.env.DB_DATABASE || './database.sqlite', // SQLite database file path
    };
} else if (dbType === 'mongodb') {
    // MongoDB configuration
    dbConfig = {
        type: 'mongodb',
        url: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`, // MongoDB connection string
        useNewUrlParser: true, // MongoDB-specific options
        useUnifiedTopology: true, // MongoDB-specific options
    };
} else {
    // MySQL or other SQL-based databases configuration
    dbConfig = {
        type: dbType,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'passportjs_example',
    };
}

// Initialize Data Source with merged configurations
const AppDataSource = new DataSource({
    ...commonConfig,
    ...dbConfig,
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

module.exports = AppDataSource;
