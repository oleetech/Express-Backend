const { EntitySchema } = require('typeorm');

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
        },
    },
    relations: {
        permissions: {
            type: 'many-to-many',
            target: 'Permission',
            inverseSide: 'userGroups',
        },
        users: {
            type: 'one-to-many',
            target: 'User',
            inverseSide: 'userGroup',
        },
    },
});


/**
 * UserGroup Entity
 * Represents the groups to which users can belong.
 * 
 * Relationships:
 * 
 * - **Permissions**: Many-to-Many
 *   - **Description**: User groups can have multiple permissions. The `permissions` field in the `UserGroup` entity references the `Permission` entity.
 *   - **Inverse Side**: `Permission` has a many-to-many relationship with `UserGroup` through the `userGroups` field.
 * 
 * - **Users**: One-to-Many
 *   - **Description**: A user group can include multiple users. The `users` field in the `UserGroup` entity references the `User` entity.
 *   - **Inverse Side**: `User` has a many-to-one relationship with `UserGroup` through the `userGroup` field.
 */
