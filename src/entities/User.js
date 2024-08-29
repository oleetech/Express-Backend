const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        username: {
            type: 'varchar',
            unique: true,
            nullable: true,
        },
        email: {
            type: 'varchar',
            unique: true,
            nullable: true,
        },
        password: {
            type: 'varchar',
            nullable: true,
        },
        phone: {
            type: 'varchar',
            unique: true,
            nullable: true,
        },
        firstName: {
            type: 'varchar',
            nullable: true,
        },
        lastName: {
            type: 'varchar',
            nullable: true,
        },
        isActivated: {
            type: 'boolean',
            default: false,
        },
        googleId: {
            type: 'varchar',
            unique: true,
            nullable: true,
        },
        facebookId: {
            type: 'varchar',
            unique: true,
            nullable: true,
        },
        otp: {
            type: 'varchar',
            nullable: true,
        },
        otpExpires: {
            type: 'timestamp',
            nullable: true,
        },
        activationToken: {
            type: 'varchar',
            nullable: true,
        },
        resetToken: {
            type: 'varchar',
            nullable: true,
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
        role: {
            target: 'Role',
            type: 'many-to-one',
            onDelete: 'SET NULL',
            inverseSide: 'users',
        },
        userGroup: {
            target: 'UserGroup',
            type: 'many-to-one',
            onDelete: 'SET NULL',
            inverseSide: 'users',
        },
        permissions: {
            target: 'Permission',
            type: 'many-to-many',
            inverseSide: 'users',
        },
    },
});


/**
 * User Entity
 * Represents the users of the system.
 * 
 * Relationships:
 * 
 * - **Role**: Many-to-One
 *   - **Description**: Each user can have one role. The `role` field in the `User` entity references the `Role` entity.
 *   - **Inverse Side**: `Role` has a one-to-many relationship with `User` through the `users` field.
 * 
 * - **UserGroup**: Many-to-One
 *   - **Description**: Each user can belong to one user group. The `userGroup` field in the `User` entity references the `UserGroup` entity.
 *   - **Inverse Side**: `UserGroup` has a one-to-many relationship with `User` through the `users` field.
 * 
 * - **Permissions**: Many-to-Many
 *   - **Description**: Users can have multiple permissions. The `permissions` field in the `User` entity references the `Permission` entity.
 *   - **Inverse Side**: `Permission` has a many-to-many relationship with `User` through the `users` field.
 */
