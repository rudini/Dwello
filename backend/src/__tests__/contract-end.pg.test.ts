/**
 * A contract cannot end before the end of one of its statements: the statement already bills rent days after that day
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { sendJson } from './helpers/auth';
import { idOf } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
let sent: string;
let draft: string;

async function statement(year: number) {
	return idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: `${year}-01-01`,
			periodEnd: `${year}-12-31`
		})
	);
}

const end = (endDate: string | null) => sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { endDate });

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2023-01-01', monthlyAdvancePayment: '100' });
	sent = await statement(2023);
	await sendJson('PUT', `/api/v1/statements/${sent}/status`, { status: 'sent' });
	draft = await statement(2024);
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await rental.remove();
});

describe('Vertragsende und Nebenkostenabrechnungen', () => {
	it('lehnt ein Vertragsende vor dem Ende eines Entwurfs ab und nennt ihn', async () => {
		const response = await end('2024-03-31');

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({
			statements: [{ id: draft, status: 'draft', periodEnd: '2024-12-31' }]
		});
	});

	it('nennt auch eine versandte Abrechnung, die schon Mietstage nach dem Tag enthält', async () => {
		const response = await end('2023-06-30');

		expect(response.status).toBe(409);
		const { statements } = (await response.json()) as { statements: { id: string; status: string }[] };
		expect(statements.map((s) => [s.id, s.status]).sort()).toEqual(
			[
				[sent, 'sent'],
				[draft, 'draft']
			].sort()
		);
	});

	it('nimmt den letzten Tag der Abrechnung und das Aufheben des Vertragsendes an', async () => {
		expect((await end('2024-12-31')).status).toBe(200);
		expect((await end(null)).status).toBe(200);
	});
});

// the billed rent days, not the statement period: a contract that ended mid-year keeps its final statement
describe('Beendeter Mietvertrag mit Schlussabrechnung', () => {
	let ended: Awaited<ReturnType<typeof createRental>>;
	let final: string;
	const put = (body: object) => sendJson('PUT', `/api/v1/contracts/${ended.contract}`, body);

	beforeAll(async () => {
		ended = await createRental(crypto.randomUUID(), {
			startDate: '2023-01-01',
			endDate: '2025-06-30',
			monthlyAdvancePayment: '100'
		});
		final = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: ended.contract,
				buildingId: ended.building,
				periodStart: '2025-01-01',
				periodEnd: '2025-12-31'
			})
		);
	});

	afterAll(async () => {
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, ended.contract));
		await ended.remove();
	});

	it('lässt die Miete ändern, wenn das Vertragsende gleich bleibt', async () => {
		expect((await put({ baseRent: '980', endDate: '2025-06-30' })).status).toBe(200);
	});

	it('nimmt ein späteres Vertragsende an', async () => {
		expect((await put({ endDate: '2025-07-31' })).status).toBe(200);
		expect((await put({ endDate: '2025-06-30' })).status).toBe(200);
	});

	it('lehnt ein früheres Vertragsende ab', async () => {
		const response = await put({ endDate: '2025-05-31' });
		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ statements: [{ id: final }] });
	});

	// die Abrechnung rechnet ab dem 01.01.2025: ein späterer Vertragsbeginn nähme ihr Mietstage weg
	it('lehnt einen Vertragsbeginn nach dem ersten abgerechneten Tag ab', async () => {
		expect((await put({ startDate: '2025-05-01' })).status).toBe(409);
		expect((await put({ startDate: '2022-01-01' })).status).toBe(200);
	});
});

