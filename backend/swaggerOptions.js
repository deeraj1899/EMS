import swaggerJSDoc from 'swagger-jsdoc';
const frontendUrl = process.env.FRONTEND_URL;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Employee Management System API',
      version: '1.0.0',
      description: 'REST endpoints for your EMS backend',
    },
    servers: [
      { url: frontendUrl, description: 'Local dev server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./controllers/*.js']
};

export default swaggerJSDoc(options);
