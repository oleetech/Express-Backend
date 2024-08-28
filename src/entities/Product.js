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
        knittingGauge: {
            type: 'varchar',
            nullable: true,
        },
        description: {
            type: 'text',
            nullable: true,
        },       

        imageUrl: {
            type: 'varchar',
            nullable: true,
        },
        featured: {
            type: 'boolean',
            default: false, 
        },     
        
        other: {
            type: 'varchar',
            nullable: true,
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
            // No explicit joinColumn, TypeORM will use categoryId by default
        },
        subCategory: {
            type: 'many-to-one',
            target: 'SubCategory',
            // No explicit joinColumn, TypeORM will use subCategoryId by default
        },
        subSubCategory: {
            type: 'many-to-one',
            target: 'SubSubCategory',
            // No explicit joinColumn, TypeORM will use subSubCategoryId by default
        },
    },
});