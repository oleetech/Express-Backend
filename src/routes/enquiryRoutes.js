const express = require('express');
const authenticateJWT = require('../middlewares/authenticateJWT'); // Import the JWT middleware

const {
    getAllEnquiries,
    getEnquiryById,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
} = require('../controllers/enquiryController'); // Adjust the path as necessary

const router = express.Router();

// Routes

/**
 * @swagger
 * tags:
 *   name: Enquiries
 *   description: API for managing enquiries
 */

/**
 * @swagger
 * /api/enquiries:
 *   get:
 *     summary: Get all enquiries
 *     tags: [Enquiries]
 *     responses:
 *       200:
 *         description: List of enquiries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enquiry'
 *       500:
 *         description: Error message if enquiries cannot be fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get enquiries'
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/enquiries/{id}:
 *   get:
 *     summary: Get an enquiry by ID
 *     tags: [Enquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The enquiry ID
 *     responses:
 *       200:
 *         description: The enquiry details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enquiry'
 *       404:
 *         description: Enquiry not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Enquiry not found'
 *       500:
 *         description: Error message if enquiry cannot be fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get enquiry'
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/enquiries:
 *   post:
 *     summary: Create a new enquiry and get product details
 *     tags: [Enquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *               - productId
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'John Doe'
 *               email:
 *                 type: string
 *                 example: 'john.doe@example.com'
 *               message:
 *                 type: string
 *                 example: 'I am interested in this product. Please provide more details.'
 *               productId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: The enquiry was successfully created and product details are returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: 'John Doe'
 *                 email:
 *                   type: string
 *                   example: 'john.doe@example.com'
 *                 message:
 *                   type: string
 *                   example: 'I am interested in this product. Please provide more details.'
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-08-28T14:15:22Z'
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-08-28T14:15:22Z'
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: 'Sample Product'
 *                     specification:
 *                       type: string
 *                       example: 'High quality cotton fabric'
 *                     knittingGauge:
 *                       type: string
 *                       example: '20 stitches per inch'
 *                     description:
 *                       type: string
 *                       example: 'This is a great product for winter wear.'
 *                     imageUrl:
 *                       type: string
 *                       example: 'http://example.com/images/product.jpg'
 *                     featured:
 *                       type: boolean
 *                       example: true
 *                     category_id:
 *                       type: integer
 *                       example: 2
 *                     category_name:
 *                       type: string
 *                       example: 'Clothing'
 *                     subcategory_id:
 *                       type: integer
 *                       example: 3
 *                     subcategory_name:
 *                       type: string
 *                       example: 'Winter Wear'
 *                     subSubCategoryId:
 *                       type: integer
 *                       example: 4
 *                     subSubCategory:
 *                       type: string
 *                       example: 'Jackets'
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-08-28T14:15:22Z'
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: '2024-08-28T14:15:22Z'
 *       400:
 *         description: Bad request if the enquiry data is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid enquiry data'
 *                 error:
 *                   type: object
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
 */


/**
 * @swagger
 * /api/enquiries/{id}:
 *   put:
 *     summary: Update an enquiry by ID
 *     tags: [Enquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The enquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Enquiry'
 *     responses:
 *       200:
 *         description: The enquiry was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enquiry'
 *       404:
 *         description: Enquiry not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Enquiry not found'
 *       500:
 *         description: Error message if enquiry cannot be updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to update enquiry'
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/enquiries/{id}:
 *   delete:
 *     summary: Delete an enquiry by ID
 *     tags: [Enquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The enquiry ID
 *     responses:
 *       200:
 *         description: The enquiry was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enquiry'
 *       404:
 *         description: Enquiry not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Enquiry not found'
 *       400:
 *         description: Enquiry cannot be deleted due to constraints
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cannot delete enquiry due to constraints'
 *       500:
 *         description: Error message if enquiry cannot be deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to delete enquiry'
 */

// Enquiry Routes

router.get('/enquiries', getAllEnquiries);
router.get('/enquiries/:id', getEnquiryById);
router.post('/enquiries', createEnquiry);
router.patch('/enquiries/:id', authenticateJWT, updateEnquiry);
router.delete('/enquiries/:id', authenticateJWT, deleteEnquiry);

module.exports = router;