const AppDataSource = require('../config/database'); // Import your data source
const Product = require('../entities/Product'); 
const Category = require('../entities/Category'); 
const SubCategory = require('../entities/SubCategory');
const SubSubCategory = require('../entities/SubSubCategory'); // Import the SubSubCategory entity

// Get all products
const getAllProducts = async (req, res) => {
    try {
        // Fetch all products with related category, subcategory, and subsubcategory
        const products = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .leftJoinAndSelect('product.subSubCategory', 'subSubCategory') // Include SubSubCategory
            .getMany();

        // Format the response to include category, subcategory, and subsubcategory details for each product
        const formattedProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            specification: product.specification,
            weight: product.weight,
            description: product.description,
            color: product.color,
            price: product.price,
            imageUrl: product.imageUrl,
            category_id: product.category ? product.category.id : null,
            category_name: product.category ? product.category.name : null,
            subcategory_id: product.subCategory ? product.subCategory.id : null,
            subcategory_name: product.subCategory ? product.subCategory.name : null,
            subsubcategory_id: product.subSubCategory ? product.subSubCategory.id : null, // Include SubSubCategory ID
            subsubcategory_name: product.subSubCategory ? product.subSubCategory.name : null, // Include SubSubCategory Name
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));

        res.status(200).json(formattedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to get products', error });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        // Fetch a single product by ID with related category, sub-category, and sub-sub-category
        const product = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .leftJoinAndSelect('product.subSubCategory', 'subSubCategory') // Include SubSubCategory
            .where('product.id = :id', { id: req.params.id })
            .getOne();

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return only the desired fields
        res.status(200).json({
            id: product.id,
            name: product.name,
            specification: product.specification,
            weight: product.weight,
            description: product.description,
            color: product.color,
            price: product.price,
            imageUrl: product.imageUrl,
            category_name: product.category ? product.category.name : null,
            sub_category_name: product.subCategory ? product.subCategory.name : null,
            sub_subcategory_name: product.subSubCategory ? product.subSubCategory.name : null, // Include SubSubCategory Name
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get product', error });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, specification, weight, description, color, price, category_id, subcategory_id, subsubcategory_id } = req.body;
        const imageUrl = req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null;

        // Fetch the Category, SubCategory, and SubSubCategory entities
        const category = await AppDataSource.getRepository(Category).findOneBy({ id: category_id });
        const subCategory = await AppDataSource.getRepository(SubCategory).findOneBy({ id: subcategory_id });
        const subSubCategory = await AppDataSource.getRepository(SubSubCategory).findOneBy({ id: subsubcategory_id }); // Fetch SubSubCategory

        if (!category) {
            return res.status(400).json({ message: 'Category not found' });
        }

        if (subcategory_id && !subCategory) {
            return res.status(400).json({ message: 'SubCategory not found' });
        }

        if (subsubcategory_id && !subSubCategory) {
            return res.status(400).json({ message: 'SubSubCategory not found' });
        }

        // Create and save the new product
        const newProduct = await AppDataSource.getRepository(Product).save({
            name,
            specification,
            weight,
            description,
            color,
            price,
            category,
            subCategory,
            subSubCategory, // Include SubSubCategory
            imageUrl
        });

        // Fetch the product with full details
        const savedProduct = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .leftJoinAndSelect('product.subSubCategory', 'subSubCategory') // Include SubSubCategory
            .where('product.id = :id', { id: newProduct.id })
            .getOne();

        // Format the response to include category, subcategory, and subsubcategory details
        res.status(201).json({
            id: savedProduct.id,
            name: savedProduct.name,
            specification: savedProduct.specification,
            weight: savedProduct.weight,
            description: savedProduct.description,
            color: savedProduct.color,
            price: savedProduct.price,
            imageUrl: savedProduct.imageUrl,
            category_id: savedProduct.category ? savedProduct.category.id : null,
            category_name: savedProduct.category ? savedProduct.category.name : null,
            subcategory_id: savedProduct.subCategory ? savedProduct.subCategory.id : null,
            subcategory_name: savedProduct.subCategory ? savedProduct.subCategory.name : null,
            subsubcategory_id: savedProduct.subSubCategory ? savedProduct.subSubCategory.id : null, // Include SubSubCategory ID
            subsubcategory_name: savedProduct.subSubCategory ? savedProduct.subSubCategory.name : null, // Include SubSubCategory Name
            createdAt: savedProduct.createdAt,
            updatedAt: savedProduct.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error });
    }
};

// Update a product by ID
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specification, weight, description, color, price, category_id, subcategory_id, subsubcategory_id } = req.body;

        // Fetch the existing product to get the current imageUrl
        const existingProduct = await AppDataSource.getRepository(Product).findOneBy({ id });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Use the existing imageUrl if no new file is provided
        const imageUrl = req.file 
            ? `http://${req.headers.host}/uploads/${req.file.filename}` 
            : existingProduct.imageUrl;

        // Fetch the Category, SubCategory, and SubSubCategory entities
        const category = await AppDataSource.getRepository(Category).findOneBy({ id: category_id });
        const subCategory = await AppDataSource.getRepository(SubCategory).findOneBy({ id: subcategory_id });
        const subSubCategory = await AppDataSource.getRepository(SubSubCategory).findOneBy({ id: subsubcategory_id }); // Fetch SubSubCategory

        // Ensure that the category exists if provided
        if (category_id && !category) {
            return res.status(400).json({ message: 'Category not found' });
        }

        // Ensure that the subCategory exists if provided
        if (subcategory_id && !subCategory) {
            return res.status(400).json({ message: 'SubCategory not found' });
        }

        // Ensure that the subSubCategory exists if provided
        if (subsubcategory_id && !subSubCategory) {
            return res.status(400).json({ message: 'SubSubCategory not found' });
        }

        // Update the product
        const result = await AppDataSource.getRepository(Product).update(id, {
            name,
            specification,
            weight,
            description,
            color,
            price,
            category,
            subCategory,
            subSubCategory, // Include SubSubCategory
            imageUrl
        });

        if (result.affected === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Fetch the updated product with full details
        const updatedProduct = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .leftJoinAndSelect('product.subSubCategory', 'subSubCategory') // Include SubSubCategory
            .where('product.id = :id', { id: id })
            .getOne();

        // Format the response to include category, subcategory, and subsubcategory details
        res.status(200).json({
            id: updatedProduct.id,
            name: updatedProduct.name,
            specification: updatedProduct.specification,
            weight: updatedProduct.weight,
            description: updatedProduct.description,
            color: updatedProduct.color,
            price: updatedProduct.price,
            imageUrl: updatedProduct.imageUrl,
            category_id: updatedProduct.category ? updatedProduct.category.id : null,
            category_name: updatedProduct.category ? updatedProduct.category.name : null,
            subcategory_id: updatedProduct.subCategory ? updatedProduct.subCategory.id : null,
            subcategory_name: updatedProduct.subCategory ? updatedProduct.subCategory.name : null,
            subsubcategory_id: updatedProduct.subSubCategory ? updatedProduct.subSubCategory.id : null, // Include SubSubCategory ID
            subsubcategory_name: updatedProduct.subSubCategory ? updatedProduct.subSubCategory.name : null, // Include SubSubCategory Name
            createdAt: updatedProduct.createdAt,
            updatedAt: updatedProduct.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await AppDataSource.getRepository(Product).findOneBy({ id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await AppDataSource.getRepository(Product).delete(id);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
