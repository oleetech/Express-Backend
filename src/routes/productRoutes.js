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

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     description: Fetches all products along with their associated categories, subcategories, and sub-subcategories.
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */

router.get('/products',getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products',authenticateJWT, upload.single('image'), createProduct);
router.put('/products/:id', authenticateJWT,upload.single('image'), updateProduct);
router.delete('/products/:id', authenticateJWT,deleteProduct);
/**
 * @swagger
 * /products/update-feature-image:
 *   patch:
 *     summary: Update feature image status for products
 *     description: Updates the feature image status for a list of products identified by their IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of product IDs to update
 *                 example: [1, 2, 3]
 *               featureImage:
 *                 type: boolean
 *                 description: New feature image status to set
 *                 example: true
 *             required:
 *               - ids
 *               - featureImage
 *     responses:
 *       200:
 *         description: Successfully updated feature image status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: 'প্রোডাক্টের ফিচার ইমেজ সফলভাবে আপডেট হয়েছে'
 *       404:
 *         description: No products found with the provided IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: 'প্রোডাক্ট পাওয়া যায়নি'
 *       500:
 *         description: Failed to update feature image status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: 'ফিচার ইমেজ আপডেট করতে ব্যর্থ হয়েছে'
 *                 error:
 *                   type: string
 *                   description: Error details
 *                   example: 'Detailed error message'
 */

router.put('/update-feature-image', updateFeatureImage);
// Route to fetch `enquery` data by product ID
router.get('/products/:id/enquery', getEnqueryById);
// Route to update `enquery` data by product ID
router.put('/products/:id/enquery', updateEnqueryById);
module.exports = router;
