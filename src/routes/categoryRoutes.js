// routes/categoryRoutes.js

const express = require('express');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
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
 * api/categories:
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

/**
 * @swagger
 * api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Category not found'
 *       500:
 *         description: Error message if category cannot be fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get category'
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * api/categories:
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

/**
 * @swagger
 * api/categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The category was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Category not found'
 *       500:
 *         description: Error message if category cannot be updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to update category'
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * api/categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Category not found'
 *       400:
 *         description: Category cannot be deleted because it is linked to products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Cannot delete category because it is linked to one or more products'
 *       500:
 *         description: Error message if category cannot be deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Failed to delete category'
 */


/**
 * @swagger
 * /api/categories/getAllCategories:
 *   get:
 *     summary: Retrieve a list of all categories along with their subcategories and sub-subcategories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The category ID
 *                   name:
 *                     type: string
 *                     description: The category name
 *                   subCategories:
 *                     type: array
 *                     description: A list of subcategories belonging to the category
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: The subcategory ID
 *                         name:
 *                           type: string
 *                           description: The subcategory name
 *                         subSubCategories:
 *                           type: array
 *                           description: A list of sub-subcategories belonging to the subcategory
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 description: The sub-subcategory ID
 *                               name:
 *                                 type: string
 *                                 description: The sub-subcategory name
 *       500:
 *         description: Error message if categories cannot be retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get categories'
 *                 error:
 *                   type: string
 *                   example: 'Detailed error message'
 */
router.get('/categories', getCategories);
router.get('/getAllCategories', getAllCategories);


router.get('/categories/:id', getCategoryById);
router.post('/categories',authenticateJWT, createCategory);
router.put('/categories/:id', authenticateJWT,updateCategory);
router.delete('/categories/:id', authenticateJWT,deleteCategory);

module.exports = router;
