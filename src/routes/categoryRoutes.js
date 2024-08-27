// routes/categoryRoutes.js

const express = require('express');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/CategoryController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error message if categories cannot be fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get categories'
 *                 error:
 *                   type: object
 */

router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: The category was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.post('/categories',authenticateJWT, createCategory);
router.put('/categories/:id', authenticateJWT,updateCategory);
router.delete('/categories/:id', authenticateJWT,deleteCategory);

module.exports = router;
