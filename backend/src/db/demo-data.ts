/**
 * Loads the demo data (demo/demo-data.sql) into the database in DATABASE_URL, after the migrations: for trying the
 * app and showing it. Never part of the migrations, so production starts without it; loading it again adds nothing.
 */

import { and, eq } from 'drizzle-orm';
import { join } from 'path';
import { generateStatementPdf } from '../services/statement-pdf.service';
import { generateStatement, updateStatementStatus } from '../services/statement.service';
import { DATABASE_URL, db, pool } from './connection';
import { migrate } from './migrate';
import { utilityStatements } from './schema';

const backend = join(import.meta.dir, '..', '..');

// Statements of 2024 the app generates like any other, in the states a statement goes through
const statements = [
	{ contractId: 'b0000001-0001-0001-0001-000000000001', buildingId: '11111111-1111-1111-1111-111111111111', status: 'sent' },
	{ contractId: 'b0000001-0001-0001-0001-000000000002', buildingId: '11111111-1111-1111-1111-111111111111', status: 'draft' },
	{ contractId: 'b0000002-0002-0002-0002-000000000001', buildingId: '22222222-2222-2222-2222-222222222222', status: 'paid' }
];
const period = { periodStart: '2024-01-01', periodEnd: '2024-12-31' };

// A statement generated, rendered and moved on like one the property manager makes
async function generateDemoStatement({ contractId, buildingId, status }: (typeof statements)[number]) {
	const statement = await generateStatement({ contractId, buildingId, ...period });
	await generateStatementPdf(statement.id);
	if (status === 'draft') return;
	await updateStatementStatus(statement.id, 'sent');
	if (status === 'paid') {
		await updateStatementStatus(statement.id, 'paid', { paidDate: statement.statementDate });
	}
}

export async function loadDemoData() {
	await migrate(DATABASE_URL, join(backend, 'migrations'));
	await pool.query(await Bun.file(join(backend, 'demo', 'demo-data.sql')).text());

	for (const demo of statements) {
		const [existing] = await db
			.select({ id: utilityStatements.id })
			.from(utilityStatements)
			.where(and(eq(utilityStatements.contractId, demo.contractId), eq(utilityStatements.periodStart, period.periodStart)));
		if (!existing) await generateDemoStatement(demo);
	}
}
