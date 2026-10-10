/**
 * Loads the demo data (demo/demo-data.sql) into the database in DATABASE_URL, after the migrations: for trying the
 * app and showing it. Never part of the migrations, so production starts without it; loading it again adds nothing.
 */

import { and, eq } from 'drizzle-orm';
import { join } from 'path';
import { getHeatingProfileByName } from '../services/heating-profile.service';
import { generateStatementPdf } from '../services/statement-pdf.service';
import { generateStatement, updateStatement, updateStatementStatus } from '../services/statement.service';
import { DATABASE_URL, db, pool } from './connection';
import { migrate } from './migrate';
import { utilityStatements } from './schema';

const backend = join(import.meta.dir, '..', '..');

const musterhaus = '11111111-1111-1111-1111-111111111111';
const seepark = '22222222-2222-2222-2222-222222222222';

// Statements the app generates like any other, dated as a property manager would have made them: 2024 is settled,
// 2025 partly sent; the tenant change in Seepark A2 gives two statements of part of the year
const statements = [
	{ contractId: 'b0000001-0001-0001-0001-000000000001', buildingId: musterhaus, year: 2024, status: 'paid', date: '2025-04-14' },
	{ contractId: 'b0000002-0002-0002-0002-000000000001', buildingId: seepark, year: 2024, status: 'paid', date: '2025-04-14' },
	{ contractId: 'b0000001-0001-0001-0001-000000000001', buildingId: musterhaus, year: 2025, status: 'sent', date: '2026-09-28' },
	{ contractId: 'b0000001-0001-0001-0001-000000000002', buildingId: musterhaus, year: 2025, status: 'draft', date: '2026-09-28' },
	{ contractId: 'b0000002-0002-0002-0002-000000000002', buildingId: seepark, year: 2025, status: 'draft', date: '2026-09-28' },
	{ contractId: 'b0000002-0002-0002-0002-000000000003', buildingId: seepark, year: 2025, status: 'draft', date: '2026-09-28' }
];

const addDays = (date: string, days: number) => {
	const day = new Date(date);
	day.setUTCDate(day.getUTCDate() + days);
	return day.toISOString().split('T')[0];
};

// A statement generated, rendered and moved on like one the property manager makes
async function generateDemoStatement(
	{ contractId, buildingId, year, status, date }: (typeof statements)[number],
	heatingProfileId: string | undefined
) {
	const statement = await generateStatement({
		contractId,
		buildingId,
		periodStart: `${year}-01-01`,
		periodEnd: `${year}-12-31`,
		heatingProfileId
	});
	// The payment deadline keeps the 30 days the app gives from the statement date
	await updateStatement(statement.id, { statementDate: date, paymentDeadline: addDays(date, 30) });
	await generateStatementPdf(statement.id);
	if (status === 'draft') return;
	await updateStatementStatus(statement.id, 'sent');
	if (status === 'paid') {
		await updateStatementStatus(statement.id, 'paid', { paidDate: addDays(date, 21) });
	}
}

export async function loadDemoData() {
	await migrate(DATABASE_URL, join(backend, 'migrations'));
	await pool.query(await Bun.file(join(backend, 'demo', 'demo-data.sql')).text());
	// All three buildings lie north of the Alps and heat without hot water
	const heatingProfile = await getHeatingProfileByName('Heating Mittelland');

	for (const demo of statements) {
		const [existing] = await db
			.select({ id: utilityStatements.id })
			.from(utilityStatements)
			.where(and(eq(utilityStatements.contractId, demo.contractId), eq(utilityStatements.periodStart, `${demo.year}-01-01`)));
		if (!existing) await generateDemoStatement(demo, heatingProfile?.id);
	}
}
