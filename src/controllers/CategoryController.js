// controllers/CategoryController.js

const AppDataSource = require('../config/database'); // Import your data source
const Category = require('../entities/Category');
const SubCategory = require('../entities/SubCategory');
const SubSubCategory = require('../entities/SubSubCategory');
const Product = require('../entities/Product');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await AppDataSource.getRepository(Category).find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get categories', error });
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await AppDataSource.getRepository(Category).findOneBy({
            id: req.params.id
        });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get category', error });
    }
};



// Create a new category
const createCategory = async (req, res) => {
    try {
        const categoryRepository = AppDataSource.getRepository(Category);
        const newCategory = categoryRepository.create(req.body);
        const savedCategory = await categoryRepository.save(newCategory); // Save and return the saved category
        res.status(201).json(savedCategory); // Return the created category as response
    } catch (error) {
        res.status(500).json({ message: 'Failed to create category', error });
    }
};


// Update a category by ID
const updateCategory = async (req, res) => {
    try {
        const categoryRepository = AppDataSource.getRepository(Category);
        const category = await categoryRepository.findOneBy({ id: req.params.id });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        categoryRepository.merge(category, req.body); // Merge the new data with the existing one
        const updatedCategory = await categoryRepository.save(category); // Save and return the updated category

        res.status(200).json(updatedCategory); // Return the updated category as response
    } catch (error) {
        res.status(500).json({ message: 'Failed to update category', error });
    }
};


// Delete a category by ID
const deleteCategory = async (req, res) => {
    try {
        const categoryRepository = AppDataSource.getRepository(Category);
        const productRepository = AppDataSource.getRepository(Product);

        // Check if the category exists
        const category = await categoryRepository.findOneBy({ id: req.params.id });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if any products are linked to the category
        const linkedProducts = await productRepository.find({ where: { category: { id: req.params.id } } });

        if (linkedProducts.length > 0) {
            return res.status(400).json({ error: 'Cannot delete category because it is linked to one or more products' });
        }

        // If no products are linked, proceed to remove the category
        await categoryRepository.remove(category);

        // Return the deleted category details
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category', details: error.message });
    }
};





const categoriesData = async (req, res) => {
    try {
        // Fetch categories with their associated subcategories
        const categories = await AppDataSource.getRepository(Category).find({
            relations: ['subCategories'] // Load subcategories for each category
        });

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error); // Log the error
        res.status(500).json({
            message: 'Failed to get categories',
            error: {
                message: error.message, // Include the error message
                stack: error.stack // Optionally include stack trace for debugging
            }
        });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    categoriesData,
};
