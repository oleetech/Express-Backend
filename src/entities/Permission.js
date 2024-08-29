const { EntitySchema } = require('typeorm');

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
            nullable: false,
        },
        action: {
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
        users: {
            target: 'User',
            type: 'many-to-many',
            inverseSide: 'permissions',
        },
    },
});


/**
 * Permission Entity
 * Represents the permissions that can be assigned to roles, user groups, or users.
 * 
 * Relationships:
 * 
 * - **Roles**: Many-to-Many
 *   - **Description**: Permissions can be assigned to multiple roles. The `roles` field in the `Permission` entity references the `Role` entity.
 *   - **Inverse Side**: `Role` has a many-to-many relationship with `Permission` through the `permissions` field.
 * 
 * - **UserGroups**: Many-to-Many
 *   - **Description**: Permissions can be assigned to multiple user groups. The `userGroups` field in the `Permission` entity references the `UserGroup` entity.
 *   - **Inverse Side**: `UserGroup` has a many-to-many relationship with `Permission` through the `permissions` field.
 * 
 * - **Users**: Many-to-Many
 *   - **Description**: Permissions can be assigned directly to users. The `users` field in the `Permission` entity references the `User` entity.
 *   - **Inverse Side**: `User` has a many-to-many relationship with `Permission` through the `permissions` field.
 */
