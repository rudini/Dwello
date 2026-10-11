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
const alpenblick = '33333333-3333-3333-3333-333333333333';

// Abrechnungsläufe as a property manager would have made them: 2024 settled and paid; 2025 created for Musterhaus
// (one sent) and Seepark (with the tenant change in A2 as two statements of part of the year); Alpenblick 2025
// waits for its missing invoices. Seepark's district heating also heats the water.
const runs = [
	{ buildingId: musterhaus, year: 2024, date: '2025-04-14', profile: 'Heating Mittelland', contracts: ['b0000001-0001-0001-0001-000000000001', 'b0000001-0001-0001-0001-000000000002', 'b0000001-0001-0001-0001-000000000003', 'b0000001-0001-0001-0001-000000000005'], status: 'paid' },
	{ buildingId: seepark, year: 2024, date: '2025-04-14', profile: 'Heating + Hot Water', contracts: ['b0000002-0002-0002-0002-000000000001', 'b0000002-0002-0002-0002-000000000002', 'b0000002-0002-0002-0002-000000000004'], status: 'paid' },
	{ buildingId: alpenblick, year: 2024, date: '2025-04-14', profile: 'Heating Mittelland', contracts: ['b0000003-0003-0003-0003-000000000001', 'b0000003-0003-0003-0003-000000000002'], status: 'paid' },
	{ buildingId: musterhaus, year: 2025, date: '2026-09-28', profile: 'Heating Mittelland', contracts: ['b0000001-0001-0001-0001-000000000001'], status: 'sent' },
	{ buildingId: musterhaus, year: 2025, date: '2026-09-28', profile: 'Heating Mittelland', contracts: ['b0000001-0001-0001-0001-000000000002', 'b0000001-0001-0001-0001-000000000003', 'b0000001-0001-0001-0001-000000000005'], status: 'draft' },
	{ buildingId: seepark, year: 2025, date: '2026-09-28', profile: 'Heating + Hot Water', contracts: ['b0000002-0002-0002-0002-000000000001', 'b0000002-0002-0002-0002-000000000002', 'b0000002-0002-0002-0002-000000000003', 'b0000002-0002-0002-0002-000000000004'], status: 'draft' }
];

const addDays = (date: string, days: number) => {
	const day = new Date(date);
	day.setUTCDate(day.getUTCDate() + days);
	return day.toISOString().split('T')[0];
};

type Run = (typeof runs)[number];

// A statement generated, rendered and moved on like one the property manager makes
async function generateDemoStatement(contractId: string, { buildingId, year, date, status }: Run, heatingProfileId?: string) {
	const statement = await generateStatement({
		contractId,
		buildingId,
		periodStart: `${year}-01-01`,
		periodEnd: `${year}-12-31`,
		heatingProfileId
	});
	if (status !== 'draft') {
		await updateStatementStatus(statement.id, 'sent');
		// Sent back then, not on the day the demo data is loaded; the payment deadline keeps the app's 30 days
		await updateStatement(statement.id, { statementDate: date, paymentDeadline: addDays(date, 30) });
	}
	if (status === 'paid') await updateStatementStatus(statement.id, 'paid', { paidDate: addDays(date, 21) });
	await generateStatementPdf(statement.id);
}

export async function loadDemoData() {
	await migrate(DATABASE_URL, join(backend, 'migrations'));
	await pool.query(await Bun.file(join(backend, 'demo', 'demo-data.sql')).text());
	for (const run of runs) await generateRun(run);
}

// The statements of a run that do not exist yet: loading the demo data again adds nothing
async function generateRun(run: Run) {
	const profile = await getHeatingProfileByName(run.profile);
	for (const contractId of run.contracts) {
		const [existing] = await db
			.select({ id: utilityStatements.id })
			.from(utilityStatements)
			.where(and(eq(utilityStatements.contractId, contractId), eq(utilityStatements.periodStart, `${run.year}-01-01`)));
		if (!existing) await generateDemoStatement(contractId, run, profile?.id);
	}
}
