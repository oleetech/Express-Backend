const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Role',
    tableName: 'roles',
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
        users: {
            target: 'User',
            type: 'one-to-many',
            mappedBy: 'role',
        },
        permissions: {
            target: 'Permission',
            type: 'many-to-many',
            joinTable: true,
        },
    },
});
