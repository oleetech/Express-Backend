const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const authenticateJWT = require('./middlewares/authenticateJWT');
require('./middlewares/passport-setup'); 

require('dotenv').config();
const cors = require('cors'); // Import the cors package

// TypeORM DataSource import
const AppDataSource = require('./config/database'); // Your database configuration file

const app = express();
const path = require('path');

// Use CORS middleware
app.use(cors());


// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Serve static files (e.g., images) from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Auth Routes setup
app.use('/auth', authRoutes);

// Upload middleware setup
const upload = require('./middlewares/uploadMiddleware');
// Route: Single file upload
app.post('/upload-single', upload.single('singleFile'), (req, res) => {
    res.status(200).json({
      message: 'File uploaded successfully!',
      file: req.file,
    });
  });

// Use the category routes
const categoryRoutes = require('./routes/categoryRoutes'); // Import the category routes
app.use('/api', categoryRoutes); // Add the category routes with a base path of /api

// Use the sub category routes
const subCategoryRoutes = require('./routes/subCategoryRoutes');
app.use('/api', subCategoryRoutes); 

// Import the subSubCategory routes
const subSubCategoryRoutes = require('./routes/subSubCategoryRoutes');
app.use('/api', subSubCategoryRoutes);


// Use the products routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/', productRoutes);


const contactRoutes = require('./routes/contactRoutes'); // Adjust the path if necessary
app.use('/api', contactRoutes); // Use the contact routes



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
