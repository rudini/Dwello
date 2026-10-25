/**
 * Dashboard Route
 * Portfolio, statement and financial overview
 */

import { Elysia } from 'elysia';
import { count, eq, and, sum, desc, gt, gte, or, sql, type SQL } from 'drizzle-orm';
import { db } from '../db/connection';
import { buildings, apartments, utilityStatements, invoices } from '../db/schema';
import { apartmentStatus } from '../services/apartment.service';
import { draftsToSend } from '../services/statement-invoices.service';
import { statusCondition } from '../services/statement.service';
import { swissToday } from '../services/today';
import { contractTasks } from '../services/contract-tasks.service';
import { deadlinesOf } from '../services/overview-deadlines';
import { getTypedConfig } from '../services/config.service';
import { listContracts } from '../services/contract.service';
import { listStatements } from '../services/statement.service';
import { replacedInSql } from '../services/counting-statements';

const countApartments = async (where?: SQL) =>
	Number((await db.select({ count: count() }).from(apartments).where(where))[0]?.count ?? 0);

const countStatements = async (where: SQL | undefined) =>
	Number((await db.select({ count: count() }).from(utilityStatements).where(where))[0]?.count ?? 0);

const sumStatements = async (column: typeof utilityStatements.balance | typeof utilityStatements.paidAmount, where: SQL | undefined) =>
	Number((await db.select({ total: sum(column) }).from(utilityStatements).where(where))[0]?.total ?? 0);

// Percent with one decimal place
const occupancyRate = (occupied: number, total: number) => (total > 0 ? Math.round((occupied / total) * 1000) / 10 : 0);

async function portfolio() {
	const [totalBuildings] = await db.select({ count: count() }).from(buildings);
	const totalApartments = await countApartments();
	const occupiedApartments = await countApartments(sql`${apartmentStatus} = 'occupied'`);
	return {
		totalBuildings: Number(totalBuildings?.count ?? 0),
		totalApartments,
		occupiedApartments,
		vacantApartments: await countApartments(sql`${apartmentStatus} = 'vacant'`),
		reletApartments: await countApartments(sql`${apartmentStatus} = 'relet'`),
		reservedApartments: await countApartments(sql`${apartmentStatus} = 'reserved'`),
		occupancyRate: occupancyRate(occupiedApartments, totalApartments)
	};
}

async function buildingOccupancy() {
	const buildingList = await db.select().from(buildings);
	return Promise.all(
		buildingList.map(async (building) => {
			const inBuilding = eq(apartments.buildingId, building.id);
			const total = await countApartments(inBuilding);
			const occupied = await countApartments(and(inBuilding, sql`${apartmentStatus} = 'occupied'`));
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

type Activity = {
	id: string;
	type: 'statement_created' | 'invoice_added' | 'payment_received';
	title: string;
	description: string;
	timestamp: string;
};

/** A statement's creation and, once paid, its payment when it was recorded (paid statements stay unchanged) */
export function statementActivities(s: { id: string; statementNumber: string; status: string; createdAt: Date; updatedAt: Date }) {
	const description = `Abrechnung ${s.statementNumber}`;
	const activities: Activity[] = [
		{ id: `${s.id}-created`, type: 'statement_created', title: 'Abrechnung erstellt', description, timestamp: s.createdAt.toISOString() }
	];
	if (s.status === 'paid') {
		activities.push({
			id: `${s.id}-paid`,
			type: 'payment_received',
			title: 'Zahlung eingegangen',
			description,
			timestamp: s.updatedAt.toISOString()
		});
	}
	return activities;
}

async function recentActivity() {
	const created = await db.select().from(utilityStatements).orderBy(desc(utilityStatements.createdAt)).limit(5);
	// Payments of older statements count as recent as well
	const paid = await db
		.select()
		.from(utilityStatements)
		.where(eq(utilityStatements.status, 'paid'))
		.orderBy(desc(utilityStatements.updatedAt))
		.limit(5);
	const recentInvoices = await db.select().from(invoices).orderBy(desc(invoices.createdAt)).limit(5);
	const statementEvents = new Map([...created, ...paid].flatMap(statementActivities).map((a) => [a.id, a]));
	return [
		...statementEvents.values(),
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

// Amounts the tenants still owe; refunds (negative balance) are owed to the tenants instead
const owed = (status: string) => and(statusCondition(status), gt(utilityStatements.balance, '0'));

export const dashboardRoutes = new Elysia().get('/api/v1/dashboard', async () => {
	const monthStart = `${swissToday().slice(0, 8)}01`;

	const statements = {
		draft: await countStatements(statusCondition('draft')),
		toSend: await draftsToSend(), // the current drafts (#454, H-28 #717)
		sent: await countStatements(statusCondition('sent')),
		paid: await countStatements(statusCondition('paid')),
		settled: await countStatements(statusCondition('settled')), // «Erledigt» (#448)
		overdue: await countStatements(statusCondition('overdue'))
	};
	const tasks = await contractTasks();

	return {
		portfolio: await portfolio(),
		financial: {
			outstandingStatements: await countStatements(statusCondition('open')),
			totalPending: await sumStatements(utilityStatements.balance, owed('open')),
			overdueAmount: await sumStatements(utilityStatements.balance, owed('overdue')),
			paidThisMonth: await sumStatements(
				utilityStatements.paidAmount,
				// only Nachzahlungen, not refunds (#93); also on a statement replaced since (#120)
				and(
					or(statusCondition('paid'), replacedInSql),
					gt(utilityStatements.balance, '0'),
					gte(utilityStatements.paidDate, monthStart)
				)
			)
		},
		statements,
		recentActivity: await recentActivity(),
		buildingOccupancy: await buildingOccupancy(),
		contractTasks: tasks, // the overview's tasks about contracts (#788)
		deadlines: await deadlines(tasks.noticedContracts) // #815
	};
});

// The overview's Zahlungsfristen and Vertragsenden (#815): a contract with a task is named by it, not twice (A-4.4)
async function deadlines(noticed: { id: string }[]) {
	const { statements } = await listStatements({ status: 'open', limit: 1000 });
	const { contracts } = await listContracts({ status: 'active', limit: 1000 });
	return deadlinesOf({
		today: swissToday(),
		dueStatements: statements.map((s) => ({
			id: s.id,
			tenantName: s.tenant ? `${s.tenant.firstName} ${s.tenant.lastName}` : '',
			paymentDeadline: String(s.paymentDeadline)
		})),
		endingContracts: contracts
			.filter((c) => c.endDate && !noticed.some((n) => n.id === c.id))
			.map((c) => ({ id: c.id, tenantName: c.tenantName, endDate: c.endDate! })),
		paymentDeadlineDays: await getTypedConfig('payment_deadline_days')
	});
}
