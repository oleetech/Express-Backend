const express = require('express');
const router = express.Router();

const {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
} = require('../controllers/contactController');

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API endpoints for managing contact submissions.
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Retrieve all contact submissions
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Successfully retrieved all contact submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Error message if the retrieval fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get contacts'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Retrieve a single contact submission by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the contact submission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Contact not found'
 *       500:
 *         description: Error message if the retrieval fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to get contact'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact submission
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'John Doe'
 *                 description: Name of the contact
 *               email:
 *                 type: string
 *                 example: 'john.doe@example.com'
 *                 description: Email address of the contact
 *               message:
 *                 type: string
 *                 example: 'This is a message.'
 *                 description: Message content from the contact
 *     responses:
 *       201:
 *         description: Successfully created a new contact submission
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
 *                   example: 'This is a message.'
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-01-01T00:00:00.000Z'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Name, email, and message are required'
 *       500:
 *         description: Error message if the creation fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to create contact submission'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */

/**
 * @swagger
 * /api/contacts/{id}:
 *   patch:
 *     summary: Update the status of a contact submission by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: true
 *                 description: The new status of the contact submission (true for replied, false for non_replied)
 *     responses:
 *       200:
 *         description: Successfully updated the contact submission status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-01-01T00:00:00.000Z'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'A valid boolean status is required'
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Contact not found'
 *       500:
 *         description: Error message if the update fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to update contact'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */


/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact submission by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Successfully deleted the contact submission
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Contact not found'
 *       500:
 *         description: Error message if the deletion fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to delete contact'
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: 'John Doe'
 *         email:
 *           type: string
 *           example: 'john.doe@example.com'
 *         message:
 *           type: string
 *           example: 'This is a message.'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2024-01-01T00:00:00.000Z'
 */

// Routes
router.get('/contacts', getAllContacts);
router.get('/contacts/:id', getContactById);
router.post('/contacts', createContact);
router.patch('/contacts/:id', updateContact);
router.delete('/contacts/:id', deleteContact);

module.exports = router;
