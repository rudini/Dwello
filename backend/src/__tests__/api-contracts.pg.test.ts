/**
 * The backend answers with every field the frontend reads (tests/contracts, real PostgreSQL database):
 * the frontend unit tests use these samples as backend answers, so they cannot drift from the real API.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { join } from 'path';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import { deleteStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const contracts = join(import.meta.dir, '..', '..', '..', 'tests', 'contracts');
const sample = (name: string) => Bun.file(join(contracts, `${name}.json`)).json();

const kind = (value: unknown) => (value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value);

/** Paths of the sample's fields that the real answer lacks or delivers with another JSON type (null allowed) */
function drift(expected: unknown, actual: unknown, path = ''): string[] {
	if (expected === null || actual === null) return [];
	if (kind(expected) !== kind(actual)) return [`${path || '.'}: ${kind(expected)} erwartet, ${kind(actual)} geliefert`];
	if (Array.isArray(expected)) {
		if (expected.length === 0) return [];
		if ((actual as unknown[]).length === 0) return [`${path}[]: leer geliefert`];
		return drift(expected[0], (actual as unknown[])[0], `${path}[0]`);
	}
	if (kind(expected) !== 'object') return [];
	return Object.entries(expected as Record<string, unknown>).flatMap(([key, value]) =>
		key in (actual as object)
			? drift(value, (actual as Record<string, unknown>)[key], `${path}.${key}`)
			: [`${path}.${key}: fehlt`]
	);
}

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let statementId: string;
const period = { periodStart: '2024-01-01', periodEnd: '2024-12-31' };

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', monthlyAdvancePayment: '150' });
	await insertInvoice(rental.building, { amount: '1000.00', invoiceDate: '2024-06-30' });
	const response = await sendJson('POST', '/api/v1/statements/generate', {
		...period,
		contractId: rental.contract,
		buildingId: rental.building,
		managementFeePercent: 3
	});
	statementId = ((await response.json()) as { id: string }).id;
});

afterAll(async () => {
	await deleteStatement(statementId);
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('API-Verträge des Frontends', () => {
	it('GET /statements/:id liefert die Felder von statement.json', async () => {
		const actual = await (await callApi(`/api/v1/statements/${statementId}`)).json();
		expect(drift(await sample('statement'), actual)).toEqual([]);
	});

	it('GET /contracts?buildingId liefert die Felder von building-contracts.json', async () => {
		const actual = await (await callApi(`/api/v1/contracts?buildingId=${rental.building}&limit=1000`)).json();
		expect(drift(await sample('building-contracts'), actual)).toEqual([]);
	});

	it('POST /statements/preview liefert die Felder von statement-preview.json', async () => {
		const actual = await (await sendJson('POST', '/api/v1/statements/preview', { ...period, contractId: rental.contract })).json();
		expect(drift(await sample('statement-preview'), actual)).toEqual([]);
	});
});
