const { EntitySchema } = require('typeorm');
const SubCategory = require('./SubCategory'); // Import SubCategory entity

module.exports = new EntitySchema({
    name: 'SubSubCategory', // Entity name
    tableName: 'sub_sub_categories', // Table name for SQL databases
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
        subCategory: {
            type: 'many-to-one',
            target: 'SubCategory',
            joinColumn: {
                name: 'sub_category_id',
            },
        },
    },
});
