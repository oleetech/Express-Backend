const express = require('express');
const upload = require('../middlewares/uploadMiddleware'); // Adjust the path as necessary
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateFeatured,
    updateSingleFeatured,
     
} = require('../controllers/productController'); // Adjust the path as necessary

const router = express.Router();

// Routes

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error message if products cannot be fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get products'
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Product not found'
 *       500:
 *         description: Error message if product cannot be fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get product'
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request if the product data is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid product data'
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Product not found'
 *       500:
 *         description: Error message if product cannot be updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to update product'
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Product not found'
 *       400:
 *         description: Product cannot be deleted due to constraints
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cannot delete product due to constraints'
 *       500:
 *         description: Error message if product cannot be deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to delete product'
 */

/**
 * @swagger
 * /api/products/bulk-featured-update:
 *   patch:
 *     summary: Update feature image status for one or more products
 *     tags: [Products]
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
 *                 example: [1, 2, 3]
 *                 description: List of product IDs to update
 *               featured:
 *                 type: boolean
 *                 example: true
 *                 description: Boolean indicating whether to set the product as featured
 *     responses:
 *       200:
 *         description: Successfully updated the feature image for the products and returned the updated product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found for the provided IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'প্রোডাক্ট পাওয়া যায়নি'
 *       500:
 *         description: Error message if the feature image update fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'ফিচার ইমেজ আপডেট করতে ব্যর্থ হয়েছে'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */

router.get('/products',getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products',authenticateJWT, upload.single('image'), createProduct);
router.put('/products/:id', authenticateJWT,upload.single('image'), updateProduct);
router.delete('/products/:id', authenticateJWT,deleteProduct);
router.patch('/products/bulk-featured-update', updateFeatured);
// Route to update the featured status of a single product
router.patch('/product/update-featured', updateSingleFeatured);
module.exports = router;
