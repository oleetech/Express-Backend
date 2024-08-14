const express = require('express');
const upload = require('../middlewares/uploadMiddleware'); // Adjust the path as necessary
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController'); // Adjust the path as necessary

const router = express.Router();

// Routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', upload.single('image'), createProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
