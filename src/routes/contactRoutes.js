const express = require('express');
const router = express.Router();

const {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
} = require('../controllers/contactController');

// Routes
router.get('/contacts', getAllContacts);
router.get('/contacts/:id', getContactById);
router.post('/contacts', createContact);
router.put('/contacts/:id', updateContact);
router.delete('/contacts/:id', deleteContact);

module.exports = router;
