import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { rateLimiter } from '@/middleware/rateLimiter';
import { authRouter } from '@/routes/auth.routes';
import { promptRouter } from '@/routes/prompt.routes';
import { templateRouter } from '@/routes/template.routes';
import { userRouter } from '@/routes/user.routes';
import { adminRouter } from '@/routes/admin.routes';
import { setupSwagger } from '@/config/swagger';
import { DatabaseManager } from '@/database/DatabaseManager';

class App {
  public app: express.Application;
  private databaseManager: DatabaseManager;

  constructor() {
    this.app = express();
    this.databaseManager = new DatabaseManager();
    this.initializeMiddleware();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // Compression middleware
    this.app.use(compression());

    // CORS middleware
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
      methods: config.cors.methods,
    }));

    // Rate limiting
    this.app.use(rateLimiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, _res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.app.env,
      });
    });

    // API routes
    this.app.use('/api/auth', authRouter);
    this.app.use('/api/prompts', promptRouter);
    this.app.use('/api/templates', templateRouter);
    this.app.use('/api/users', userRouter);
    this.app.use('/api/admin', adminRouter);

    // Catch-all route for undefined endpoints
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeSwagger(): void {
    console.log('🔍 Checking swagger setup - docsEnabled:', config.api.docsEnabled);
    if (config.api.docsEnabled) {
      console.log('🚀 Initializing Swagger...');
      setupSwagger(this.app);
    } else {
      console.log('⏭️ Swagger disabled');
    }
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async initializeDatabase(): Promise<void> {
    try {
      await this.databaseManager.initialize();
      logger.info('Database initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  public async start(): Promise<void> {
    try {
      await this.initializeDatabase();
      
      this.app.listen(config.app.port, () => {
        logger.info(`🚀 ${config.app.name} is running on port ${config.app.port}`);
        logger.info(`📚 API Documentation: http://localhost:${config.app.port}${config.api.docsPath}`);
        logger.info(`🏥 Health Check: http://localhost:${config.app.port}/health`);
      });
    } catch (error) {
      logger.error('Failed to start application:', error);
      process.exit(1);
    }
  }
}

export default App;
