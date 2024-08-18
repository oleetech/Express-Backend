// controllers/CategoryController.js

const AppDataSource = require('../config/database'); // Import your data source
const Category = require('../entities/Category'); // Import the Category entity

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
// Delete a category by ID and return the deleted data
const deleteCategory = async (req, res) => {
    try {
        const categoryRepository = AppDataSource.getRepository(Category);
        const category = await categoryRepository.findOneBy({ id: req.params.id });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await categoryRepository.remove(category); // Remove the category
        res.status(200).json(category); // Return the deleted category
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category', details: error });
    }
};


module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
