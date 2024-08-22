const AppDataSource = require('../config/database'); // Import your data source
const Product = require('../entities/Product'); // Import the Product entity
const Category = require('../entities/Category'); // Import the Category entity
const SubCategory = require('../entities/SubCategory'); // Import the SubCategory entity
// Get all products
const getAllProducts = async (req, res) => {
    try {
        // Fetch products with related category and sub-category
        const products = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .getMany();

        // Map the results to only include the desired fields
        const result = products.map(product => ({
            id: product.id,
            name: product.name,
            specification: product.specification,
            weight: product.weight,
            description: product.description,
            color: product.color,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category ? product.category.name : null,
            sub_category: product.subCategory ? product.subCategory.name : null,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get products', error });
    }
};


// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        // Fetch a single product by ID with related category and sub-category
        const product = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
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
            category: product.category ? product.category.name : null,
            sub_category: product.subCategory ? product.subCategory.name : null,
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
        const { name, specification, weight, description, color, price, category_id, sub_category_id } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Path to the uploaded image

        // Fetch repositories
        const categoryRepository = AppDataSource.getRepository(Category);
        const subCategoryRepository = AppDataSource.getRepository(SubCategory);
        
        // Check if category_id is provided and valid
        let category = null;
        if (category_id) {
            category = await categoryRepository.findOneBy({ id: category_id });
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
        }

        // Check if sub_category_id is provided and valid
        let subCategory = null;
        if (sub_category_id) {
            subCategory = await subCategoryRepository.findOneBy({ id: sub_category_id });
            if (!subCategory) {
                return res.status(404).json({ message: 'Sub-category not found' });
            }
        }

        // Create a new product and assign the category and sub-category if they are valid
        const newProduct = AppDataSource.getRepository(Product).create({
            name,
            specification,
            weight,
            description,
            color,
            price,
            category,       // Assign the found category or null
            subCategory,   // Assign the found sub-category or null
            imageUrl
        });

        // Save the new product to the database
        const savedProduct = await AppDataSource.getRepository(Product).save(newProduct);

        // Return the created product along with its category and sub-category info
        res.status(201).json({
            id: savedProduct.id,
            name: savedProduct.name,
            specification: savedProduct.specification,
            weight: savedProduct.weight,
            description: savedProduct.description,
            color: savedProduct.color,
            price: savedProduct.price,
            category_id: savedProduct.category ? savedProduct.category.id : null,
            sub_category_id: savedProduct.subCategory ? savedProduct.subCategory.id : null,
            imageUrl: savedProduct.imageUrl,
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
        const { name, specification, weight, description, color, price, category_id, sub_category_id } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        // Fetch the existing product from the database
        const productRepository = AppDataSource.getRepository(Product);
        const product = await productRepository.findOneBy({ id });

        // If product is not found, return 404
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if category_id is provided and valid
        if (category_id) {
            const categoryRepository = AppDataSource.getRepository(Category);
            const category = await categoryRepository.findOneBy({ id: category_id });
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            product.category = category;
        }

        // Check if sub_category_id is provided and valid
        if (sub_category_id) {
            const subCategoryRepository = AppDataSource.getRepository(SubCategory);
            const subCategory = await subCategoryRepository.findOneBy({ id: sub_category_id });
            if (!subCategory) {
                return res.status(404).json({ message: 'Sub-category not found' });
            }
            product.subCategory = subCategory;
        }

        // Update the product fields
        product.name = name || product.name;
        product.specification = specification || product.specification;
        product.weight = weight || product.weight;
        product.description = description || product.description;
        product.color = color || product.color;
        product.price = price || product.price;
        product.imageUrl = imageUrl || product.imageUrl;

        // Save the updated product
        await productRepository.save(product);

        // Return the updated product
        res.status(200).json({
            id: product.id,
            name: product.name,
            specification: product.specification,
            weight: product.weight,
            description: product.description,
            color: product.color,
            price: product.price,
            category_id: product.category ? product.category.id : null,
            sub_category_id: product.subCategory ? product.subCategory.id : null,
            imageUrl: product.imageUrl,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        });
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

// Search products by color
const searchProducts = async (req, res) => {
    try {
        // Extract search parameters from the query string
        const { color, price, name, category, sub_category } = req.query;

        // Initialize the query builder
        const queryBuilder = AppDataSource.getRepository(Product).createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory');

        // Add conditions to the query if parameters are provided
        if (color) {
            queryBuilder.andWhere('product.color = :color', { color: color.trim() });
        }

        if (price) {
            queryBuilder.andWhere('product.price = :price', { price: price.trim() });
        }

        if (name) {
            queryBuilder.andWhere('product.name LIKE :name', { name: `%${name.trim()}%` });
        }

        if (category) {
            queryBuilder.andWhere('category.name = :category', { category: category.trim() });
        }

        if (sub_category) {
            queryBuilder.andWhere('subCategory.name = :sub_category', { sub_category: sub_category.trim() });
        }

        // Debug: Output the generated SQL query
        console.log(queryBuilder.getSql());

        // Execute the query and fetch the results
        const products = await queryBuilder.getMany();

        // Check if any products were found
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        // Map the results to include desired fields
        const result = products.map(product => ({
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
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));

        res.status(200).json(result);
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
