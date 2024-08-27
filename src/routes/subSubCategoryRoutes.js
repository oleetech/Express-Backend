// routes/subSubCategoryRoutes.js

const express = require('express');
const router = express.Router();
const subSubCategoryController = require('../controllers/SubSubCategoryController');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

/**
 * @swagger
 * /api/subsubcategories:
 *   get:
 *     summary: Get all sub-subcategories
 *     tags: [SubSubCategories]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of sub-subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubSubCategory'
 *       500:
 *         description: Error message if the retrieval fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get sub-subcategories'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 * 
 *   post:
 *     summary: Create a new sub-subcategory
 *     tags: [SubSubCategories]
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
 *                 description: The name of the sub-subcategory
 *               subCategoryId:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the subcategory to which the sub-subcategory belongs
 *     responses:
 *       201:
 *         description: Successfully created the sub-subcategory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubSubCategory'
 *       404:
 *         description: Subcategory not found for the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'SubCategory not found'
 *       500:
 *         description: Error message if the creation fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to create sub-subcategory'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 * 
 * /api/subsubcategories/{id}:
 *   get:
 *     summary: Get a single sub-subcategory by ID
 *     tags: [SubSubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the sub-subcategory to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the sub-subcategory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubSubCategory'
 *       404:
 *         description: Sub-subcategory not found for the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'SubSubCategory not found'
 *       500:
 *         description: Error message if the retrieval fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get sub-subcategory'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 * 
 *   put:
 *     summary: Update an existing sub-subcategory
 *     tags: [SubSubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the sub-subcategory to update
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
 *                 example: 'New SubSubCategory Name'
 *                 description: The new name of the sub-subcategory
 *               subCategoryId:
 *                 type: integer
 *                 example: 2
 *                 description: The ID of the new subcategory to which the sub-subcategory belongs
 *     responses:
 *       200:
 *         description: Successfully updated the sub-subcategory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubSubCategory'
 *       404:
 *         description: Sub-subcategory or subcategory not found for the provided IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'SubSubCategory or SubCategory not found'
 *       500:
 *         description: Error message if the update fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to update sub-subcategory'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 * 
 *   delete:
 *     summary: Delete a sub-subcategory by ID
 *     tags: [SubSubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the sub-subcategory to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the sub-subcategory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubSubCategory'
 *       400:
 *         description: Cannot delete the sub-subcategory because it is linked to products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cannot delete sub-subcategory because it is linked to one or more products'
 *       404:
 *         description: Sub-subcategory not found for the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'SubSubCategory not found'
 *       500:
 *         description: Error message if the deletion fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to delete sub-subcategory'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 * 
 * components:
 *   schemas:
 *     SubSubCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: 'Smartphones'
 *         subCategory:
 *           type: string
 *           example: 'Electronics'
 *         subCategoryId:
 *           type: integer
 *           example: 1
 *         category:
 *           type: string
 *           example: 'Tech'
 *         categoryId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-08-27T10:00:00Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2023-08-27T10:00:00Z'
 */


// Routes for sub-subcategory CRUD operations
router.get('/subsubcategories', subSubCategoryController.getAllSubSubCategories);
router.get('/subsubcategories/:id', subSubCategoryController.getSubSubCategoryById);
router.post('/subsubcategories', authenticateJWT, subSubCategoryController.createSubSubCategory);
router.put('/subsubcategories/:id', authenticateJWT, subSubCategoryController.updateSubSubCategory);
router.delete('/subsubcategories/:id', authenticateJWT, subSubCategoryController.deleteSubSubCategory);

module.exports = router;
