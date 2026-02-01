/**
 * Dwello Backend Entry Point
 * ElysiaJS server with all API routes
 */

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { db, testConnection } from './db/connection';
import { buildings, apartments, utilityStatements } from './db/schema';
import { count, eq, lt, and, or, isNull } from 'drizzle-orm';
import { buildingRoutes } from './routes/buildings';
import { apartmentRoutes } from './routes/apartments';
import { tenantRoutes } from './routes/tenants';
import { contractRoutes } from './routes/contracts';
import { categoryRoutes } from './routes/categories';
import { invoiceRoutes } from './routes/invoices';
import { distributionKeyRoutes } from './routes/distribution-keys';
import { heatingProfileRoutes } from './routes/heating-profiles';
import { configRoutes } from './routes/config';
import { statementRoutes } from './routes/statements';

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
	.use(
		swagger({
			documentation: {
				info: {
					title: 'Dwello API',
					version: '1.0.0',
					description: 'Swiss Property Management System API'
				},
				tags: [
					{ name: 'Buildings', description: 'Building management' },
					{ name: 'Apartments', description: 'Apartment management' },
					{ name: 'Tenants', description: 'Tenant management' },
					{ name: 'Contracts', description: 'Rental contract management' },
					{ name: 'Invoices', description: 'Invoice management with LLM categorization' },
					{ name: 'Categories', description: 'Cost category management' },
					{ name: 'Distribution Keys', description: 'Cost distribution keys' },
					{ name: 'Heating Profiles', description: 'Heating distribution profiles' },
					{ name: 'Statements', description: 'Utility cost statements' },
					{ name: 'Config', description: 'System configuration' }
				]
			},
			path: '/swagger',
			exclude: ['/swagger', '/swagger/json']
		})
	)
	// Health check endpoint
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
		service: 'dwello-backend'
	}))
	// Dashboard endpoint
	.get('/api/v1/dashboard', async () => {
		const today = new Date().toISOString().split('T')[0];

		const [buildingsCount] = await db.select({ count: count() }).from(buildings);
		const [apartmentsCount] = await db.select({ count: count() }).from(apartments);
		const [occupiedCount] = await db
			.select({ count: count() })
			.from(apartments)
			.where(eq(apartments.status, 'occupied'));
		const [vacantCount] = await db
			.select({ count: count() })
			.from(apartments)
			.where(eq(apartments.status, 'vacant'));
		const [pendingCount] = await db
			.select({ count: count() })
			.from(utilityStatements)
			.where(or(eq(utilityStatements.status, 'draft'), eq(utilityStatements.status, 'sent')));
		const [overdueCount] = await db
			.select({ count: count() })
			.from(utilityStatements)
			.where(
				and(
					eq(utilityStatements.status, 'sent'),
					lt(utilityStatements.paymentDeadline, today)
				)
			);

		return {
			totalBuildings: buildingsCount?.count ?? 0,
			totalApartments: apartmentsCount?.count ?? 0,
			occupiedApartments: occupiedCount?.count ?? 0,
			vacantApartments: vacantCount?.count ?? 0,
			pendingStatements: pendingCount?.count ?? 0,
			overdueStatements: overdueCount?.count ?? 0
		};
	})
	// Register route modules
	.use(buildingRoutes)
	.use(apartmentRoutes)
	.use(tenantRoutes)
	.use(contractRoutes)
	.use(categoryRoutes)
	.use(invoiceRoutes)
	.use(distributionKeyRoutes)
	.use(heatingProfileRoutes)
	.use(configRoutes)
	.use(statementRoutes)
	.listen(3001);

console.log(`🚀 Dwello Backend running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 Swagger API docs at http://${app.server?.hostname}:${app.server?.port}/swagger`);
console.log('📝 Available routes:');
console.log('   - GET  /health');
console.log('   - GET  /api/v1/dashboard');
console.log('   - CRUD /api/v1/buildings');
console.log('   - CRUD /api/v1/apartments');
console.log('   - CRUD /api/v1/tenants');
console.log('   - CRUD /api/v1/contracts');
console.log('   - CRUD /api/v1/categories');
console.log('   - CRUD /api/v1/invoices');
console.log('   - CRUD /api/v1/distribution-keys');
console.log('   - CRUD /api/v1/heating-profiles');
console.log('   - CRUD /api/v1/config');
console.log('   - CRUD /api/v1/statements');

export type App = typeof app;
