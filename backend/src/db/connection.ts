/**
 * Database Connection Setup
 * PostgreSQL connection pool using node-postgres
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { PgSelect } from 'drizzle-orm/pg-core';
import * as schema from './schema';

// Database configuration from environment
export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello';
const POOL_SIZE = parseInt(process.env.DB_POOL_SIZE || '20', 10);

// Create PostgreSQL connection pool
const pool = new Pool({
	connectionString: DATABASE_URL,
	max: POOL_SIZE,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 10000,
	// a script (db:migrate, restore) ends when its work is done, not 30 s later; the server stays up through its port
	allowExitOnIdle: true
});

// Create Drizzle ORM instance
export const db = drizzle(pool, { schema });

// %, _ and \ in a text are characters, not wildcards of ilike (#1305, #1316)
export const literal = (text: string) => text.replace(/[\\%_]/g, '\\$&');
export const containing = (text: string) => `%${literal(text)}%`;

/** A page of the query's rows; `limit` null or undefined: every row, for a service whose result needs them all (#705, #1229) */
export const paged = <T extends PgSelect>(query: T, limit: number | null | undefined, offset: number) =>
	(limit == null ? query : query.limit(limit)).offset(offset);

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
