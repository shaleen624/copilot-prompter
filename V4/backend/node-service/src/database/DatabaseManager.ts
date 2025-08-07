import { Sequelize } from 'sequelize';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';
import { MigrationRunner } from './MigrationRunner';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private sequelize: Sequelize | null = null;

  constructor() {
    if (DatabaseManager.instance) {
      return DatabaseManager.instance;
    }
    DatabaseManager.instance = this;
  }

  public async initialize(): Promise<void> {
    try {
      this.sequelize = this.createConnection();
      await this.sequelize.authenticate();
      logger.info('Database connection established successfully');
      
      // Run migrations
      const migrationRunner = new MigrationRunner(this.sequelize);
      await migrationRunner.runMigrations();

      // Initialize models
      await this.initializeModels();
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  private createConnection(): Sequelize {
    const dbConfig = config.database;

    switch (dbConfig.type) {
      case 'sqlite':
        return new Sequelize({
          dialect: 'sqlite',
          storage: dbConfig.path,
          logging: dbConfig.logging ? (msg: string) => logger.debug(msg) : false,
          define: {
            timestamps: true,
            underscored: false,
          },
        });

      case 'mysql':
        return new Sequelize({
          dialect: 'mysql',
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.name,
          username: dbConfig.username,
          password: dbConfig.password,
          logging: dbConfig.logging ? (msg: string) => logger.debug(msg) : false,
          define: {
            timestamps: true,
            underscored: false,
          },
        });

      case 'postgresql':
        return new Sequelize({
          dialect: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.name,
          username: dbConfig.username,
          password: dbConfig.password,
          logging: dbConfig.logging ? (msg: string) => logger.debug(msg) : false,
          define: {
            timestamps: true,
            underscored: false,
          },
        });

      default:
        throw new Error(`Unsupported database type: ${dbConfig.type}`);
    }
  }

  private async initializeModels(): Promise<void> {
    if (!this.sequelize) {
      throw new Error('Database not initialized');
    }

    // Import and initialize models
    const { User } = await import('@/models/user.model');
    const { Prompt } = await import('@/models/prompt.model');
    const { CopilotTemplate } = await import('@/models/template.model');

    // Initialize models with sequelize instance
    User.initModel(this.sequelize);
    Prompt.initModel(this.sequelize);
    CopilotTemplate.initModel(this.sequelize);

    // Set up associations for prompts (userId is integer)
    User.hasMany(Prompt, { foreignKey: 'userId', as: 'prompts' });
    Prompt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    // TODO: Fix template associations when userId is converted to integer
    // User.hasMany(CopilotTemplate, { foreignKey: 'userId', as: 'templates' });
    // CopilotTemplate.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    logger.info('Database models initialized');
  }

  public getSequelize(): Sequelize {
    if (!this.sequelize) {
      throw new Error('Database not initialized');
    }
    return this.sequelize;
  }

  public async close(): Promise<void> {
    if (this.sequelize) {
      await this.sequelize.close();
      logger.info('Database connection closed');
    }
  }
}
