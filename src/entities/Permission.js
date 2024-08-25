// entities/Permission.js
const { EntitySchema } = require('typeorm');
const User = require('./User'); // Adjust path if needed
const Role = require('./Role'); // Adjust path if needed
const UserGroup = require('./UserGroup'); // Adjust path if needed

module.exports = new EntitySchema({
    name: 'Permission',
    tableName: 'permissions',
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
        model: {
            type: 'varchar',
        },
        action: {
            type: 'varchar',
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
        users: {
            target: 'User',
            type: 'many-to-many',
            inverseSide: 'permissions',
        },
        roles: {
            target: 'Role',
            type: 'many-to-many',
            inverseSide: 'permissions',
        },
        userGroups: {
            target: 'UserGroup',
            type: 'many-to-many',
            inverseSide: 'permissions',
        },
    },
});
