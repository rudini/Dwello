/**
 * Database Connection Setup
 * PostgreSQL connection pool using node-postgres
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Database configuration from environment
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello';
const POOL_SIZE = parseInt(process.env.DB_POOL_SIZE || '20', 10);

// Create PostgreSQL connection pool
const pool = new Pool({
	connectionString: DATABASE_URL,
	max: POOL_SIZE,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 10000
});

// Create Drizzle ORM instance
export const db = drizzle(pool, { schema });

/**
 * Test database connection
 * Call this on startup to verify database connectivity
 */
export async function testConnection(): Promise<boolean> {
	try {
		const client = await pool.connect();
		await client.query('SELECT 1');
		client.release();
		console.log('Database connection successful');
		return true;
	} catch (error) {
		console.error('Database connection failed:', error);
		return false;
	}
}

/**
 * Close all database connections
 * Call this on graceful shutdown
 */
export async function closeConnection(): Promise<void> {
	await pool.end();
	console.log('Database connections closed');
}

// Export pool for direct access if needed
export { pool };
