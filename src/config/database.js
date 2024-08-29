// config/database.js
require('reflect-metadata');
const { DataSource } = require('typeorm');
const path = require('path');
const { User, Product, Category, SubCategory, SubSubCategory, Contact, Enquiry, Role, Permission, UserGroup } = require('../entities');

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
    entities: [User, Product, Category, SubCategory, SubSubCategory, Contact, Enquiry, Role, Permission, UserGroup], // Include all entities

    migrations: [
        path.join(__dirname, 'migrations/*.js'), // Path to your migration files
    ],
});

module.exports = AppDataSource;
