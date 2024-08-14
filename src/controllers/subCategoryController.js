// controllers/SubCategoryController.js

const AppDataSource = require('../config/database'); // Import your data source
const SubCategory = require('../entities/SubCategory'); // Import the SubCategory entity

// Get all subcategories
const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await AppDataSource.getRepository(SubCategory).find();
        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get subcategories', error });
    }
};

// Get a single subcategory by ID
const getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await AppDataSource.getRepository(SubCategory).findOneBy({
            id: parseInt(req.params.id)
        });
        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.status(200).json(subCategory);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get subcategory', error });
    }
};

// Create a new subcategory
const createSubCategory = async (req, res) => {
    try {
        const newSubCategory = await AppDataSource.getRepository(SubCategory).save(req.body);
        res.status(201).json(newSubCategory);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create subcategory', error });
    }
};

// Update a subcategory by ID
const updateSubCategory = async (req, res) => {
    try {
        const result = await AppDataSource.getRepository(SubCategory).update(req.params.id, req.body);
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.status(200).json({ message: 'Subcategory updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update subcategory', error });
    }
};

// Delete a subcategory by ID
const deleteSubCategory = async (req, res) => {
    try {
        const result = await AppDataSource.getRepository(SubCategory).delete(req.params.id);
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete subcategory', error });
    }
};

module.exports = {
    getAllSubCategories,
    getSubCategoryById,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
};
