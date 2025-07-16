#!/usr/bin/env node
import { DatabaseManager } from './database/DatabaseManager';
import { logger } from './utils/logger';

async function testDatabase() {
  try {
    const dbManager = new DatabaseManager();
    await dbManager.initialize();
    logger.info('Database test completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
