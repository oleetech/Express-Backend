// src/entities/Contact.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Contact',
    tableName: 'contacts',
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
        email: {
            type: 'varchar',
            nullable: false,
        },
        message: {
            type: 'text',
            nullable: false,
        },
        createdAt: {
            type: 'timestamp',
            createDate: true,
        },
    },
});
