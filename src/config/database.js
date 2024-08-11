require('reflect-metadata');
require('dotenv').config(); // Ensure dotenv is loaded before accessing process.env

const { DataSource } = require('typeorm');

// Determine the database type from environment variables
const dbType = process.env.DB_TYPE || 'mysql';

const AppDataSource = new DataSource({
    type: dbType, // Use the database type specified in the .env file
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'passportjs_example',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: [], // Add your entities here or load from a specific file
    migrations: [], // Add your migrations here or load from a specific file
    subscribers: [], // Add your subscribers here or load from a specific file
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

module.exports = AppDataSource;
