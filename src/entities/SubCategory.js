const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'SubCategory',
    tableName: 'sub_categories',
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
            joinColumn: true, // Simplified joinColumn usage
        },
        products: {
            type: 'one-to-many',
            target: 'Product',
            inverseSide: 'subCategory',
        },
        subSubCategories: {
            type: 'one-to-many',
            target: 'SubSubCategory',
            inverseSide: 'subCategory',
        },
    },
});
