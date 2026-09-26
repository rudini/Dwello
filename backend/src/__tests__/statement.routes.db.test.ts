/**
 * Statement list route against the real PostgreSQL database (docker compose postgres on 5432)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { statementRoutes } from '../routes/statements';
import { deleteStatement } from '../services/statement.service';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let statementId: string;

const call = async (path: string, init?: RequestInit) =>
	(await statementRoutes.handle(new Request(`http://localhost/api/v1/statements${path}`, init))).json();

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', monthlyAdvancePayment: '150' });
	const statement = (await call('/generate', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31'
		})
	})) as { id: string };
	statementId = statement.id;
});

afterAll(async () => {
	await deleteStatement(statementId);
	await rental.remove();
});

describe('GET /api/v1/statements?search', () => {
	it('findet Abrechnungen über den vollen Namen des Mieters', async () => {
		const result = (await call(`?search=${encodeURIComponent(`Anna Keller ${token}`)}`)) as { data: { id: string }[] };

		expect(result.data.map((s) => s.id)).toEqual([statementId]);
	});
});
