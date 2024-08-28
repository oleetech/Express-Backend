const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for Category, SubCategory, and Product management',
        },
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'User ID',
                            example: 1,
                        },
                        username: {
                            type: 'string',
                            description: 'Username',
                            example: 'exampleUser',
                        },
                        email: {
                            type: 'string',
                            description: 'Email address',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            description: 'Password',
                            example: 'securePassword',
                        },
                        phone: {
                            type: 'string',
                            description: 'Phone number',
                            example: '1234567890',
                        },
                        firstName: {
                            type: 'string',
                            description: 'First name',
                            example: 'John',
                        },
                        lastName: {
                            type: 'string',
                            description: 'Last name',
                            example: 'Doe',
                        },
                        role: {
                            type: 'string',
                            description: 'User role',
                            example: 'subscriber',
                        },
                        isActivated: {
                            type: 'boolean',
                            description: 'Account activation status',
                            example: false,
                        },
                        googleId: {
                            type: 'string',
                            description: 'Google ID',
                            example: 'googleId123',
                        },
                        facebookId: {
                            type: 'string',
                            description: 'Facebook ID',
                            example: 'facebookId123',
                        },
                        otp: {
                            type: 'string',
                            description: 'One Time Password',
                            example: '123456',
                        },
                        otpExpires: {
                            type: 'string',
                            format: 'date-time',
                            description: 'OTP expiration timestamp',
                            example: '2024-08-25T13:00:00.000Z',
                        },
                        activationToken: {
                            type: 'string',
                            description: 'Account activation token',
                            example: 'activationToken123',
                        },
                        resetToken: {
                            type: 'string',
                            description: 'Password reset token',
                            example: 'resetToken123',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                            example: '2024-08-25T13:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp',
                            example: '2024-08-25T13:00:00.000Z',
                        },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Category ID', example: 1 },
                        name: { type: 'string', description: 'Category name', example: 'Electronics' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-08-25T13:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', description: 'Update timestamp', example: '2024-08-25T13:00:00.000Z' },
                    },
                },
                SubCategory: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'SubCategory ID', example: 1 },
                        name: { type: 'string', description: 'SubCategory name', example: 'Smartphones' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-08-25T13:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', description: 'Update timestamp', example: '2024-08-25T13:00:00.000Z' },
                        category: { $ref: '#/components/schemas/Category' },
                    },
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Product ID', example: 1 },
                        name: { type: 'string', description: 'Product name', example: 'Smartphone XYZ' },
                        specification: { type: 'string', description: 'Product specification', example: '6GB RAM, 128GB Storage' },
                        knittingGauge: { type: 'string', description: 'Knitting gauge', example: '20' },
                        description: { type: 'string', description: 'Product description', example: 'A high-quality smartphone' },
                        imageUrl: { type: 'string', description: 'URL of the product image', example: 'http://example.com/image.jpg' },
                        featured: { type: 'boolean', description: 'Whether this is a feature image', example: false },
                        category_id: { type: 'integer', description: 'Category ID', example: 1 },
                        category_name: { type: 'string', description: 'Category name', example: 'Electronics' },
                        subcategory_id: { type: 'integer', description: 'SubCategory ID', example: 2 },
                        subcategory_name: { type: 'string', description: 'SubCategory name', example: 'Smartphones' },
                        subSubCategoryId: { type: 'integer', description: 'SubSubCategory ID', example: 3 },
                        subSubCategory: { type: 'string', description: 'SubSubCategory name', example: 'Gaming Smartphones' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp', example: '2024-08-25T13:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', description: 'Update timestamp', example: '2024-08-25T13:00:00.000Z' },
                    }
                },

                Enquiry: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Enquiry ID', example: 1 },
                        name: { type: 'string', description: 'Name of the person making the enquiry', example: 'John Doe' },
                        email: { type: 'string', description: 'Email address of the person making the enquiry', example: 'johndoe@example.com' },
                        message: { type: 'string', description: 'Message or details provided in the enquiry', example: 'I am interested in learning more about your services.' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp of the enquiry', example: '2024-08-25T13:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', description: 'Update timestamp of the enquiry', example: '2024-08-25T14:00:00.000Z' },
                        productId: { type: 'integer', description: 'ID of the related product', example: 1 },
                    }
                },
                
            },
        },
    },
    apis: [path.join(__dirname, './routes/*.js')], // Adjust path as needed
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = {
    setupSwagger,
    swaggerDocs,
};
