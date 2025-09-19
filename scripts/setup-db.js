#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Ensure database directory exists
const dbPath = './database.db';
const dbDir = dirname(dbPath);

if (!existsSync(dbDir) && dbDir !== '.') {
  console.log(`Creating database directory: ${dbDir}`);
  mkdirSync(dbDir, { recursive: true });
}

// Run database migrations
console.log('Running database migrations...');
try {
  execSync('npx drizzle-kit push', { stdio: 'inherit' });
  console.log('Database migrations completed successfully!');
} catch (error) {
  console.error('Database migration failed:', error.message);
  process.exit(1);
}
