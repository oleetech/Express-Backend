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
                        color: { type: 'string', description: 'Product color', example: 'Black' },
                        price: { type: 'number', format: 'float', description: 'Product price', example: 299.99 },
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
