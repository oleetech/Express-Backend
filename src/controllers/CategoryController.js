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
        const newCategory = await AppDataSource.getRepository(Category).save(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create category', error });
    }
};

// Update a category by ID
const updateCategory = async (req, res) => {
    try {
        const result = await AppDataSource.getRepository(Category).update(req.params.id, req.body);
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update category', error });
    }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    try {
        const result = await AppDataSource.getRepository(Category).delete(req.params.id);
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete category', error });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
