// controllers/SubSubCategoryController.js

const AppDataSource = require('../config/database'); // Import your data source
const SubSubCategory = require('../entities/SubSubCategory'); // Import the SubSubCategory entity
const SubCategory = require('../entities/SubCategory'); // Import the SubCategory entity
const Product = require('../entities/Product'); // Import the Product entity

// Get all sub-subcategories
const getAllSubSubCategories = async (req, res) => {
    try {
        const subSubCategories = await AppDataSource.getRepository(SubSubCategory).find({
            relations: ['subCategory'], // Include the subCategory in the result
        });

        const subSubCategoriesWithDetails = subSubCategories.map(subSubCategory => ({
            id: subSubCategory.id,
            name: subSubCategory.name,
            sub_category_id: subSubCategory.subCategory.id, // Extract the subCategory_id
            parent_sub_category: subSubCategory.subCategory.name,
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
            relations: ['subCategory'], // Include the subCategory in the result
        });

        if (!subSubCategory) {
            return res.status(404).json({ message: 'SubSubCategory not found' });
        }

        res.status(200).json({
            id: subSubCategory.id,
            name: subSubCategory.name,
            sub_category_id: subSubCategory.subCategory.id, // Extract the subCategory_id
            parent_sub_category: subSubCategory.subCategory.name,
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
        const { name, sub_category_id } = req.body;

        const subCategoryRepository = AppDataSource.getRepository(SubCategory);
        const existingSubCategory = await subCategoryRepository.findOneBy({ id: sub_category_id });

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
            sub_category_id: savedSubSubCategory.subCategory.id,
            parent_sub_category: savedSubSubCategory.subCategory.name,
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

        const subSubCategory = await subSubCategoryRepository.findOneBy({ id: req.params.id });

        if (!subSubCategory) {
            return res.status(404).json({ message: 'SubSubCategory not found' });
        }

        if (req.body.sub_category_id) {
            const existingSubCategory = await subCategoryRepository.findOneBy({ id: req.body.sub_category_id });

            if (!existingSubCategory) {
                return res.status(404).json({ message: 'SubCategory not found' });
            }

            subSubCategory.subCategory = existingSubCategory;
        }

        subSubCategoryRepository.merge(subSubCategory, req.body);

        const updatedSubSubCategory = await subSubCategoryRepository.save(subSubCategory);

        res.status(200).json({
            id: updatedSubSubCategory.id,
            name: updatedSubSubCategory.name,
            sub_category_id: updatedSubSubCategory.subCategory.id,
            parent_sub_category: updatedSubSubCategory.subCategory.name,
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

        const subSubCategory = await subSubCategoryRepository.findOneBy({ id: req.params.id });

        if (!subSubCategory) {
            return res.status(404).json({ error: 'SubSubCategory not found' });
        }

        const linkedProducts = await productRepository.find({ where: { subSubCategory: { id: req.params.id } } });

        if (linkedProducts.length > 0) {
            return res.status(400).json({ error: 'Cannot delete sub-subcategory because it is linked to one or more products' });
        }

        await subSubCategoryRepository.remove(subSubCategory);

        res.status(200).json(subSubCategory);
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
