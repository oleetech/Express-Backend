const { EntitySchema } = require('typeorm');
const Category = require('./Category');

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
            joinColumn: {
                name: 'category_id',
            },
        },
        products: {
            type: 'one-to-many',
            target: 'Product',
            mappedBy: 'subCategory',
        },
    },
});
