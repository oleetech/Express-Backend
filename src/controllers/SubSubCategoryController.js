// controllers/SubSubCategoryController.js

const AppDataSource = require('../config/database'); // Import your data source
const SubSubCategory = require('../entities/SubSubCategory'); // Import the SubSubCategory entity
const SubCategory = require('../entities/SubCategory'); // Import the SubCategory entity
const Product = require('../entities/Product'); // Import the Product entity
const Category = require('../entities/Category');

// Get all sub-subcategories
const getAllSubSubCategories = async (req, res) => {
    try {
        const subSubCategories = await AppDataSource.getRepository(SubSubCategory).find({
            relations: ['subCategory', 'subCategory.category'], // Include subCategory and its category
        });

        const subSubCategoriesWithDetails = subSubCategories.map(subSubCategory => ({
            id: subSubCategory.id,
            name: subSubCategory.name,
            subCategory: subSubCategory.subCategory.name, 
            subCategoryId: subSubCategory.subCategory.id, 

            category: subSubCategory.subCategory.category.name, 
            categoryId: subSubCategory.subCategory.category.id, 

            createdAt: subSubCategory.createdAt,
            updatedAt: subSubCategory.updatedAt
        }));

        res.status(200).json(subSubCategoriesWithDetails);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get sub-subcategories', error });
    }
};

// Get a single sub-subcategory by ID
const getSubSubCategoryById = async (req, res) => {
    try {
        const subSubCategory = await AppDataSource.getRepository(SubSubCategory).findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['subCategory', 'subCategory.category'], // Include subCategory and its category
        });

        if (!subSubCategory) {
            return res.status(404).json({ message: 'SubSubCategory not found' });
        }

        res.status(200).json({
            id: subSubCategory.id,
            name: subSubCategory.name,
            subCategory: subSubCategory.subCategory.name, 
            subCategoryId: subSubCategory.subCategory.id, 

            category: subSubCategory.subCategory.category.name, 
            categoryId: subSubCategory.subCategory.category.id, 
            createdAt: subSubCategory.createdAt,
            updatedAt: subSubCategory.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get sub-subcategory', error });
    }
};


// Create a new sub-subcategory
const createSubSubCategory = async (req, res) => {
    try {
        const { name, subCategoryId } = req.body;

        const subCategoryRepository = AppDataSource.getRepository(SubCategory);
        const existingSubCategory = await subCategoryRepository.findOne({
            where: { id: subCategoryId },
            relations: ['category'] 
        });

        if (!existingSubCategory) {
            return res.status(404).json({ message: 'SubCategory not found' });
        }

        const subSubCategoryRepository = AppDataSource.getRepository(SubSubCategory);
        const newSubSubCategory = subSubCategoryRepository.create({
            name,
            subCategory: existingSubCategory
        });

        const savedSubSubCategory = await subSubCategoryRepository.save(newSubSubCategory);

        res.status(201).json({
            id: savedSubSubCategory.id,
            name: savedSubSubCategory.name,
            subCategory: savedSubSubCategory.subCategory.name, 
            subCategoryId: savedSubSubCategory.subCategory.id, 

            category: savedSubSubCategory.subCategory.category.name, 
            categoryId: savedSubSubCategory.subCategory.category.id, 
            createdAt: savedSubSubCategory.createdAt,
            updatedAt: savedSubSubCategory.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create sub-subcategory', error });
    }
};


// Update a sub-subcategory
const updateSubSubCategory = async (req, res) => {
    try {
        const subSubCategoryRepository = AppDataSource.getRepository(SubSubCategory);
        const subCategoryRepository = AppDataSource.getRepository(SubCategory);

        // Find the existing SubSubCategory
        const subSubCategory = await subSubCategoryRepository.findOne({
            where: { id: req.params.id },
            relations: ['subCategory', 'subCategory.category'] // Include subCategory and its category
        });

        if (!subSubCategory) {
            return res.status(404).json({ message: 'SubSubCategory not found' });
        }

        // Update SubCategory if subCategoryId is provided
        if (req.body.subCategoryId) {
            const existingSubCategory = await subCategoryRepository.findOne({
                where: { id: req.body.subCategoryId },
                relations: ['category'] // Include the category relation
            });

            if (!existingSubCategory) {
                return res.status(404).json({ message: 'SubCategory not found' });
            }

            subSubCategory.subCategory = existingSubCategory;
        }

        console.log(req.body.subCategoryId, req.body.name)
        // Merge the updated fields
        subSubCategoryRepository.merge(subSubCategory, req.body);

        // Save the updated SubSubCategory
        const updatedSubSubCategory = await subSubCategoryRepository.save(subSubCategory);

        // Return the updated details including main category and sub-category names
        res.status(200).json({
            id: updatedSubSubCategory.id,
            name: updatedSubSubCategory.name,

            subCategory: updatedSubSubCategory.subCategory.name, 
            subCategoryId: updatedSubSubCategory.subCategory.id, 

            category: updatedSubSubCategory.subCategory.category.name, 
            categoryId: updatedSubSubCategory.subCategory.category.id,



            createdAt: updatedSubSubCategory.createdAt,
            updatedAt: updatedSubSubCategory.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update sub-subcategory', error });
    }
};


// Delete a sub-subcategory by ID
const deleteSubSubCategory = async (req, res) => {
    try {
        const subSubCategoryRepository = AppDataSource.getRepository(SubSubCategory);
        const productRepository = AppDataSource.getRepository(Product);

        // Find the SubSubCategory by ID
        const subSubCategory = await subSubCategoryRepository.findOne({
            where: { id: req.params.id },
            relations: ['subCategory', 'subCategory.category'] // Ensure relations are included
        });

        if (!subSubCategory) {
            return res.status(404).json({ error: 'SubSubCategory not found' });
        }

        // Check if there are linked products
        const linkedProducts = await productRepository.find({
            where: { subSubCategory: { id: req.params.id } }
        });

        if (linkedProducts.length > 0) {
            return res.status(400).json({ error: 'Cannot delete sub-subcategory because it is linked to one or more products' });
        }

        // Remove the SubSubCategory
        await subSubCategoryRepository.remove(subSubCategory);

        // Respond with details of the deleted SubSubCategory
        res.status(200).json({
            id: subSubCategory.id,
            name: subSubCategory.name,
            subCategory: subSubCategory.subCategory.name, 
            subCategoryId: subSubCategory.subCategory.id, 

            category: subSubCategory.subCategory.category.name, 
            categoryId: subSubCategory.subCategory.category.id, 
            createdAt: subSubCategory.createdAt,
            updatedAt: subSubCategory.updatedAt
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete sub-subcategory', details: error.message });
    }
};


module.exports = {
    getAllSubSubCategories,
    getSubSubCategoryById,
    createSubSubCategory,
    updateSubSubCategory,
    deleteSubSubCategory
};