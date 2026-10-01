/**
 * Dashboard Route
 * Portfolio, statement and financial overview
 */

import { Elysia } from 'elysia';
import { count, eq, lt, and, sum, desc, gte, or, sql, type SQL } from 'drizzle-orm';
import { db } from '../db/connection';
import { buildings, apartments, utilityStatements, invoices } from '../db/schema';

const countApartments = async (where?: SQL) =>
	Number((await db.select({ count: count() }).from(apartments).where(where))[0]?.count ?? 0);

const countStatements = async (where: SQL | undefined) =>
	Number((await db.select({ count: count() }).from(utilityStatements).where(where))[0]?.count ?? 0);

const sumStatements = async (column: typeof utilityStatements.balance | typeof utilityStatements.paidAmount, where: SQL | undefined) =>
	Number((await db.select({ total: sum(column) }).from(utilityStatements).where(where))[0]?.total ?? 0);

const occupancyRate = (occupied: number, total: number) => (total > 0 ? (occupied / total) * 100 : 0);

async function portfolio() {
	const [totalBuildings] = await db.select({ count: count() }).from(buildings);
	const totalApartments = await countApartments();
	const occupiedApartments = await countApartments(eq(apartments.status, 'occupied'));
	return {
		totalBuildings: Number(totalBuildings?.count ?? 0),
		totalApartments,
		occupiedApartments,
		vacantApartments: await countApartments(eq(apartments.status, 'vacant')),
		occupancyRate: Math.round(occupancyRate(occupiedApartments, totalApartments) * 10) / 10
	};
}

function statementFilters(today: string) {
	const sent = eq(utilityStatements.status, 'sent');
	return {
		draft: eq(utilityStatements.status, 'draft'),
		// Sent excludes overdue (sent with past deadline)
		sent: and(sent, or(gte(utilityStatements.paymentDeadline, today), sql`${utilityStatements.paymentDeadline} IS NULL`)),
		paid: eq(utilityStatements.status, 'paid'),
		overdue: and(sent, lt(utilityStatements.paymentDeadline, today))
	};
}

async function buildingOccupancy() {
	const buildingList = await db.select().from(buildings);
	return Promise.all(
		buildingList.map(async (building) => {
			const inBuilding = eq(apartments.buildingId, building.id);
			const total = await countApartments(inBuilding);
			const occupied = await countApartments(and(inBuilding, eq(apartments.status, 'occupied')));
			return {
				buildingId: building.id,
				buildingName: building.name,
				totalApartments: total,
				occupiedApartments: occupied,
				occupancyRate: occupancyRate(occupied, total)
			};
		})
	);
}

async function recentActivity() {
	const recentStatements = await db.select().from(utilityStatements).orderBy(desc(utilityStatements.createdAt)).limit(5);
	const recentInvoices = await db.select().from(invoices).orderBy(desc(invoices.createdAt)).limit(5);
	return [
		...recentStatements.map((s) => ({
			id: s.id,
			type: s.status === 'paid' ? 'payment_received' : ('statement_created' as const),
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
}

export const dashboardRoutes = new Elysia().get('/api/v1/dashboard', async () => {
	const today = new Date().toISOString().split('T')[0];
	const thisMonth = new Date();
	thisMonth.setDate(1);
	const monthStart = thisMonth.toISOString().split('T')[0];
	const filters = statementFilters(today);

	const statements = {
		draft: await countStatements(filters.draft),
		sent: await countStatements(filters.sent),
		paid: await countStatements(filters.paid),
		overdue: await countStatements(filters.overdue)
	};

	return {
		portfolio: await portfolio(),
		financial: {
			outstandingStatements: statements.sent,
			totalPending: await sumStatements(utilityStatements.balance, eq(utilityStatements.status, 'sent')),
			overdueAmount: await sumStatements(utilityStatements.balance, filters.overdue),
			paidThisMonth: await sumStatements(
				utilityStatements.paidAmount,
				and(eq(utilityStatements.status, 'paid'), gte(utilityStatements.paidDate, monthStart))
			)
		},
		statements,
		recentActivity: await recentActivity(),
		buildingOccupancy: await buildingOccupancy()
	};
});
