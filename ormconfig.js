module.exports = {
    type: 'mysql', // or whatever your database is
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'yourpassword',
    database: 'yourdatabase',
    synchronize: false, // Never use `synchronize: true` in production
    logging: true,
    entities: ['src/entities/**/*.js'], // Adjust to your entities path
    migrations: ['src/migrations/**/*.js'], // Adjust to your migrations path
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
    },
};
