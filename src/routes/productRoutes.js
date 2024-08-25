const express = require('express');
const upload = require('../middlewares/uploadMiddleware'); // Adjust the path as necessary
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateFeatureImage,
    getEnqueryById,
    updateEnqueryById
     
} = require('../controllers/productController'); // Adjust the path as necessary

const router = express.Router();

// Routes
router.get('/products',getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products',authenticateJWT, upload.single('image'), createProduct);
router.put('/products/:id', authenticateJWT,upload.single('image'), updateProduct);
router.delete('/products/:id', authenticateJWT,deleteProduct);
router.put('/update-feature-image', updateFeatureImage);
// Route to fetch `enquery` data by product ID
router.get('/products/:id/enquery', getEnqueryById);
// Route to update `enquery` data by product ID
router.put('/products/:id/enquery', updateEnqueryById);
module.exports = router;
