const AppDataSource = require('../config/database');
const Contact = require('../entities/Contact');

// Create a new contact submission
const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input fields
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required' });
        }

        // Create and save the new contact submission
        const newContact = await AppDataSource.getRepository(Contact).save({
            name,
            email,
            message,
            status: false  // Set default status to 'non_replied'
        });

        res.status(201).json({
            id: newContact.id,
            name: newContact.name,
            email: newContact.email,
            message: newContact.message,
            status: newContact.status,  // Include status in the response
            createdAt: newContact.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create contact submission', error });
    }
};



// Get all contact submissions
const getAllContacts = async (req, res) => {
    try {
        const contacts = await AppDataSource.getRepository(Contact).find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get contacts', error });
    }
};


// Get a single contact submission by ID
const getContactById = async (req, res) => {
    try {
        const contact = await AppDataSource.getRepository(Contact).findOneBy({ id: parseInt(req.params.id) });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get contact', error });
    }
};



const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status field
        if (typeof status !== 'boolean') {
            return res.status(400).json({ message: 'A valid boolean status is required' });
        }

        const contactRepository = AppDataSource.getRepository(Contact);
        const contact = await contactRepository.findOneBy({ id: parseInt(id) });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Update only the status field
        contact.status = status;

        const updatedContact = await contactRepository.save(contact);
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update contact', error });
    }
};


// Delete a contact submission
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contactRepository = AppDataSource.getRepository(Contact);
        const contact = await contactRepository.findOneBy({ id: parseInt(id) });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await contactRepository.remove(contact);
        res.status(204).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete contact', error });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
};
