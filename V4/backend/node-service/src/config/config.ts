import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface Config {
  app: {
    env: string;
    port: number;
    name: string;
    version: string;
  };
  database: {
    type: string;
    path?: string;
    host?: string;
    port?: number;
    name?: string;
    username?: string;
    password?: string;
    logging: boolean;
  };
  jwt: {
    secret: string;
    expiration: string;
    refreshExpiration: string;
  };
  cors: {
    origin: string[];
    credentials: boolean;
    methods: string[];
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  logging: {
    level: string;
    file: string;
  };
  api: {
    docsEnabled: boolean;
    docsPath: string;
  };
}

const config: Config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    name: process.env.APP_NAME || 'Copilot Prompter Node Service',
    version: process.env.APP_VERSION || '1.0.0',
  },
  database: {
    type: process.env.DB_TYPE as 'sqlite' | 'mysql' | 'postgresql' || 'sqlite',
    path: process.env.DB_PATH || path.join(__dirname, '../../data/copilot_prompter.db'),
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: process.env.DB_LOGGING === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiration: process.env.JWT_EXPIRATION || '24h',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:4200'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
    methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  api: {
    docsEnabled: process.env.API_DOCS_ENABLED === 'true',
    docsPath: process.env.API_DOCS_PATH || '/api/docs',
  },
};

export { config };
