const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Category',
    tableName: 'categories',
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
        subCategories: {
            type: 'one-to-many',
            target: 'SubCategory',
            inverseSide: 'category', // Use inverseSide instead of mappedBy
        },
        products: {
            type: 'one-to-many',
            target: 'Product',
            inverseSide: 'category', // Use inverseSide instead of mappedBy
        },
    },
});
