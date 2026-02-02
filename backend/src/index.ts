/**
 * Dwello Backend Entry Point
 * ElysiaJS server with all API routes
 */

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { db, testConnection } from './db/connection';
import { buildings, apartments, utilityStatements, invoices } from './db/schema';
import { count, eq, lt, and, sum, desc, gte, or, sql } from 'drizzle-orm';
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
		const thisMonth = new Date();
		thisMonth.setDate(1);
		const monthStart = thisMonth.toISOString().split('T')[0];

		// Portfolio stats
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

		const totalApartments = Number(apartmentsCount?.count ?? 0);
		const occupiedApartments = Number(occupiedCount?.count ?? 0);
		const occupancyRate = totalApartments > 0 ? (occupiedApartments / totalApartments) * 100 : 0;

		// Statement status counts
		const [draftCount] = await db
			.select({ count: count() })
			.from(utilityStatements)
			.where(eq(utilityStatements.status, 'draft'));
		// Sent count excludes overdue (sent with past deadline)
		const [sentCount] = await db
			.select({ count: count() })
			.from(utilityStatements)
			.where(
				and(
					eq(utilityStatements.status, 'sent'),
					or(
						gte(utilityStatements.paymentDeadline, today),
						sql`${utilityStatements.paymentDeadline} IS NULL`
					)
				)
			);
		const [paidCount] = await db
			.select({ count: count() })
			.from(utilityStatements)
			.where(eq(utilityStatements.status, 'paid'));
		const [overdueCount] = await db
			.select({ count: count() })
			.from(utilityStatements)
			.where(
				and(
					eq(utilityStatements.status, 'sent'),
					lt(utilityStatements.paymentDeadline, today)
				)
			);

		// Financial stats
		const [pendingTotal] = await db
			.select({ total: sum(utilityStatements.balance) })
			.from(utilityStatements)
			.where(eq(utilityStatements.status, 'sent'));
		const [overdueTotal] = await db
			.select({ total: sum(utilityStatements.balance) })
			.from(utilityStatements)
			.where(
				and(
					eq(utilityStatements.status, 'sent'),
					lt(utilityStatements.paymentDeadline, today)
				)
			);
		const [paidThisMonthTotal] = await db
			.select({ total: sum(utilityStatements.paidAmount) })
			.from(utilityStatements)
			.where(
				and(
					eq(utilityStatements.status, 'paid'),
					gte(utilityStatements.paidDate, monthStart)
				)
			);

		// Building occupancy (per building)
		const buildingList = await db.select().from(buildings);
		const buildingOccupancy = await Promise.all(
			buildingList.map(async (building) => {
				const [totalApts] = await db
					.select({ count: count() })
					.from(apartments)
					.where(eq(apartments.buildingId, building.id));
				const [occupiedApts] = await db
					.select({ count: count() })
					.from(apartments)
					.where(and(eq(apartments.buildingId, building.id), eq(apartments.status, 'occupied')));

				const total = Number(totalApts?.count ?? 0);
				const occupied = Number(occupiedApts?.count ?? 0);
				return {
					buildingId: building.id,
					buildingName: building.name,
					totalApartments: total,
					occupiedApartments: occupied,
					occupancyRate: total > 0 ? (occupied / total) * 100 : 0
				};
			})
		);

		// Recent activity (from statements and invoices)
		const recentStatements = await db
			.select()
			.from(utilityStatements)
			.orderBy(desc(utilityStatements.createdAt))
			.limit(5);
		const recentInvoices = await db
			.select()
			.from(invoices)
			.orderBy(desc(invoices.createdAt))
			.limit(5);

		const recentActivity = [
			...recentStatements.map((s) => ({
				id: s.id,
				type: s.status === 'paid' ? 'payment_received' : 'statement_created' as const,
				title: s.status === 'paid' ? 'Zahlung eingegangen' : 'Abrechnung erstellt',
				description: `Abrechnung ${s.statementNumber}`,
				timestamp: s.createdAt.toISOString()
			})),
			...recentInvoices.map((i) => ({
				id: i.id,
				type: 'invoice_added' as const,
				title: 'Rechnung erfasst',
				description: i.description.substring(0, 50),
				timestamp: i.createdAt.toISOString()
			}))
		]
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
			.slice(0, 5);

		return {
			portfolio: {
				totalBuildings: Number(buildingsCount?.count ?? 0),
				totalApartments,
				occupiedApartments,
				vacantApartments: Number(vacantCount?.count ?? 0),
				occupancyRate: Math.round(occupancyRate * 10) / 10
			},
			financial: {
				outstandingStatements: Number(sentCount?.count ?? 0),
				totalPending: Number(pendingTotal?.total ?? 0),
				overdueAmount: Number(overdueTotal?.total ?? 0),
				paidThisMonth: Number(paidThisMonthTotal?.total ?? 0)
			},
			statements: {
				draft: Number(draftCount?.count ?? 0),
				sent: Number(sentCount?.count ?? 0),
				paid: Number(paidCount?.count ?? 0),
				overdue: Number(overdueCount?.count ?? 0)
			},
			recentActivity,
			buildingOccupancy
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
