import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { testConnection } from './db/connection';

// Test database connection on startup
testConnection().then((connected) => {
	if (!connected) {
		console.warn('⚠️ Database connection failed - some features may not work');
	}
});

const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
			credentials: true
		})
	)
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
		service: 'dwello-backend'
	}))
	.get('/api/v1/dashboard', () => ({
		totalBuildings: 0,
		totalApartments: 0,
		occupiedApartments: 0,
		vacantApartments: 0,
		pendingStatements: 0,
		overdueStatements: 0
	}))
	.listen(3001);

console.log(`🚀 Dwello Backend running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
