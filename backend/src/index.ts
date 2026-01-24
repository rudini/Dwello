/**
 * Dwello Backend Entry Point
 * ElysiaJS server with all API routes
 */

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { testConnection } from './db/connection';
import { buildingRoutes } from './routes/buildings';
import { apartmentRoutes } from './routes/apartments';
import { tenantRoutes } from './routes/tenants';
import { contractRoutes } from './routes/contracts';

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
	// Health check endpoint
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
		service: 'dwello-backend'
	}))
	// Dashboard endpoint (placeholder - will be enhanced later)
	.get('/api/v1/dashboard', () => ({
		totalBuildings: 0,
		totalApartments: 0,
		occupiedApartments: 0,
		vacantApartments: 0,
		pendingStatements: 0,
		overdueStatements: 0
	}))
	// Register route modules
	.use(buildingRoutes)
	.use(apartmentRoutes)
	.use(tenantRoutes)
	.use(contractRoutes)
	.listen(3001);

console.log(`🚀 Dwello Backend running at http://${app.server?.hostname}:${app.server?.port}`);
console.log('📝 Available routes:');
console.log('   - GET  /health');
console.log('   - GET  /api/v1/dashboard');
console.log('   - CRUD /api/v1/buildings');
console.log('   - CRUD /api/v1/apartments');
console.log('   - CRUD /api/v1/tenants');
console.log('   - CRUD /api/v1/contracts');

export type App = typeof app;
