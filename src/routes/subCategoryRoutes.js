const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

/**
 * @swagger
 * /api/subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [SubCategories]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubCategory'
 *       500:
 *         description: Error message if the retrieval fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get subcategories'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 * 
 *   post:
 *     summary: Create a new subcategory
 *     tags: [SubCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Smartphones'
 *                 description: The name of the subcategory
 *               category_id:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the category to which the subcategory belongs
 *     responses:
 *       201:
 *         description: Successfully created the subcategory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       404:
 *         description: Category not found for the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Category not found'
 *       500:
 *         description: Error message if the creation fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to create subcategory'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 * 
 * /api/subcategories/{id}:
 *   get:
 *     summary: Get a single subcategory by ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the subcategory to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the subcategory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       404:
 *         description: Subcategory not found for the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Subcategory not found'
 *       500:
 *         description: Error message if the retrieval fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get subcategory'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 * 
 *   put:
 *     summary: Update an existing subcategory
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the subcategory to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'New Subcategory Name'
 *                 description: The new name of the subcategory
 *               category_id:
 *                 type: integer
 *                 example: 2
 *                 description: The ID of the new category to which the subcategory belongs
 *     responses:
 *       200:
 *         description: Successfully updated the subcategory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       404:
 *         description: Subcategory or category not found for the provided IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Subcategory or category not found'
 *       500:
 *         description: Error message if the update fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to update subcategory'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 * 
 *   delete:
 *     summary: Delete a subcategory by ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the subcategory to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the subcategory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       400:
 *         description: Cannot delete the subcategory because it is linked to products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cannot delete subcategory because it is linked to one or more products'
 *       404:
 *         description: Subcategory not found for the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Subcategory not found'
 *       500:
 *         description: Error message if the deletion fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to delete subcategory'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */



// Routes for subcategory CRUD operations
router.get('/subcategories', subCategoryController.getAllSubCategories);
router.get('/subcategories/:id', subCategoryController.getSubCategoryById);
router.post('/subcategories', subCategoryController.createSubCategory);
router.put('/subcategories/:id',authenticateJWT, subCategoryController.updateSubCategory);
router.delete('/subcategories/:id', authenticateJWT,subCategoryController.deleteSubCategory);

module.exports = router;
