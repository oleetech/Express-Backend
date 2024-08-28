const AppDataSource = require('../config/database'); // Import your data source
const Enquiry = require('../entities/Enquiry'); 
const Product = require('../entities/Product'); 
const Category = require('../entities/Category'); 
const SubCategory = require('../entities/SubCategory');
const SubSubCategory = require('../entities/SubSubCategory'); 
// Get all enquiries
/**
 * Retrieves all enquiries from the database.
 * @function getAllEnquiries
 * @description Fetches all enquiries from the database and sends them as a response.
 * @route GET /api/enquiries
 * @access Public
 * 
 * @returns {Promise<void>} - Returns a promise that resolves to the response with all enquiries.
 */
const getAllEnquiries = async (req, res) => {
    try {
        // Fetch all enquiries with related product, category, subcategory, and subsubcategory details
        const enquiries = await AppDataSource.getRepository(Enquiry).find({
            relations: [
                'product',
                'product.category',
                'product.subCategory',
                'product.subSubCategory',
            ],
        });

        // Format the response to include all relevant product details
        const formattedEnquiries = enquiries.map(enquiry => ({
            id: enquiry.id,
            name: enquiry.name,
            email: enquiry.email,
            message: enquiry.message,
            status: enquiry.status,
            createdAt: enquiry.createdAt,
            updatedAt: enquiry.updatedAt,
            product: enquiry.product ? {
                id: enquiry.product.id,
                name: enquiry.product.name,
                specification: enquiry.product.specification,
                knittingGauge: enquiry.product.knittingGauge,
                description: enquiry.product.description,
                imageUrl: enquiry.product.imageUrl,
                featured: enquiry.product.featured,
                category_id: enquiry.product.category ? enquiry.product.category.id : null,
                category_name: enquiry.product.category ? enquiry.product.category.name : null,
                subcategory_id: enquiry.product.subCategory ? enquiry.product.subCategory.id : null,
                subcategory_name: enquiry.product.subCategory ? enquiry.product.subCategory.name : null,
                subSubCategoryId: enquiry.product.subSubCategory ? enquiry.product.subSubCategory.id : null,
                subSubCategory: enquiry.product.subSubCategory ? enquiry.product.subSubCategory.name : null,
                createdAt: enquiry.product.createdAt,
                updatedAt: enquiry.product.updatedAt,
            } : null,
        }));

        res.status(200).json(formattedEnquiries);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ message: 'Failed to get enquiries', error });
    }
};

// Get a single enquiry by ID
/**
 * Retrieves a single enquiry by its ID.
 * @function getEnquiryById
 * @description Fetches an enquiry by its ID from the database and sends it as a response.
 * @route GET /api/enquiries/:id
 * @access Public
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * 
 * @returns {Promise<void>} - Returns a promise that resolves to the response with the enquiry.
 */
const getEnquiryById = async (req, res) => {
    try {
        // Fetch the enquiry by ID with related product, category, subcategory, and subsubcategory details
        const enquiry = await AppDataSource.getRepository(Enquiry).findOne({
            where: { id: parseInt(req.params.id) },
            relations: [
                'product',
                'product.category',
                'product.subCategory',
                'product.subSubCategory',
            ],
        });

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        // Format the response to include all relevant product details
        const formattedEnquiry = {
            id: enquiry.id,
            name: enquiry.name,
            email: enquiry.email,
            message: enquiry.message,
            status: enquiry.status,
            createdAt: enquiry.createdAt,
            updatedAt: enquiry.updatedAt,
            product: enquiry.product ? {
                id: enquiry.product.id,
                name: enquiry.product.name,
                specification: enquiry.product.specification,
                knittingGauge: enquiry.product.knittingGauge,
                description: enquiry.product.description,
                imageUrl: enquiry.product.imageUrl,
                featured: enquiry.product.featured,
                category_id: enquiry.product.category ? enquiry.product.category.id : null,
                category_name: enquiry.product.category ? enquiry.product.category.name : null,
                subcategory_id: enquiry.product.subCategory ? enquiry.product.subCategory.id : null,
                subcategory_name: enquiry.product.subCategory ? enquiry.product.subCategory.name : null,
                subSubCategoryId: enquiry.product.subSubCategory ? enquiry.product.subSubCategory.id : null,
                subSubCategory: enquiry.product.subSubCategory ? enquiry.product.subSubCategory.name : null,
                createdAt: enquiry.product.createdAt,
                updatedAt: enquiry.product.updatedAt,
            } : null,
        };

        res.status(200).json(formattedEnquiry);
    } catch (error) {
        console.error('Error fetching enquiry:', error);
        res.status(500).json({ message: 'Failed to get enquiry', error });
    }
};


// Create a new enquiry
const createEnquiry = async (req, res) => {
    try {
        const { name, email, message, status, productId } = req.body;

        // Validate input fields
        if (!name || !email || !message || !productId) {
            return res.status(400).json({ message: 'Name, email, message, and product ID are required' });
        }

        // Find the product by ID, including related entities
        const product = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .leftJoinAndSelect('product.subSubCategory', 'subSubCategory')
            .where('product.id = :productId', { productId })
            .getOne();

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create and save the new enquiry
        const newEnquiry = await AppDataSource.getRepository(Enquiry).save({
            name,
            email,
            message,
            status: status || 'non_replied', // Default to 'non_replied' if status is not provided
            product, // Save the associated product
        });

        // Return the newly created enquiry with product details
        res.status(201).json({
            id: newEnquiry.id,
            name: newEnquiry.name,
            email: newEnquiry.email,
            message: newEnquiry.message,
            status: newEnquiry.status,
            createdAt: newEnquiry.createdAt,
            updatedAt: newEnquiry.updatedAt,
            product: {
                id: product.id,
                name: product.name,
                specification: product.specification,
                knittingGauge: product.knittingGauge,
                description: product.description,
                imageUrl: product.imageUrl,
                featured: product.featured,
                category_id: product.category ? product.category.id : null,
                category_name: product.category ? product.category.name : null,
                subcategory_id: product.subCategory ? product.subCategory.id : null,
                subcategory_name: product.subCategory ? product.subCategory.name : null,
                subSubCategoryId: product.subSubCategory ? product.subSubCategory.id : null,
                subSubCategory: product.subSubCategory ? product.subSubCategory.name : null,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            },
        });
    } catch (error) {
        console.error('Error creating enquiry:', error);
        res.status(500).json({ message: 'Failed to create enquiry', error });
    }
};


// Update an enquiry by ID
/**
 * Updates an existing enquiry by its ID.
 * @function updateEnquiry
 * @description Updates an enquiry's details and saves the changes to the database.
 * @route PUT /api/enquiries/:id
 * @access Public
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * 
 * @returns {Promise<void>} - Returns a promise that resolves to the response with the updated enquiry.
 */
const updateEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Ensure status is provided in the request body, and it's either true or false
        if (status === undefined) {
            return res.status(400).json({ message: 'Status is required to update the enquiry' });
        }

        // Find the enquiry by ID with related product details
        const enquiry = await AppDataSource.getRepository(Enquiry).findOne({
            where: { id: parseInt(id) },
            relations: [
                'product',
                'product.category',
                'product.subCategory',
                'product.subSubCategory',
            ],
        });

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        // Update the status field
        enquiry.status = status;

        // Save the updated enquiry
        const updatedEnquiry = await AppDataSource.getRepository(Enquiry).save(enquiry);

        // Return the updated enquiry with related product details
        res.status(200).json({
            id: updatedEnquiry.id,
            name: updatedEnquiry.name,
            email: updatedEnquiry.email,
            message: updatedEnquiry.message,
            status: updatedEnquiry.status,
            createdAt: updatedEnquiry.createdAt,
            updatedAt: updatedEnquiry.updatedAt,
            product: {
                id: updatedEnquiry.product.id,
                name: updatedEnquiry.product.name,
                specification: updatedEnquiry.product.specification,
                knittingGauge: updatedEnquiry.product.knittingGauge,
                description: updatedEnquiry.product.description,
                imageUrl: updatedEnquiry.product.imageUrl,
                featured: updatedEnquiry.product.featured,
                category_id: updatedEnquiry.product.category ? updatedEnquiry.product.category.id : null,
                category_name: updatedEnquiry.product.category ? updatedEnquiry.product.category.name : null,
                subcategory_id: updatedEnquiry.product.subCategory ? updatedEnquiry.product.subCategory.id : null,
                subcategory_name: updatedEnquiry.product.subCategory ? updatedEnquiry.product.subCategory.name : null,
                subSubCategoryId: updatedEnquiry.product.subSubCategory ? updatedEnquiry.product.subSubCategory.id : null,
                subSubCategory: updatedEnquiry.product.subSubCategory ? updatedEnquiry.product.subSubCategory.name : null,
                createdAt: updatedEnquiry.product.createdAt,
                updatedAt: updatedEnquiry.product.updatedAt,
            },
        });
    } catch (error) {
        console.error('Error updating enquiry:', error);
        res.status(500).json({ message: 'Failed to update enquiry', error });
    }
};

// Delete an enquiry by ID
/**
 * Deletes an enquiry by its ID.
 * @function deleteEnquiry
 * @description Deletes an enquiry from the database and sends a success message as a response.
 * @route DELETE /api/enquiries/:id
 * @access Public
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * 
 * @returns {Promise<void>} - Returns a promise that resolves to the response with a success message.
 */
const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the enquiry by ID
        const enquiry = await AppDataSource.getRepository(Enquiry).findOneBy({ id: parseInt(id) });

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        // Delete the enquiry
        await AppDataSource.getRepository(Enquiry).remove(enquiry);
        res.status(200).json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        console.error('Error deleting enquiry:', error);
        res.status(500).json({ message: 'Failed to delete enquiry', error });
    }
};

module.exports = {
    getAllEnquiries,
    getEnquiryById,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
};
