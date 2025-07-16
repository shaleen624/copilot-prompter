import { Sequelize } from 'sequelize';
import { logger } from '@/utils/logger';
import path from 'path';
import fs from 'fs';

interface Migration {
  up: (queryInterface: any) => Promise<void>;
  down: (queryInterface: any) => Promise<void>;
}

export class MigrationRunner {
  private sequelize: Sequelize;
  private migrationsPath: string;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.migrationsPath = path.join(__dirname, 'migrations');
  }

  async createMigrationsTable(): Promise<void> {
    await this.sequelize.getQueryInterface().createTable('migrations', {
      id: {
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: 'STRING',
        allowNull: false,
        unique: true,
      },
      executed_at: {
        type: 'DATE',
        allowNull: false,
        defaultValue: new Date(),
      },
    });
  }

  async getExecutedMigrations(): Promise<string[]> {
    try {
      const results = await this.sequelize.query(
        'SELECT name FROM migrations ORDER BY executed_at',
        { type: 'SELECT' }
      );
      return (results as any[]).map((row: any) => row.name);
    } catch (error) {
      // Table doesn't exist yet
      return [];
    }
  }

  async markMigrationAsExecuted(name: string): Promise<void> {
    await this.sequelize.query(
      'INSERT INTO migrations (name, executed_at) VALUES (?, ?)',
      {
        replacements: [name, new Date()],
        type: 'INSERT',
      }
    );
  }

  async removeMigrationRecord(name: string): Promise<void> {
    await this.sequelize.query(
      'DELETE FROM migrations WHERE name = ?',
      {
        replacements: [name],
        type: 'DELETE',
      }
    );
  }

  async getPendingMigrations(): Promise<string[]> {
    const migrationFiles = fs.readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
      .sort();

    const executedMigrations = await this.getExecutedMigrations();
    
    return migrationFiles.filter(file => {
      const migrationName = file.replace(/\.(ts|js)$/, '');
      return !executedMigrations.includes(migrationName);
    });
  }

  async runMigrations(): Promise<void> {
    try {
      // Ensure migrations table exists
      await this.createMigrationsTable();

      const pendingMigrations = await this.getPendingMigrations();
      
      if (pendingMigrations.length === 0) {
        logger.info('No pending migrations');
        return;
      }

      logger.info(`Running ${pendingMigrations.length} pending migrations`);

      for (const migrationFile of pendingMigrations) {
        const migrationName = migrationFile.replace(/\.(ts|js)$/, '');
        const migrationPath = path.join(this.migrationsPath, migrationFile);
        
        logger.info(`Running migration: ${migrationName}`);
        
        const migration: Migration = await import(migrationPath);
        
        await migration.up(this.sequelize.getQueryInterface());
        await this.markMigrationAsExecuted(migrationName);
        
        logger.info(`Migration completed: ${migrationName}`);
      }

      logger.info('All migrations completed successfully');
    } catch (error) {
      logger.error('Migration failed:', error);
      throw error;
    }
  }

  async rollbackMigration(migrationName?: string): Promise<void> {
    try {
      const executedMigrations = await this.getExecutedMigrations();
      
      if (executedMigrations.length === 0) {
        logger.info('No migrations to rollback');
        return;
      }

      const targetMigration = migrationName || executedMigrations[executedMigrations.length - 1];
      
      if (!executedMigrations.includes(targetMigration)) {
        throw new Error(`Migration ${targetMigration} has not been executed`);
      }

      const migrationPath = path.join(this.migrationsPath, `${targetMigration}.ts`);
      
      if (!fs.existsSync(migrationPath)) {
        throw new Error(`Migration file not found: ${migrationPath}`);
      }

      logger.info(`Rolling back migration: ${targetMigration}`);
      
      const migration: Migration = await import(migrationPath);
      
      await migration.down(this.sequelize.getQueryInterface());
      await this.removeMigrationRecord(targetMigration);
      
      logger.info(`Migration rolled back: ${targetMigration}`);
    } catch (error) {
      logger.error('Rollback failed:', error);
      throw error;
    }
  }
}
