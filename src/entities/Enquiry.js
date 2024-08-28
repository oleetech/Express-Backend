const { EntitySchema } = require('typeorm');
const Product = require('./Product'); // Import the Product entity

module.exports = new EntitySchema({
    name: 'Enquiry',
    tableName: 'enquiries',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        name: {
            type: 'varchar',
            nullable: false,
        },
        email: {
            type: 'varchar',
            nullable: false,
        },
        message: {
            type: 'text',
            nullable: false,
        },

        status: {
            type: 'boolean',
            default: false,  
        },
        createdAt: {
            type: 'timestamp',
            createDate: true,
        },
        updatedAt: {
            type: 'timestamp',
            updateDate: true,
        },
    },
    relations: {
        product: {
            type: 'many-to-one',
            target: 'Product',
            joinColumn: {
                name: 'productId', // This will create the productId column in the enquiries table
            },
            nullable: false, // Make sure this is required
        },
    },
});
