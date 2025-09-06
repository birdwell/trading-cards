import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from './schema';

// Create the database client
const client = createClient({
  url: 'file:./database.db',
});

// Create the drizzle instance
export const db = drizzle(client, { schema });

// Function to run migrations
export async function runMigrations() {
  await migrate(db, { migrationsFolder: './drizzle' });
}

// Export schema for use in other files
export * from './schema';
