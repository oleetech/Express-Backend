const { EntitySchema } = require('typeorm');
const SubCategory = require('./SubCategory');

module.exports = new EntitySchema({
    name: 'SubSubCategory',
    tableName: 'sub_sub_categories',
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
        subCategory: {
            type: 'many-to-one',
            target: 'SubCategory',
            joinColumn: {
                name: 'sub_category_id',
            },
        },
    },
});
