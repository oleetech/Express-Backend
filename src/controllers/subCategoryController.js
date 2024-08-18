// controllers/SubCategoryController.js

const AppDataSource = require('../config/database'); // Import your data source
const SubCategory = require('../entities/SubCategory'); // Import the SubCategory entity
const Category = require('../entities/Category'); // Import the SubCategory entity

// Get all subcategories
const getAllSubCategories = async (req, res) => {
    try {
        // Fetch all subcategories and include the associated category
        const subCategories = await AppDataSource.getRepository(SubCategory).find({
            relations: ['category'], // Include the category in the result
        });

        // Map through the subcategories to extract the category_id for each subcategory
        const subCategoriesWithCategoryId = subCategories.map(subCategory => ({
            id: subCategory.id,
            name: subCategory.name,
            category_id: subCategory.category.id, // Extract the category_id
            parent_category: subCategory.category.name, 
            createdAt: subCategory.createdAt,
            updatedAt: subCategory.updatedAt
        }));

        // Send the modified result with category_id included
        res.status(200).json(subCategoriesWithCategoryId);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get subcategories', error });
    }
};


// Get a single subcategory by ID
const getSubCategoryById = async (req, res) => {
    try {
        // Find the subcategory by ID and include the associated category
        const subCategory = await AppDataSource.getRepository(SubCategory).findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['category'], // Include the category in the result
        });

        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        // Return the subcategory with the associated category_id
        res.status(200).json({
            id: subCategory.id,
            name: subCategory.name,
            category_id: subCategory.category.id, // Extract the category_id
            parent_category: subCategory.category.name, 
            createdAt: subCategory.createdAt,
            updatedAt: subCategory.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get subcategory', error });
    }
};


const createSubCategory = async (req, res) => {
    try {
        const { name, category_id } = req.body; // Extract name and category_id from request body
        
        // Check if the category exists by its ID
        const categoryRepository = AppDataSource.getRepository(Category);
        const existingCategory = await categoryRepository.findOneBy({ id: category_id });

        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const subCategoryRepository = AppDataSource.getRepository(SubCategory);

        // Create a new subcategory and assign the category to it
        const newSubCategory = subCategoryRepository.create({
            name,
            category: existingCategory // Assign the found category
        });

        // Save the new subcategory to the database
        const savedSubCategory = await subCategoryRepository.save(newSubCategory);

        // Return the created subcategory along with its parent category info
        res.status(201).json({
            id: savedSubCategory.id,
            name: savedSubCategory.name,
            category_id: savedSubCategory.category.id, // Include the category_id in the response
            parent_category: savedSubCategory.category.name, 
            createdAt: savedSubCategory.createdAt,
            updatedAt: savedSubCategory.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create subcategory', error });
    }
};





const updateSubCategory = async (req, res) => {
    try {
        const subCategoryRepository = AppDataSource.getRepository(SubCategory);
        const categoryRepository = AppDataSource.getRepository(Category);

        // Find the subcategory by ID
        const subCategory = await subCategoryRepository.findOneBy({ id: req.params.id });

        // If subcategory is not found, return 404
        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        // Check if a new category_id is provided
        if (req.body.category_id) {
            // Find the category by ID from the request body
            const existingCategory = await categoryRepository.findOneBy({ id: req.body.category_id });

            // If the category is not found, return 404
            if (!existingCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            // Update the subcategory's category relationship
            subCategory.category = existingCategory;
        }

        // Merge other fields like 'name' if they are provided in the request
        subCategoryRepository.merge(subCategory, req.body);

        // Save the updated subcategory
        const updatedSubCategory = await subCategoryRepository.save(subCategory);

        // Return the updated subcategory, including category information
        res.status(200).json({
            id: updatedSubCategory.id,
            name: updatedSubCategory.name,
            category_id: updatedSubCategory.category.id, // Include the updated category_id
            parent_category: updatedSubCategory.category.name, // Include the category name
            createdAt: updatedSubCategory.createdAt,
            updatedAt: updatedSubCategory.updatedAt
        });
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
