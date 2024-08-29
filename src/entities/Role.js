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
        },
    },
    relations: {
        permissions: {
            type: 'many-to-many',
            target: 'Permission',
            inverseSide: 'roles',
        },
        users: {
            type: 'one-to-many',
            target: 'User',
            inverseSide: 'role',
        },
    },
});

/**
 * Role Entity
 * Represents the roles that can be assigned to users.
 * 
 * Relationships:
 * 
 * - **Permissions**: Many-to-Many
 *   - **Description**: Roles can have multiple permissions. The `permissions` field in the `Role` entity references the `Permission` entity.
 *   - **Inverse Side**: `Permission` has a many-to-many relationship with `Role` through the `roles` field.
 * 
 * - **Users**: One-to-Many
 *   - **Description**: A role can be assigned to multiple users. The `users` field in the `Role` entity references the `User` entity.
 *   - **Inverse Side**: `User` has a many-to-one relationship with `Role` through the `role` field.
 */
