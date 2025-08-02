import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { config } from '@/config/config';
import path from 'path';

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
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../controllers/*.ts'),
  ], // Path to the API docs
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  console.log('🔧 Setting up Swagger with docsPath:', config.api.docsPath);
  console.log('🔧 Swagger specs generated:', Object.keys(specs));
  
  // Setup Swagger UI
  app.use(config.api.docsPath, swaggerUi.serve, swaggerUi.setup(specs));
  
  // Also provide JSON endpoint for debugging
  app.get(`${config.api.docsPath}.json`, (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
  
  console.log('✅ Swagger setup completed');
};
