const express = require('express');
const upload = require('../middlewares/uploadMiddleware'); // Adjust the path as necessary
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts 
} = require('../controllers/productController'); // Adjust the path as necessary

const router = express.Router();

// Routes
router.get('/products',getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products',authenticateJWT, upload.single('image'), createProduct);
router.put('/products/:id', authenticateJWT,upload.single('image'), updateProduct);
router.delete('/products/:id', authenticateJWT,deleteProduct);
router.get('/products/search', searchProducts);
module.exports = router;
