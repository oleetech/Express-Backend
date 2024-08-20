const AppDataSource = require('../config/database'); // Import your data source
const Product = require('../entities/Product'); 
const Category = require('../entities/Category'); 
const SubCategory = require('../entities/SubCategory'); 

// Get all products
const getAllProducts = async (req, res) => {
    try {
        // Fetch all products with related category and subcategory
        const products = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .getMany();

        // Debugging: Check if products are fetched correctly
        console.log('Fetched Products:', products);

        // Format the response to include category and subcategory details for each product
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
            category_name: product.category ? product.category.name : null,
            sub_category_name: product.subCategory ? product.subCategory.name : null,
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
        const { name, specification, weight, description, color, price, category_id, subcategory_id } = req.body;
        const imageUrl = req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null;

        // Fetch the Category and SubCategory entities
        const category = await AppDataSource.getRepository(Category).findOneBy({ id: category_id });
        const subCategory =  await AppDataSource.getRepository(SubCategory).findOneBy({ id: subcategory_id }) ;

        // Debugging: Check if category and subCategory are fetched correctly
        console.log('Fetched Category:', category);
        console.log('Fetched SubCategory:', subCategory);

        if (!category) {
            return res.status(400).json({ message: 'Category not found' });
        }

        // SubCategory is optional; check if it exists
        if (subcategory_id && !subCategory) {
            return res.status(400).json({ message: 'SubCategory not found' });
        }

        // Create and save the new product
        const newProduct = await AppDataSource.getRepository(Product).save({
            name,
            specification,
            weight,
            description,
            color,
            price,
            category, // Pass the Category entity
            subCategory, // Pass the SubCategory entity
            imageUrl
        });

        // Fetch the product with full details
        const savedProduct = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .where('product.id = :id', { id: newProduct.id })
            .getOne();

        // Format the response to include category and subcategory details
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
        const { name, specification, weight, description, color, price, category_id, subcategory_id } = req.body;
        const imageUrl = req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null; // Use server URL

        // Fetch the Category and SubCategory entities
        const category = await AppDataSource.getRepository(Category).findOneBy({ id: category_id }) ;
        const subCategory =  await AppDataSource.getRepository(SubCategory).findOneBy({ id: subcategory_id }) ;

        // Debugging: Check if category and subCategory are fetched correctly
        console.log('Fetched Category:', category);
        console.log('Fetched SubCategory:', subCategory);

        // Ensure that the category exists if provided
        if (category_id && !category) {
            return res.status(400).json({ message: 'Category not found' });
        }

        // Ensure that the subCategory exists if provided
        if (subcategory_id && !subCategory) {
            return res.status(400).json({ message: 'SubCategory not found' });
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
            .where('product.id = :id', { id })
            .getOne();

        // Format the response to include category and subcategory details
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
        const color = req.query.color; // Get the color from query params

        if (!color) {
            return res.status(400).json({ message: 'Color query parameter is required' });
        }

        // Search for products by color
        const products = await AppDataSource.getRepository(Product).find({
            where: {
                color: color
            }
        });

        // Check if any products were found
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found with the specified color' });
        }

        // Return the found products
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
