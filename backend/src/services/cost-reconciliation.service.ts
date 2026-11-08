/**
 * #1126: the Kostenabstimmung of a building's Abrechnungsperiode: per Abrechnungsposition the Kosten des Gebäudes from
 * today's allocable invoices against what the statements bill the tenants (without the Verwaltungspauschale); the
 * landlord bears the difference. The Verwaltungspauschale and the non-allocable invoices stand beside it
 */

import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { buildings, invoices } from '../db/schema';
import { calculateStatementForContract, groupInvoicesByCategory } from './calculation.service';
import { counting } from './counting-statements';
import { fuelStockChange } from './fuel-stock.service';
import { getInvoicesForStatement, inPeriod, inPeriodOf } from './invoice.service';
import { roundToRappen } from './pdf-format';
import { notUpToDate } from './statement-invoices.service';
import { runPlan } from './statement-run.service';
import { listStatements } from './statement.service';
import type { ReconciliationBody, ReportPeriod } from '../api/report';

type Range = { start: string; end: string };
// what a statement bills: its positions with the tenant's share, and its Verwaltungspauschale
type Billed = {
	lineItems: {
		categoryId: string | null;
		distributionKeyId: string | null;
		tenantShare: number | string;
	}[];
	managementFee: number | string | null;
};

const keyOf = (line: { categoryId: string | null; distributionKeyId: string | null }) =>
	`${line.categoryId} ${line.distributionKeyId}`;
const cents = (amount: number) => roundToRappen(amount);

async function reconcile(buildingId: string, period: Range, billed: Billed[]) {
	const groups = groupInvoicesByCategory([
		...(await getInvoicesForStatement(buildingId, period.start, period.end)),
		...(await fuelStockChange(buildingId, period.start, period.end))
	]);
	const positions = new Map(
		groups.map((group) => [
			keyOf(group),
			{
				categoryId: group.categoryId,
				distributionKeyId: group.distributionKeyId,
				buildingCosts: cents(group.totalAmount),
				tenants: 0
			}
		])
	);
	for (const line of billed.flatMap((statement) => statement.lineItems)) {
		// a position no invoice has any more (deleted since): only what the statements bill (Fachreview 1126-1 M-1)
		const position =
			positions.get(keyOf(line)) ??
			positions.set(keyOf(line), { ...line, buildingCosts: 0, tenants: 0 }).get(keyOf(line))!;
		position.tenants = cents(position.tenants + Number(line.tenantShare));
	}
	const rows = [...positions.values()].map(
		({ categoryId, distributionKeyId, buildingCosts, tenants }) => ({
			categoryId,
			distributionKeyId,
			// Fachreview 1126-1 V-6: a Kategorie with several Verteilschlüssel (#528) names its key
			severalKeys:
				[...positions.values()].filter((other) => other.categoryId === categoryId).length > 1,
			buildingCosts,
			tenants,
			landlord: cents(buildingCosts - tenants)
		})
	);
	const sum = (field: 'buildingCosts' | 'tenants') =>
		cents(rows.reduce((total, row) => total + row[field], 0));
	const total = { buildingCosts: sum('buildingCosts'), tenants: sum('tenants') };
	return {
		positions: rows,
		total: { ...total, landlord: cents(total.buildingCosts - total.tenants) },
		managementFee: cents(
			billed.reduce((total, statement) => total + Number(statement.managementFee ?? 0), 0)
		),
		nonAllocable: await nonAllocableInPeriod(buildingId, period)
	};
}

/** What the non-allocable invoices of a building cost in a period, counted like the allocable ones (Rule 1) */
async function nonAllocableInPeriod(buildingId: string, period: Range) {
	const rows = await db
		.select()
		.from(invoices)
		.where(
			and(
				eq(invoices.buildingId, buildingId),
				eq(invoices.isValidUtilityCost, false),
				inPeriodOf(period.start, period.end)
			)
		);
	return cents(
		rows.reduce((sum, invoice) => sum + inPeriod(invoice, period.start, period.end).amount, 0)
	);
}

// the statements of the building that count in exactly this period: drafts included, a replaced one not
async function validStatements(buildingId: string, period: Range) {
	const { statements } = await listStatements({
		buildingId,
		periodStart: period.start,
		periodEnd: period.end,
		limit: 1000
	});
	return counting(statements).filter(
		(s) => s.periodStart === period.start && s.periodEnd === period.end
	);
}

const named = (
	statements: { id: string; tenant: { firstName: string; lastName: string } | null }[]
) =>
	statements.map((s) => ({
		id: s.id,
		tenantName: s.tenant ? `${s.tenant.firstName} ${s.tenant.lastName}` : ''
	}));

/**
 * The Kostenabstimmung of «Berichte»: the valid statements of the period, and as notes the contracts the period would
 * bill that have none, the drafts, and the statements not up to date (PO 05.11.2026, Fachreview 1126-1 M-1, V-1)
 */
export async function reportReconciliation(buildingId: string, period: Range): Promise<ReconciliationBody> {
	const [statements, plan] = await Promise.all([
		validStatements(buildingId, period),
		runPlan(buildingId, period)
	]);
	const outdated = await notUpToDate(statements);
	return {
		...(await reconcile(buildingId, period, statements)),
		// Fachreview 1126-1 V-3: a contract «Abgerechnet bis» leaves no Mietstage is not in the plan's contracts
		withoutStatement: plan.contracts.filter((c) => !statements.some((s) => s.contractId === c.id))
			.length,
		// PO 05.11.2026 (persona Sven 1126 P-2): named by their tenants, as the statements not up to date
		drafts: named(statements.filter((s) => s.status === 'draft')),
		notUpToDate: named(outdated.changed),
		keyNotCalculable: named(outdated.keyNotCalculable) // #1309: a note of its own (Fachreview 1309-1)
	};
}

/** The Kostenabstimmung of a run's preview: the valid statements of the period and those the run creates (PO 05.11.2026) */
export async function runReconciliation(
	buildingId: string,
	run: { period: Range; heatingProfileId: string | null; managementFeePercent?: number }
) {
	const [statements, plan] = await Promise.all([
		validStatements(buildingId, run.period),
		runPlan(buildingId, run.period)
	]);
	const created = await Promise.all(
		plan.contracts
			.filter((c) => !c.billed)
			.map((c) =>
				calculateStatementForContract(
					c.id,
					new Date(run.period.start),
					new Date(run.period.end),
					run.heatingProfileId ?? undefined,
					run.managementFeePercent
				)
			)
	);
	return reconcile(buildingId, run.period, [...statements, ...created]);
}

/** The periods of «Berichte»: each building and period with a valid statement, the latest first */
export async function reportPeriods() {
	const { statements } = await listStatements({ limit: 10000 });
	const periods = new Map<string, Omit<ReportPeriod, 'buildingName'>>();
	for (const s of counting(statements)) {
		if (s.building)
			periods.set(`${s.building.id} ${s.periodStart} ${s.periodEnd}`, {
				buildingId: s.building.id,
				periodStart: s.periodStart,
				periodEnd: s.periodEnd
			});
	}
	const names = new Map(
		(await db.select({ id: buildings.id, name: buildings.name }).from(buildings)).map((b) => [
			b.id,
			b.name
		])
	);
	return [...periods.values()]
		.map((p) => ({ ...p, buildingName: names.get(p.buildingId) ?? '' }))
		.sort(
			(a, b) =>
				b.periodEnd.localeCompare(a.periodEnd) || a.buildingName.localeCompare(b.buildingName)
		);
}
