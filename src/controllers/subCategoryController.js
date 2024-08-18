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
        const subCategoryRepository = AppDataSource.getRepository(SubCategory);
        const newSubCategory = subCategoryRepository.create(req.body);
        const savedSubCategory = await subCategoryRepository.save(newSubCategory); // Save and return the saved subcategory
        res.status(201).json(savedSubCategory); // Return the created subcategory as response
    } catch (error) {
        res.status(500).json({ message: 'Failed to create subcategory', error });
    }
};


// Update a subcategory by ID
const updateSubCategory = async (req, res) => {
    try {
        const subCategoryRepository = AppDataSource.getRepository(SubCategory);
        const subCategory = await subCategoryRepository.findOneBy({ id: req.params.id });

        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        subCategoryRepository.merge(subCategory, req.body); // Merge the new data with the existing one
        const updatedSubCategory = await subCategoryRepository.save(subCategory); // Save and return the updated subcategory

        res.status(200).json(updatedSubCategory); // Return the updated subcategory as response
    } catch (error) {
        res.status(500).json({ message: 'Failed to update subcategory', error });
    }
};


// Delete a subcategory by ID and return the deleted data
const deleteSubCategory = async (req, res) => {
    try {
        const subCategoryRepository = AppDataSource.getRepository(SubCategory);
        const subCategory = await subCategoryRepository.findOneBy({ id: req.params.id });

        if (!subCategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        await subCategoryRepository.remove(subCategory); // Remove the subcategory
        res.status(200).json(subCategory); // Return the deleted subcategory
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete subcategory', details: error });
    }
};



module.exports = {
    getAllSubCategories,
    getSubCategoryById,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
};
