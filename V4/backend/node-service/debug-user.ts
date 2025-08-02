#!/usr/bin/env ts-node
import { DatabaseManager } from './src/database/DatabaseManager';
import { UserService } from './src/services/user.service';

async function debugUserService() {
  console.log('🔍 Debugging User Service...');
  
  const databaseManager = new DatabaseManager();
  await databaseManager.initialize();
  
  const userService = new UserService();
  
  try {
    const user = await userService.findByUsername('newuser');
    console.log('User found:', JSON.stringify(user?.toJSON(), null, 2));
    
    if (user) {
      console.log('User ID:', user.id, typeof user.id);
      console.log('User username:', user.username, typeof user.username);
      console.log('User email:', user.email, typeof user.email);
      console.log('User enabled:', user.enabled, typeof user.enabled);
      console.log('User password:', user.password ? '***PRESENT***' : 'UNDEFINED', typeof user.password);
      
      // Try accessing via get method
      console.log('Via get() method:');
      console.log('User ID (get):', user.get('id'), typeof user.get('id'));
      console.log('User username (get):', user.get('username'), typeof user.get('username'));
      console.log('User enabled (get):', user.get('enabled'), typeof user.get('enabled'));
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

debugUserService();
