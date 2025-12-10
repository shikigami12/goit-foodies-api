import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Get the correct file extension and base path based on environment
 */
const getApiPaths = (): string[] => {
    if (isProduction) {
        // In production, look for compiled JS files in dist folder
        return [
            path.join(__dirname, '../routes/*.js'),
            path.join(__dirname, '../schemas/*.js'),
            path.join(__dirname, '../types/*.js'),
            path.join(__dirname, '../middlewares/*.js'),
        ];
    }
    // In development, look for TS files in src folder
    return [
        './src/routes/*.ts',
        './src/schemas/*.ts',
        './src/types/*.ts',
        './src/middlewares/*.ts',
    ];
};

/**
 * Swagger/OpenAPI configuration
 */
const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Foodies API',
            version: '1.0.0',
            description: `
## Recipe Sharing Platform API

A comprehensive REST API for a recipe-sharing platform with:
- User authentication (JWT)
- Recipe management (CRUD)
- Social features (followers/following)
- Favorites system

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`
      `,
            contact: {
                name: 'Render Party',
            },
            license: {
                name: 'ISC',
            },
        },
        servers: [
            {
                url: process.env.API_URL || 'https://goit-foodies-api-latest.onrender.com',
                description: 'Production server',
            },
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Users', description: 'User profile management' },
            { name: 'Recipes', description: 'Recipe management' },
            { name: 'Categories', description: 'Recipe categories' },
            { name: 'Areas', description: 'Geographic regions' },
            { name: 'Ingredients', description: 'Recipe ingredients' },
            { name: 'Testimonials', description: 'User testimonials' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token obtained from login or register',
                },
            },
            schemas: {
                ErrorResponse: {
                    type: 'object',
                    required: ['message'],
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message',
                            example: 'Not found',
                        },
                    },
                },
            },
        },
    },
    apis: getApiPaths(),
};

export const swaggerSpec = swaggerJsdoc(options);
