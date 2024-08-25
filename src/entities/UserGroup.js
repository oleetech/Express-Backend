// entities/UserGroup.js
const { EntitySchema } = require('typeorm');
const Permission = require('./Permission'); // Adjust path if needed

module.exports = new EntitySchema({
    name: 'UserGroup',
    tableName: 'user_groups',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        name: {
            type: 'varchar',
            unique: true,
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
        permissions: {
            target: 'Permission',
            type: 'many-to-many',
            joinTable: true,
        },
        users: {
            target: 'User',
            type: 'one-to-many',
            inverseSide: 'userGroup',
        },
    },
});
