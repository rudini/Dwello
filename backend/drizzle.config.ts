/**
 * Drizzle Kit Configuration
 * Configuration for migrations and schema management
 */

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello'
	},
	verbose: true,
	strict: true
});
