const AppDataSource = require('../config/database'); // Import your data source
const Product = require('../entities/Product'); // Import the Product entity

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await AppDataSource.getRepository(Product).find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get products', error });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await AppDataSource.getRepository(Product).findOneBy({
            id: req.params.id
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get product', error });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, specification, weight, description, color, price, category, sub_category } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Path to the uploaded image

        const newProduct = await AppDataSource.getRepository(Product).save({
            name,
            specification,
            weight,
            description,
            color,
            price,
            category,
            sub_category,
            imageUrl
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error });
    }
};

// Update a product by ID
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specification, weight, description, color, price, category, sub_category } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        const result = await AppDataSource.getRepository(Product).update(id, {
            name,
            specification,
            weight,
            description,
            color,
            price,
            category,
            sub_category,
            imageUrl
        });

        if (result.affected === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const result = await AppDataSource.getRepository(Product).delete(req.params.id);
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};

// Search products with query parameters
const searchProducts = async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice, color, weight } = req.query;

        // Create a query builder instance
        const query = AppDataSource.getRepository(Product).createQueryBuilder('product');
        
        // Add conditions based on query parameters
        if (name) {
            query.andWhere('product.name LIKE :name', { name: `%${name}%` });
        }
        if (category) {
            query.andWhere('product.categoryId = :category', { category });
        }
        if (minPrice) {
            query.andWhere('product.price >= :minPrice', { minPrice });
        }
        if (maxPrice) {
            query.andWhere('product.price <= :maxPrice', { maxPrice });
        }
        if (color) {
            query.andWhere('product.color LIKE :color', { color: `%${color}%` });
        }
        if (weight) {
            query.andWhere('product.weight LIKE :weight', { weight: `%${weight}%` });
        }
        
        // Execute the query and get the results
        const products = await query.getMany();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to search products', error });
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
};
