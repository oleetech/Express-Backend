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
 * @example JSON রেসপন্স:
 * [
 *   {
 *     "id": 1,                          // প্রোডাক্টের আইডি
 *     "name": "Product Name",           // প্রোডাক্টের নাম
 *     "specification": "Details",       // প্রোডাক্টের স্পেসিফিকেশন
 *     "weight": "500g",                 // প্রোডাক্টের ওজন
 *     "description": "Description",     // প্রোডাক্টের বর্ণনা
 *     "color": "Red",                   // প্রোডাক্টের রং
 *     "price": 100.00,                  // প্রোডাক্টের দাম
 *     "imageUrl": "http://image.url",   // প্রোডাক্টের ইমেজ URL
 *     "featureImage": true,             // প্রোডাক্টের ফিচার ইমেজ স্ট্যাটাস
 *     "enquery": "Some enquery text",    // প্রোডাক্টের ইনকোয়েরি তথ্য
 *     "category_id": 1,                 // প্রোডাক্টের ক্যাটাগরি আইডি
 *     "category_name": "Category",      // প্রোডাক্টের ক্যাটাগরি নাম
 *     "subcategory_id": 2,              // প্রোডাক্টের সাবক্যাটাগরি আইডি
 *     "subcategory_name": "SubCategory",// প্রোডাক্টের সাবক্যাটাগরি নাম
 *     "subsubcategory_id": 3,           // প্রোডাক্টের সাব-সাবক্যাটাগরি আইডি
 *     "subsubcategory_name": "SubSubCategory", // প্রোডাক্টের সাব-সাবক্যাটাগরি নাম
 *     "createdAt": "2024-08-25T12:00:00Z",    // প্রোডাক্ট তৈরি হওয়ার সময়
 *     "updatedAt": "2024-08-25T12:00:00Z"     // প্রোডাক্ট আপডেট হওয়ার সময়
 *   }
 * ]
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
            weight: product.weight, // প্রোডাক্টের ওজন
            description: product.description, // প্রোডাক্টের বর্ণনা
            color: product.color, // প্রোডাক্টের রং
            price: product.price, // প্রোডাক্টের দাম
            imageUrl: product.imageUrl, // প্রোডাক্টের ইমেজ URL
            featureImage: product.featureImage , // প্রোডাক্টের ফিচার ইমেজ স্ট্যাটাস
            enquery: product.enquery, // প্রোডাক্টের ইনকোয়েরি তথ্য
            category_id: product.category ? product.category.id : null, // প্রোডাক্টের ক্যাটাগরি আইডি
            category_name: product.category ? product.category.name : null, // প্রোডাক্টের ক্যাটাগরি নাম
            subcategory_id: product.subCategory ? product.subCategory.id : null, // প্রোডাক্টের সাবক্যাটাগরি আইডি
            subcategory_name: product.subCategory ? product.subCategory.name : null, // প্রোডাক্টের সাবক্যাটাগরি নাম
            subsubcategory_id: product.subSubCategory ? product.subSubCategory.id : null, // প্রোডাক্টের সাব-সাবক্যাটাগরি আইডি
            subsubcategory_name: product.subSubCategory ? product.subSubCategory.name : null, // প্রোডাক্টের সাব-সাবক্যাটাগরি নাম
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
 * @example JSON রেসপন্স:
 * {
 *   "id": 1,                          // প্রোডাক্টের আইডি
 *   "name": "Product Name",           // প্রোডাক্টের নাম
 *   "specification": "Details",       // প্রোডাক্টের স্পেসিফিকেশন
 *   "weight": "500g",                 // প্রোডাক্টের ওজন
 *   "description": "Description",     // প্রোডাক্টের বর্ণনা
 *   "color": "Red",                   // প্রোডাক্টের রং
 *   "price": 100.00,                  // প্রোডাক্টের দাম
 *   "imageUrl": "http://image.url",   // প্রোডাক্টের ইমেজ URL
 *   "featureImage": true,             // প্রোডাক্টের ফিচার ইমেজ স্ট্যাটাস
 *   "enquery": "Some enquery text",    // প্রোডাক্টের ইনকোয়েরি তথ্য
 *   "category_name": "Category",      // প্রোডাক্টের ক্যাটাগরি নাম
 *   "sub_category_name": "SubCategory",// প্রোডাক্টের সাবক্যাটাগরি নাম
 *   "sub_subcategory_name": "SubSubCategory", // প্রোডাক্টের সাব-সাবক্যাটাগরি নাম
 *   "createdAt": "2024-08-25T12:00:00Z",    // প্রোডাক্ট তৈরি হওয়ার সময়
 *   "updatedAt": "2024-08-25T12:00:00Z"     // প্রোডাক্ট আপডেট হওয়ার সময়
 * }
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
            weight: product.weight, // প্রোডাক্টের ওজন
            description: product.description, // প্রোডাক্টের বর্ণনা
            color: product.color, // প্রোডাক্টের রং
            price: product.price, // প্রোডাক্টের দাম
            imageUrl: product.imageUrl, // প্রোডাক্টের ইমেজ URL
            featureImage: product.featureImage, // প্রোডাক্টের ফিচার ইমেজ স্ট্যাটাস
            enquery: product.enquery, // প্রোডাক্টের ইনকোয়েরি তথ্য
            category_name: product.category ? product.category.name : null, // প্রোডাক্টের ক্যাটাগরি নাম
            sub_category_name: product.subCategory ? product.subCategory.name : null, // প্রোডাক্টের সাবক্যাটাগরি নাম
            sub_subcategory_name: product.subSubCategory ? product.subSubCategory.name : null, // প্রোডাক্টের সাব-সাবক্যাটাগরি নাম
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
 * 
 * @example JSON রেসপন্স:
 * {
 *   "id": 1,                          // প্রোডাক্টের আইডি
 *   "name": "Product Name",           // প্রোডাক্টের নাম
 *   "specification": "Details",       // প্রোডাক্টের স্পেসিফিকেশন
 *   "weight": "500g",                 // প্রোডাক্টের ওজন
 *   "description": "Description",     // প্রোডাক্টের বর্ণনা
 *   "color": "Red",                   // প্রোডাক্টের রং
 *   "price": 100.00,                  // প্রোডাক্টের দাম
 *   "imageUrl": "http://image.url",   // প্রোডাক্টের ইমেজ URL
 *   "featureImage": true,             // প্রোডাক্টের ফিচার ইমেজ স্ট্যাটাস
 *   "enquery": "Some enquery text",   // প্রোডাক্টের ইনকোয়েরি তথ্য
 *   "category_id": 1,                 // প্রোডাক্টের ক্যাটাগরি আইডি
 *   "category_name": "Category",      // প্রোডাক্টের ক্যাটাগরি নাম
 *   "subcategory_id": 2,              // প্রোডাক্টের সাবক্যাটাগরি আইডি
 *   "subcategory_name": "SubCategory",// প্রোডাক্টের সাবক্যাটাগরি নাম
 *   "subsubcategory_id": 3,           // প্রোডাক্টের সাব-সাবক্যাটাগরি আইডি
 *   "subsubcategory_name": "SubSubCategory", // প্রোডাক্টের সাব-সাবক্যাটাগরি নাম
 *   "createdAt": "2024-08-25T12:00:00Z",    // প্রোডাক্ট তৈরি হওয়ার সময়
 *   "updatedAt": "2024-08-25T12:00:00Z"     // প্রোডাক্ট আপডেট হওয়ার সময়
 * }
 */

const createProduct = async (req, res) => {
    try {
        // রিকোয়েস্ট থেকে প্রয়োজনীয় ডাটা সংগ্রহ করা হচ্ছে
        const { 
            name, 
            specification, 
            weight, 
            description, 
            color, 
            price, 
            category_id, 
            subcategory_id, 
            subsubcategory_id, 
            featureImage,   // ফিচার ইমেজ স্ট্যাটাস
            enquery         // ইনকোয়েরি তথ্য
        } = req.body;

        // যদি ফাইল আপলোড করা হয়, তাহলে ইমেজ URL তৈরি করা হচ্ছে
        const imageUrl = req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null;

        // ক্যাটাগরি, সাবক্যাটাগরি, এবং সাব-সাবক্যাটাগরি ফেচ করা হচ্ছে
        const category = await AppDataSource.getRepository(Category).findOneBy({ id: category_id });
        const subCategory = await AppDataSource.getRepository(SubCategory).findOneBy({ id: subcategory_id });
        const subSubCategory = await AppDataSource.getRepository(SubSubCategory).findOneBy({ id: subsubcategory_id });

        // যদি ক্যাটাগরি পাওয়া না যায়, তাহলে ত্রুটির বার্তা পাঠানো হচ্ছে
        if (!category) {
            return res.status(400).json({ message: 'Category not found' });
        }

        // যদি সাবক্যাটাগরি আইডি উল্লেখ করা হয় এবং তা পাওয়া না যায়
        if (subcategory_id && !subCategory) {
            return res.status(400).json({ message: 'SubCategory not found' });
        }

        // যদি সাব-সাবক্যাটাগরি আইডি উল্লেখ করা হয় এবং তা পাওয়া না যায়
        if (subsubcategory_id && !subSubCategory) {
            return res.status(400).json({ message: 'SubSubCategory not found' });
        }

        // নতুন প্রোডাক্ট তৈরি এবং সংরক্ষণ করা হচ্ছে
        const newProduct = await AppDataSource.getRepository(Product).save({
            name,
            specification,
            weight,
            description,
            color,
            price,
            category,
            subCategory,
            subSubCategory,
            imageUrl,
            featureImage, // ফিচার ইমেজ
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
            weight: savedProduct.weight,
            description: savedProduct.description,
            color: savedProduct.color,
            price: savedProduct.price,
            imageUrl: savedProduct.imageUrl,
            featureImage: savedProduct.featureImage, 
            enquery: savedProduct.enquery, 
            category_id: savedProduct.category ? savedProduct.category.id : null,
            category_name: savedProduct.category ? savedProduct.category.name : null,
            subcategory_id: savedProduct.subCategory ? savedProduct.subCategory.id : null,
            subcategory_name: savedProduct.subCategory ? savedProduct.subCategory.name : null,
            subsubcategory_id: savedProduct.subSubCategory ? savedProduct.subSubCategory.id : null, 
            subsubcategory_name: savedProduct.subSubCategory ? savedProduct.subSubCategory.name : null, 
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
 * @example JSON রেসপন্স:
 * {
 *   "id": 1,                          // প্রোডাক্টের আইডি
 *   "name": "Updated Product Name",   // আপডেটেড প্রোডাক্টের নাম
 *   "specification": "Updated Details", // আপডেটেড স্পেসিফিকেশন
 *   "weight": "600g",                 // আপডেটেড প্রোডাক্টের ওজন
 *   "description": "Updated Description", // আপডেটেড বর্ণনা
 *   "color": "Blue",                  // আপডেটেড রং
 *   "price": 120.00,                 // আপডেটেড দাম
 *   "imageUrl": "http://image.url",  // আপডেটেড ইমেজ URL
 *   "featureImage": false,           // আপডেটেড ফিচার ইমেজ স্ট্যাটাস
 *   "enquery": "Updated enquery text", // আপডেটেড ইনকোয়েরি তথ্য
 *   "category_id": 1,                // আপডেটেড ক্যাটাগরি আইডি
 *   "category_name": "Updated Category", // আপডেটেড ক্যাটাগরি নাম
 *   "subcategory_id": 2,             // আপডেটেড সাবক্যাটাগরি আইডি
 *   "subcategory_name": "Updated SubCategory", // আপডেটেড সাবক্যাটাগরি নাম
 *   "subsubcategory_id": 3,          // আপডেটেড সাব-সাবক্যাটাগরি আইডি
 *   "subsubcategory_name": "Updated SubSubCategory", // আপডেটেড সাব-সাবক্যাটাগরি নাম
 *   "createdAt": "2024-08-25T12:00:00Z",    // প্রোডাক্ট তৈরি হওয়ার সময়
 *   "updatedAt": "2024-08-25T12:00:00Z"     // প্রোডাক্ট আপডেট হওয়ার সময়
 * }
 */

const updateProduct = async (req, res) => {
    try {
        // প্রোডাক্ট আইডি রিকোয়েস্ট প্যারামস থেকে নেওয়া হচ্ছে
        const { id } = req.params;
        const { 
            name, 
            specification, 
            weight, 
            description, 
            color, 
            price, 
            category_id, 
            subcategory_id, 
            subsubcategory_id,
            featureImage,   // ফিচার ইমেজ স্ট্যাটাস
            enquery         // ইনকোয়েরি তথ্য
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
        const subSubCategory = await AppDataSource.getRepository(SubSubCategory).findOneBy({ id: subsubcategory_id });

        // নিশ্চিত করা হচ্ছে যে, ক্যাটাগরি পাওয়া গেছে
        if (category_id && !category) {
            return res.status(400).json({ message: 'Category not found' });
        }

        // নিশ্চিত করা হচ্ছে যে, সাবক্যাটাগরি পাওয়া গেছে
        if (subcategory_id && !subCategory) {
            return res.status(400).json({ message: 'SubCategory not found' });
        }

        // নিশ্চিত করা হচ্ছে যে, সাব-সাবক্যাটাগরি পাওয়া গেছে
        if (subsubcategory_id && !subSubCategory) {
            return res.status(400).json({ message: 'SubSubCategory not found' });
        }

        // প্রোডাক্ট আপডেট করা হচ্ছে
        const result = await AppDataSource.getRepository(Product).update(id, {
            name,
            specification,
            weight,
            description,
            color,
            price,
            category,
            subCategory,
            subSubCategory, // সাব-সাবক্যাটাগরি অন্তর্ভুক্ত করা হচ্ছে
            imageUrl,
            featureImage, // ফিচার ইমেজ স্ট্যাটাস
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
            weight: updatedProduct.weight,
            description: updatedProduct.description,
            color: updatedProduct.color,
            price: updatedProduct.price,
            imageUrl: updatedProduct.imageUrl,
            featureImage: updatedProduct.featureImage, // ফিচার ইমেজ স্ট্যাটাস
            enquery: updatedProduct.enquery, // ইনকোয়েরি তথ্য
            category_id: updatedProduct.category ? updatedProduct.category.id : null,
            category_name: updatedProduct.category ? updatedProduct.category.name : null,
            subcategory_id: updatedProduct.subCategory ? updatedProduct.subCategory.id : null,
            subcategory_name: updatedProduct.subCategory ? updatedProduct.subCategory.name : null,
            subsubcategory_id: updatedProduct.subSubCategory ? updatedProduct.subSubCategory.id : null, 
            subsubcategory_name: updatedProduct.subSubCategory ? updatedProduct.subSubCategory.name : null, 
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
 * @example JSON রেসপন্স:
 * {
 *   "message": "Product deleted successfully"  // সফল মুছে ফেলার বার্তা
 * }
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
 * @param {Object} req - HTTP রিকোয়েস্ট অবজেক্ট
 * @param {Object} res - HTTP রেসপন্স অবজেক্ট
 * 
 * @example JSON:
 * {
 *   "ids": [1, 2, 3],       // আপডেট করতে যেসব প্রোডাক্টের আইডি
 *   "featureImage": true    // প্রোডাক্টের ফিচার ইমেজ স্ট্যাটাস (true বা false)
 * }
 * 
 * @note:
 *   - এই রিকোয়েস্টটি প্রোডাক্ট আইডি 1, 2, এবং 3 এর ফিচার ইমেজ স্ট্যাটাস `true` করবে।
 *   - আপনি `featureImage` এর মান `false` সেট করে ফিচার ইমেজ ডিসেবল করতে পারেন।
 */
const updateFeatureImage = async (req, res) => {
    try {
        // রিকোয়েস্ট বডি থেকে প্রোডাক্ট আইডির অ্যারে এবং ফিচার ইমেজ স্ট্যাটাস গ্রহণ করা হচ্ছে
        const { ids, featureImage } = req.body;

        // প্রাপ্ত আইডিগুলোর উপর ভিত্তি করে প্রোডাক্টগুলি আপডেট করার চেষ্টা করা হচ্ছে
        const result = await AppDataSource.getRepository(Product)
            .createQueryBuilder()
            .update(Product)
            .set({ featureImage }) // ফিচার ইমেজ স্ট্যাটাস সেট করা হচ্ছে
            .whereInIds(ids) // যেসব প্রোডাক্ট আইডি প্রাপ্ত হয়েছে তাদের জন্য
            .execute();

        // চেক করা হচ্ছে প্রোডাক্টগুলি সফলভাবে আপডেট হয়েছে কিনা
        if (result.affected === 0) {
            // যদি কোন প্রোডাক্ট আপডেট না হয়, তাহলে 404 স্টেটাস কোড এবং একটি মেসেজ পাঠানো হচ্ছে
            return res.status(404).json({ message: 'প্রোডাক্ট পাওয়া যায়নি' });
        }

        // সফল হলে 200 স্টেটাস কোড এবং একটি মেসেজ পাঠানো হচ্ছে
        res.status(200).json({ message: 'প্রোডাক্টের ফিচার ইমেজ সফলভাবে আপডেট হয়েছে' });

    } catch (error) {
        // কোন এক্সেপশন হলে 500 স্টেটাস কোড এবং একটি মেসেজ পাঠানো হচ্ছে
        res.status(500).json({ message: 'ফিচার ইমেজ আপডেট করতে ব্যর্থ হয়েছে', error });
    }
};

/**
 * একটি প্রোডাক্টের `enquery` ডাটা আইডি দ্বারা ফেচ করার জন্য এই ফাংশনটি ব্যবহৃত হয়।
 * @function getEnqueryById
 * @description এই ফাংশনটি একটি প্রোডাক্টের `enquery` ডাটা আইডি দ্বারা ফেরত দেয়।
 * @route GET /api/products/:id/enquery
 * @access Public
 * 
 * @param {Object} req - HTTP রিকোয়েস্ট অবজেক্ট
 * @param {Object} res - HTTP রেসপন্স অবজেক্ট
 * 
 * @returns {Promise<void>} - প্রমিস রিটার্ন করে যা প্রোডাক্টের `enquery` সফলভাবে ফেচ হলে রেসপন্স প্রদান করে।
 * 
 * @example JSON রেসপন্স:
 * {
 *   "id": 1,                      // প্রোডাক্টের আইডি
 *   "enquery": "Sample enquiry"   // প্রোডাক্টের `enquery` ডাটা
 * }
 */

const getEnqueryById = async (req, res) => {
    try {
        const { id } = req.params;

        // প্রোডাক্ট ফেচ করা হচ্ছে আইডি দ্বারা
        const product = await AppDataSource.getRepository(Product).findOneBy({ id });

        // যদি প্রোডাক্ট পাওয়া না যায়, তাহলে ত্রুটির বার্তা পাঠানো হচ্ছে
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // প্রোডাক্টের `enquery` ডাটা সহ সফল রেসপন্স পাঠানো হচ্ছে
        res.status(200).json({
            id: product.id,
            enquery: product.enquery
        });
    } catch (error) {
        // কোনো ত্রুটি হলে তা কনসোলে লগ করা হচ্ছে এবং ক্লায়েন্টকে ত্রুটির বার্তা পাঠানো হচ্ছে
        res.status(500).json({ message: 'Failed to get enquiry data', error });
    }
};

/**
 * একটি প্রোডাক্টের `enquery` ডাটা আইডি দ্বারা আপডেট করার জন্য এই ফাংশনটি ব্যবহৃত হয়।
 * @function updateEnqueryById
 * @description এই ফাংশনটি একটি প্রোডাক্টের `enquery` ডাটা আইডি দ্বারা আপডেট করে।
 * @route PUT /api/products/:id/enquery
 * @access Public
 * 
 * @param {Object} req - HTTP রিকোয়েস্ট অবজেক্ট
 * @param {Object} res - HTTP রেসপন্স অবজেক্ট
 * 
 * @returns {Promise<void>} - প্রমিস রিটার্ন করে যা প্রোডাক্টের `enquery` সফলভাবে আপডেট হলে রেসপন্স প্রদান করে।
 * 
 * @example JSON রিকোয়েস্ট:
 * {
 *   "enquery": "Updated enquiry data"  // নতুন `enquery` ডাটা
 * }
 * 
 * @example JSON রেসপন্স:
 * {
 *   "id": 1,                          // প্রোডাক্টের আইডি
 *   "enquery": "Updated enquiry data"  // আপডেট করা `enquery` ডাটা
 * }
 */

const updateEnqueryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { enquery } = req.body;

        // প্রোডাক্ট ফেচ করা হচ্ছে আইডি দ্বারা
        const product = await AppDataSource.getRepository(Product).findOneBy({ id });

        // যদি প্রোডাক্ট পাওয়া না যায়, তাহলে ত্রুটির বার্তা পাঠানো হচ্ছে
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // `enquery` ডাটা আপডেট করা হচ্ছে
        await AppDataSource.getRepository(Product).update(id, { enquery });

        // আপডেট হওয়া প্রোডাক্ট ফেরত দেয়া হচ্ছে
        const updatedProduct = await AppDataSource.getRepository(Product).findOneBy({ id });

        // সফলভাবে আপডেট হওয়া রেসপন্স পাঠানো হচ্ছে
        res.status(200).json({
            id: updatedProduct.id,
            enquery: updatedProduct.enquery
        });
    } catch (error) {
        // কোনো ত্রুটি হলে তা কনসোলে লগ করা হচ্ছে এবং ক্লায়েন্টকে ত্রুটির বার্তা পাঠানো হচ্ছে
        res.status(500).json({ message: 'Failed to update enquiry data', error });
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFeatureImage,
    getEnqueryById,
    updateEnqueryById
};
