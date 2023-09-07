const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Centralized Health System',
      version: '0.0.1',
      description: 'CHS API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['app/components/**/*.route.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;

