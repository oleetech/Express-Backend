const SubCategory = require('../entities/SubCategory');

// Get all subcategories
exports.getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find();
        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving subcategories' });
    }
};

// Get subcategory by ID
exports.getSubCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const subCategory = await SubCategory.findOneBy({ id: parseInt(id) });
        if (subCategory) {
            res.status(200).json(subCategory);
        } else {
            res.status(404).json({ message: 'Subcategory not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving subcategory' });
    }
};

// Create new subcategory
exports.createSubCategory = async (req, res) => {
    const { name, category } = req.body;
    try {
        const newSubCategory = new SubCategory();
        newSubCategory.name = name;
        newSubCategory.category = category;
        await newSubCategory.save();
        res.status(201).json(newSubCategory);
    } catch (error) {
        res.status(500).json({ error: 'Error creating subcategory' });
    }
};

// Update subcategory by ID
exports.updateSubCategory = async (req, res) => {
    const { id } = req.params;
    const { name, category } = req.body;
    try {
        const subCategory = await SubCategory.findOneBy({ id: parseInt(id) });
        if (subCategory) {
            subCategory.name = name || subCategory.name;
            subCategory.category = category || subCategory.category;
            await subCategory.save();
            res.status(200).json(subCategory);
        } else {
            res.status(404).json({ message: 'Subcategory not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating subcategory' });
    }
};

// Delete subcategory by ID
exports.deleteSubCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await SubCategory.delete({ id: parseInt(id) });
        if (result.affected > 0) {
            res.status(200).json({ message: 'Subcategory deleted successfully' });
        } else {
            res.status(404).json({ message: 'Subcategory not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting subcategory' });
    }
};
