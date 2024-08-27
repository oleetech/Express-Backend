const AppDataSource = require('../config/database'); // Import your data source
const Product = require('../entities/Product'); 
const Category = require('../entities/Category'); 
const SubCategory = require('../entities/SubCategory');
const SubSubCategory = require('../entities/SubSubCategory'); // Import the SubSubCategory entity

// Get all products
/**
 * সমস্ত প্রোডাক্ট ফেচ করার জন্য এই ফাংশনটি ব্যবহৃত হয়।
 * @function getAllProducts
 * @description এই ফাংশনটি ডাটাবেস থেকে সমস্ত প্রোডাক্ট এবং তাদের সাথে সম্পর্কিত ক্যাটাগরি, সাবক্যাটাগরি, এবং সাব-সাবক্যাটাগরি তথ্য সংগ্রহ করে এবং তা ফরম্যাট করে রেসপন্স হিসাবে পাঠায়।
 * @route GET /api/products
 * @access Public
 * 
 * @returns {Promise<void>} - প্রমিস রিটার্ন করে যা সমস্ত প্রোডাক্ট সংগ্রহের পর রেসপন্স প্রদান করে।
 * 
 */

const getAllProducts = async (req, res) => {
    try {
        // প্রোডাক্ট এবং সংশ্লিষ্ট ক্যাটাগরি, সাবক্যাটাগরি এবং সাব-সাবক্যাটাগরি সহ সমস্ত প্রোডাক্ট ফেচ করা হচ্ছে
        const products = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .leftJoinAndSelect('product.subSubCategory', 'subSubCategory') // সাব-সাবক্যাটাগরি অন্তর্ভুক্ত করা হচ্ছে
            .getMany();

        // প্রতিটি প্রোডাক্টের সাথে সম্পর্কিত ক্যাটাগরি, সাবক্যাটাগরি, এবং সাব-সাবক্যাটাগরি তথ্য ফরম্যাট করা হচ্ছে
        const formattedProducts = products.map(product => ({
            id: product.id, // প্রোডাক্টের আইডি
            name: product.name, // প্রোডাক্টের নাম
            specification: product.specification, // প্রোডাক্টের স্পেসিফিকেশন
            knittingGauge: product.knittingGauge, // প্রোডাক্টের ওজন
            description: product.description, // প্রোডাক্টের বর্ণনা
            color: product.color, // প্রোডাক্টের রং
            price: product.price, // প্রোডাক্টের দাম
            imageUrl: product.imageUrl, // প্রোডাক্টের ইমেজ URL
            featured: product.featured, // প্রোডাক্টের ফিচার ইমেজ স্ট্যাটাস
            enquery: product.enquery, // প্রোডাক্টের ইনকোয়েরি তথ্য
            category_id: product.category ? product.category.id : null, // প্রোডাক্টের ক্যাটাগরি আইডি
            category_name: product.category ? product.category.name : null, // প্রোডাক্টের ক্যাটাগরি নাম
            subcategory_id: product.subCategory ? product.subCategory.id : null, // প্রোডাক্টের সাবক্যাটাগরি আইডি
            subcategory_name: product.subCategory ? product.subCategory.name : null, // প্রোডাক্টের সাবক্যাটাগরি নাম
            subSubCategoryId: product.subSubCategory ? product.subSubCategory.id : null, // প্রোডাক্টের সাব-সাবক্যাটাগরি আইডি
            subSubCategory: product.subSubCategory ? product.subSubCategory.name : null, // প্রোডাক্টের সাব-সাবক্যাটাগরি নাম
            createdAt: product.createdAt, // প্রোডাক্ট তৈরি হওয়ার সময়
            updatedAt: product.updatedAt // প্রোডাক্ট আপডেট হওয়ার সময়
        }));

        // ফরম্যাট করা প্রোডাক্টগুলোর তথ্য রেসপন্স হিসাবে পাঠানো হচ্ছে
        res.status(200).json(formattedProducts);
    } catch (error) {
        // প্রোডাক্ট ফেচ করার সময় কোনো সমস্যা হলে কনসোল এবং রেসপন্সে সেই ত্রুটির তথ্য প্রদর্শন করা হচ্ছে
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to get products', error });
    }
};



// Get a single product by ID
/**
 * নির্দিষ্ট আইডি অনুযায়ী একটি প্রোডাক্ট ফেচ করার জন্য এই ফাংশনটি ব্যবহৃত হয়।
 * @function getProductById
 * @description এই ফাংশনটি প্রোডাক্ট আইডি ব্যবহার করে ডাটাবেস থেকে একটি প্রোডাক্ট এবং তার সাথে সম্পর্কিত ক্যাটাগরি, সাবক্যাটাগরি, এবং সাব-সাবক্যাটাগরি তথ্য সংগ্রহ করে এবং তা রেসপন্স হিসাবে পাঠায়।
 * @route GET /api/products/:id
 * @access Public
 * 
 * @param {Object} req - HTTP রিকোয়েস্ট অবজেক্ট
 * @param {Object} res - HTTP রেসপন্স অবজেক্ট
 * 
 * @returns {Promise<void>} - প্রমিস রিটার্ন করে যা প্রোডাক্ট সংগ্রহের পর রেসপন্স প্রদান করে।
 * 
 */

const getProductById = async (req, res) => {
    try {
        // নির্দিষ্ট আইডি অনুযায়ী প্রোডাক্ট এবং সংশ্লিষ্ট ক্যাটাগরি, সাবক্যাটাগরি, এবং সাব-সাবক্যাটাগরি সহ প্রোডাক্ট ফেচ করা হচ্ছে
        const product = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .leftJoinAndSelect('product.subSubCategory', 'subSubCategory') // সাব-সাবক্যাটাগরি অন্তর্ভুক্ত করা হচ্ছে
            .where('product.id = :id', { id: req.params.id }) // প্রোডাক্টের আইডি ফিল্টার করা হচ্ছে
            .getOne(); // একটি প্রোডাক্ট ফেচ করা হচ্ছে

        // যদি প্রোডাক্ট পাওয়া না যায়
        if (!product) {
            return res.status(404).json({ message: 'Product not found' }); // প্রোডাক্ট পাওয়া না গেলে 404 স্ট্যাটাস কোড পাঠানো হচ্ছে
        }

        // রেসপন্সে প্রয়োজনীয় ফিল্ডগুলি পাঠানো হচ্ছে
        res.status(200).json({
            id: product.id, // প্রোডাক্টের আইডি
            name: product.name, // প্রোডাক্টের নাম
            specification: product.specification, // প্রোডাক্টের স্পেসিফিকেশন
            knittingGauge: product.knittingGauge, // প্রোডাক্টের ওজন
            description: product.description, // প্রোডাক্টের বর্ণনা
            color: product.color, // প্রোডাক্টের রং
            price: product.price, // প্রোডাক্টের দাম
            imageUrl: product.imageUrl, // প্রোডাক্টের ইমেজ URL
            featured: product.featured, // প্রোডাক্টের ফিচার ইমেজ স্ট্যাটাস
            enquery: product.enquery, // প্রোডাক্টের ইনকোয়েরি তথ্য
            category_name: product.category ? product.category.name : null, // প্রোডাক্টের ক্যাটাগরি নাম
            sub_category_name: product.subCategory ? product.subCategory.name : null, // প্রোডাক্টের সাবক্যাটাগরি নাম
            subSubCategory: product.subSubCategory ? product.subSubCategory.name : null, // প্রোডাক্টের সাব-সাবক্যাটাগরি নাম
            createdAt: product.createdAt, // প্রোডাক্ট তৈরি হওয়ার সময়
            updatedAt: product.updatedAt // প্রোডাক্ট আপডেট হওয়ার সময়
        });
    } catch (error) {
        // প্রোডাক্ট ফেচ করার সময় কোনো সমস্যা হলে কনসোল এবং রেসপন্সে সেই ত্রুটির তথ্য প্রদর্শন করা হচ্ছে
        res.status(500).json({ message: 'Failed to get product', error });
    }
};


// Create a new product
/**
 * নতুন প্রোডাক্ট তৈরি করার জন্য এই ফাংশনটি ব্যবহৃত হয়।
 * @function createProduct
 * @description এই ফাংশনটি প্রয়োজনীয় তথ্য ব্যবহার করে নতুন প্রোডাক্ট তৈরি করে এবং তা ডাটাবেসে সংরক্ষণ করে।
 * @route POST /api/products
 * @access Public
 * 
 * @param {Object} req - HTTP রিকোয়েস্ট অবজেক্ট
 * @param {Object} res - HTTP রেসপন্স অবজেক্ট
 * 
 * @returns {Promise<void>} - প্রমিস রিটার্ন করে যা প্রোডাক্ট তৈরি হওয়ার পর রেসপন্স প্রদান করে।

 */

const createProduct = async (req, res) => {
    try {
        // রিকোয়েস্ট থেকে প্রয়োজনীয় ডাটা সংগ্রহ করা হচ্ছে
        const { 
            name, 
            specification, 
            knittingGauge, 
            description, 
            color, 
            price, 
            category_id, 
            subcategory_id, 
            subsubcategoryId, 
            featured,   // ফিচার ইমেজ স্ট্যাটাস
            enquery         // ইনকোয়েরি তথ্য
        } = req.body;

        // যদি ফাইল আপলোড করা হয়, তাহলে ইমেজ URL তৈরি করা হচ্ছে
        const imageUrl = req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null;

        // ক্যাটাগরি, সাবক্যাটাগরি, এবং সাব-সাবক্যাটাগরি ফেচ করা হচ্ছে
        const category = await AppDataSource.getRepository(Category).findOneBy({ id: category_id });
        const subCategory = await AppDataSource.getRepository(SubCategory).findOneBy({ id: subcategory_id });
        const subSubCategory = await AppDataSource.getRepository(SubSubCategory).findOneBy({ id: subsubcategoryId });

        // যদি ক্যাটাগরি পাওয়া না যায়, তাহলে ত্রুটির বার্তা পাঠানো হচ্ছে
        if (!category) {
            return res.status(400).json({ message: 'Category not found' });
        }

        // যদি সাবক্যাটাগরি আইডি উল্লেখ করা হয় এবং তা পাওয়া না যায়
        if (subcategory_id && !subCategory) {
            return res.status(400).json({ message: 'SubCategory not found' });
        }

        // যদি সাব-সাবক্যাটাগরি আইডি উল্লেখ করা হয় এবং তা পাওয়া না যায়
        if (subsubcategoryId && !subSubCategory) {
            return res.status(400).json({ message: 'SubSubCategory not found' });
        }

        // নতুন প্রোডাক্ট তৈরি এবং সংরক্ষণ করা হচ্ছে
        const newProduct = await AppDataSource.getRepository(Product).save({
            name,
            specification,
            knittingGauge,
            description,
            color,
            price,
            category,
            subCategory,
            subSubCategory,
            imageUrl,
            featured, // ফিচার ইমেজ
            enquery       // ইনকোয়েরি
        });

        // নতুন প্রোডাক্টের সম্পূর্ণ তথ্য ফেচ করা হচ্ছে
        const savedProduct = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .leftJoinAndSelect('product.subSubCategory', 'subSubCategory')
            .where('product.id = :id', { id: newProduct.id })
            .getOne();

        // রেসপন্স ফরম্যাট করে ক্লায়েন্টকে পাঠানো হচ্ছে
        res.status(201).json({
            id: savedProduct.id,
            name: savedProduct.name,
            specification: savedProduct.specification,
            knittingGauge: savedProduct.knittingGauge,
            description: savedProduct.description,
            color: savedProduct.color,
            price: savedProduct.price,
            imageUrl: savedProduct.imageUrl,
            featured: savedProduct.featured, 
            enquery: savedProduct.enquery, 
            category_id: savedProduct.category ? savedProduct.category.id : null,
            category_name: savedProduct.category ? savedProduct.category.name : null,
            subcategory_id: savedProduct.subCategory ? savedProduct.subCategory.id : null,
            subcategory_name: savedProduct.subCategory ? savedProduct.subCategory.name : null,
            subsubcategory_id: savedProduct.subSubCategory ? savedProduct.subSubCategory.id : null, 
            subSubCategory: savedProduct.subSubCategory ? savedProduct.subSubCategory.name : null, 
            createdAt: savedProduct.createdAt,
            updatedAt: savedProduct.updatedAt
        });
    } catch (error) {
        // কোনো ত্রুটি হলে তা কনসোলে লগ করা হচ্ছে এবং ক্লায়েন্টকে ত্রুটির বার্তা পাঠানো হচ্ছে
        res.status(500).json({ message: 'Failed to create product', error });
    }
};


// Update a product by ID
/**
 * প্রোডাক্ট আপডেট করার জন্য এই ফাংশনটি ব্যবহৃত হয়।
 * @function updateProduct
 * @description এই ফাংশনটি একটি বিদ্যমান প্রোডাক্ট আপডেট করে এবং নতুন তথ্য ডাটাবেসে সংরক্ষণ করে।
 * @route PUT /api/products/:id
 * @access Public
 * 
 * @param {Object} req - HTTP রিকোয়েস্ট অবজেক্ট
 * @param {Object} res - HTTP রেসপন্স অবজেক্ট
 * 
 * @returns {Promise<void>} - প্রমিস রিটার্ন করে যা প্রোডাক্ট আপডেট হওয়ার পর রেসপন্স প্রদান করে।
 * 
 */

const updateProduct = async (req, res) => {
    try {
        // প্রোডাক্ট আইডি রিকোয়েস্ট প্যারামস থেকে নেওয়া হচ্ছে
        const { id } = req.params;
        const { 
            name, 
            specification, 
            knittingGauge, 
            description, 
            color, 
            price, 
            category_id, 
            subcategory_id, 
            subsubcategoryId,  // সাব-সাবক্যাটাগরি আইডি
            featured,       // ফিচার ইমেজ স্ট্যাটাস
            enquery             // ইনকোয়েরি তথ্য
        } = req.body;

        // বিদ্যমান প্রোডাক্ট ফেচ করা হচ্ছে
        const existingProduct = await AppDataSource.getRepository(Product).findOneBy({ id });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // যদি নতুন ফাইল আপলোড করা না হয়, তাহলে বিদ্যমান ইমেজ URL ব্যবহার করা হচ্ছে
        const imageUrl = req.file 
            ? `http://${req.headers.host}/uploads/${req.file.filename}` 
            : existingProduct.imageUrl;

        // ক্যাটাগরি, সাবক্যাটাগরি, এবং সাব-সাবক্যাটাগরি ফেচ করা হচ্ছে
        const category = await AppDataSource.getRepository(Category).findOneBy({ id: category_id });
        const subCategory = await AppDataSource.getRepository(SubCategory).findOneBy({ id: subcategory_id });
        const subSubCategory = await AppDataSource.getRepository(SubSubCategory).findOneBy({ id: subsubcategoryId });  // সাব-সাবক্যাটাগরি ফেচ

        // নিশ্চিত করা হচ্ছে যে, ক্যাটাগরি পাওয়া গেছে
        if (category_id && !category) {
            return res.status(400).json({ message: 'Category not found' });
        }

        // নিশ্চিত করা হচ্ছে যে, সাবক্যাটাগরি পাওয়া গেছে
        if (subcategory_id && !subCategory) {
            return res.status(400).json({ message: 'SubCategory not found' });
        }

        // নিশ্চিত করা হচ্ছে যে, সাব-সাবক্যাটাগরি পাওয়া গেছে
        if (subsubcategoryId && !subSubCategory) {  // সাব-সাবক্যাটাগরি চেক করা হচ্ছে
            return res.status(400).json({ message: 'SubSubCategory not found' });
        }

        // প্রোডাক্ট আপডেট করা হচ্ছে
        const result = await AppDataSource.getRepository(Product).update(id, {
            name,
            specification,
            knittingGauge,
            description,
            color,
            price,
            category,
            subCategory,
            subSubCategory, // সাব-সাবক্যাটাগরি অন্তর্ভুক্ত করা হচ্ছে
            imageUrl,
            featured, // ফিচার ইমেজ স্ট্যাটাস
            enquery       // ইনকোয়েরি তথ্য
        });

        // যদি কোনো প্রোডাক্ট আপডেট না হয়, তাহলে ত্রুটির বার্তা পাঠানো হচ্ছে
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // আপডেটেড প্রোডাক্টের সম্পূর্ণ তথ্য ফেচ করা হচ্ছে
        const updatedProduct = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory')
            .leftJoinAndSelect('product.subSubCategory', 'subSubCategory')
            .where('product.id = :id', { id: id })
            .getOne();

        // রেসপন্স ফরম্যাট করে ক্লায়েন্টকে পাঠানো হচ্ছে
        res.status(200).json({
            id: updatedProduct.id,
            name: updatedProduct.name,
            specification: updatedProduct.specification,
            knittingGauge: updatedProduct.knittingGauge,
            description: updatedProduct.description,
            color: updatedProduct.color,
            price: updatedProduct.price,
            imageUrl: updatedProduct.imageUrl,
            featured: updatedProduct.featured, // ফিচার ইমেজ স্ট্যাটাস
            enquery: updatedProduct.enquery, // ইনকোয়েরি তথ্য
            category_id: updatedProduct.category ? updatedProduct.category.id : null,
            category_name: updatedProduct.category ? updatedProduct.category.name : null,
            subcategory_id: updatedProduct.subCategory ? updatedProduct.subCategory.id : null,
            subcategory_name: updatedProduct.subCategory ? updatedProduct.subCategory.name : null,
            subsubcategory_id: updatedProduct.subSubCategory ? updatedProduct.subSubCategory.id : null, 
            subSubCategory: updatedProduct.subSubCategory ? updatedProduct.subSubCategory.name : null, 
            createdAt: updatedProduct.createdAt,
            updatedAt: updatedProduct.updatedAt
        });
    } catch (error) {
        // কোনো ত্রুটি হলে তা কনসোলে লগ করা হচ্ছে এবং ক্লায়েন্টকে ত্রুটির বার্তা পাঠানো হচ্ছে
        res.status(500).json({ message: 'Failed to update product', error });
    }
};



// Delete a product by ID
/**
 * একটি প্রোডাক্ট মুছে ফেলার জন্য এই ফাংশনটি ব্যবহৃত হয়।
 * @function deleteProduct
 * @description এই ফাংশনটি একটি প্রোডাক্ট মুছে দেয় যা নির্দিষ্ট আইডি দ্বারা চিহ্নিত।
 * @route DELETE /api/products/:id
 * @access Public
 * 
 * @param {Object} req - HTTP রিকোয়েস্ট অবজেক্ট
 * @param {Object} res - HTTP রেসপন্স অবজেক্ট
 * 
 * @returns {Promise<void>} - প্রমিস রিটার্ন করে যা প্রোডাক্ট সফলভাবে মুছে ফেলা হলে রেসপন্স প্রদান করে।
 * 
 */

const deleteProduct = async (req, res) => {
    try {
        // প্রোডাক্টের আইডি রিকোয়েস্ট প্যারামস থেকে নেওয়া হচ্ছে
        const { id } = req.params;

        // প্রোডাক্ট ফেচ করা হচ্ছে আইডি দ্বারা
        const product = await AppDataSource.getRepository(Product).findOneBy({ id });

        // যদি প্রোডাক্ট পাওয়া না যায়, তাহলে ত্রুটির বার্তা পাঠানো হচ্ছে
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // প্রোডাক্ট মুছে ফেলা হচ্ছে
        await AppDataSource.getRepository(Product).delete(id);

        // সফলভাবে মুছে ফেলার বার্তা পাঠানো হচ্ছে
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        // কোনো ত্রুটি হলে তা কনসোলে লগ করা হচ্ছে এবং ক্লায়েন্টকে ত্রুটির বার্তা পাঠানো হচ্ছে
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};


/**
 * প্রোডাক্টের ফিচার ইমেজ আপডেট করার জন্য এই মেথডটি ব্যবহৃত হয়।
 * @route PUT /api/products/update-feature-image
 * @description একটি বা একাধিক প্রোডাক্টের ফিচার ইমেজ স্ট্যাটাস আপডেট করে।
 * @access Public
 * 
 */


const updateFeatured = async (req, res) => {
    try {
        const { ids, featured } = req.body;
        console.log(ids, featured);

        // Check if ids is an array and is not empty
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty IDs array' });
        }

        // Ensure that all items in the ids array are numbers (or convert them if needed)
        const numericIds = ids.map(id => {
            if (typeof id !== 'number') {
                const parsedId = parseInt(id, 10);
                if (isNaN(parsedId)) {
                    return null; // Return null for invalid IDs
                }
                return parsedId; // Convert to number if valid
            }
            return id; // Already a number
        }).filter(id => id !== null); // Remove any invalid IDs

        // Log the numeric IDs for debugging
        console.log('Processed Numeric IDs:', numericIds);

        // Perform the update
        const updateResult = await AppDataSource.getRepository(Product)
            .createQueryBuilder()
            .update(Product)
            .set({ featured }) // Update the featured status
            .whereInIds(numericIds) // Match products by numeric IDs
            .execute();

        // Log update result
        console.log('Update Result:', updateResult);

        // Check if any rows were affected
        if (updateResult.affected === 0) {
            return res.status(404).json({ message: 'No products found for the given IDs' });
        }

        // Fetch the updated products
        const updatedProducts = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .whereInIds(numericIds)
            .getMany();

        // Log updated products
        console.log('Updated Products:', updatedProducts);

        // Respond with updated products
        res.status(200).json({ updatedProducts });

    } catch (error) {
        // Log error
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Failed to update featured status', error });
    }
};



// Controller method to update the featured status of a single product
const updateSingleFeatured = async (req, res) => {
    try {
        // Extracting product ID and featured status from the request body
        const { id, featured } = req.body;
        console.log(id, featured);

        // Validate ID and featured values
        if (typeof id !== 'number' || typeof featured !== 'boolean') {
            return res.status(400).json({ message: 'Invalid ID or featured value' });
        }

        // Perform the update
        const updateResult = await AppDataSource.getRepository(Product)
            .createQueryBuilder()
            .update(Product)
            .set({ featured }) // Update the featured status
            .where("id = :id", { id }) // Match product by the given ID
            .execute();

        // Check if any rows were affected
        if (updateResult.affected === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Fetch the updated product
        const updatedProduct = await AppDataSource.getRepository(Product)
            .createQueryBuilder('product')
            .where("id = :id", { id })
            .getOne();

        // Respond with the updated product
        res.status(200).json({ updatedProduct });

    } catch (error) {
        // Log error
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Failed to update featured status', error });
    }
};








module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFeatured,
    updateSingleFeatured
};
