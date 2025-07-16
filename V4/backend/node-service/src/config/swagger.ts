import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { config } from '@/config/config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Copilot Prompter API',
      version: config.app.version,
      description: 'Node.js microservice for Copilot Prompter application',
    },
    servers: [
      {
        url: `http://localhost:${config.app.port}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  app.use(config.api.docsPath, swaggerUi.serve, swaggerUi.setup(specs));
};
