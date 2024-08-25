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
        role: {
            type: 'varchar',
            default: 'subscriber',  // Default value for the role column
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
            nullable: true,
        },
        userGroup: {
            target: 'UserGroup',
            type: 'many-to-one',
            nullable: true,
        },
        permissions: {
            target: 'Permission',
            type: 'many-to-many',
            inverseSide: 'users',
        },
    },
});
