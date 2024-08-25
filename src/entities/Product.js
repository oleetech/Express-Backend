const { EntitySchema } = require('typeorm');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const SubSubCategory = require('./SubSubCategory');

module.exports = new EntitySchema({
    name: 'Product',
    tableName: 'products',
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
        specification: {
            type: 'text',
            nullable: true,
        },
        weight: {
            type: 'varchar',
            nullable: true,
        },
        description: {
            type: 'text',
            nullable: true,
        },
        enquery: {
            type: 'text',
            nullable: true,
        },        
        color: {
            type: 'varchar',
            nullable: true,
        },
        price: {
            type: 'decimal',
            nullable: false,
        },
        imageUrl: {
            type: 'varchar',
            nullable: true,
        },
        featureImage: {
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
        category: {
            type: 'many-to-one',
            target: 'Category',
            joinColumn: {
                name: 'category_id',
            },
        },
        subCategory: {
            type: 'many-to-one',
            target: 'SubCategory',
            joinColumn: {
                name: 'sub_category_id',
            },
        },
        subSubCategory: {
            type: 'many-to-one',
            target: 'SubSubCategory',
            joinColumn: {
                name: 'sub_sub_category_id',
            },
        },
    },
});

