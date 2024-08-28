const { EntitySchema } = require('typeorm');
const Category = require('./Category'); // Import Category entity
const Product = require('./Product'); // Import Product entity

module.exports = new EntitySchema({
    name: 'SubCategory', // Entity name
    tableName: 'sub_categories', // Table name for SQL databases
    columns: {
        id: {
            type: 'int', // SQL databases use 'int' for IDs
            primary: true, // Primary key
            generated: true, // Auto-increment for primary key
        },
        name: {
            type: 'varchar', // Column type for name
            nullable: false, // Cannot be null
        },
        createdAt: {
            type: 'timestamp', // Use 'timestamp' for creation date
            createDate: true, // Automatically set creation date
        },
        updatedAt: {
            type: 'timestamp', // Use 'timestamp' for update date
            updateDate: true, // Automatically set update date
        },
    },
    relations: {
        category: {
            type: 'many-to-one',
            target: 'Category',
            joinColumn: {
                name: 'category_id',
            },
        },
        products: {
            type: 'one-to-many',
            target: 'Product',
            mappedBy: 'subCategory',
        },
        subSubCategories: {
            type: 'one-to-many',
            target: 'SubSubCategory',
            mappedBy: 'subCategory',
        },
    },
});

