/**
 * Check for missing invoices per category through the API (real PostgreSQL)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories } from '../db/schema';
import { callApi } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2020-01-01', monthlyAdvancePayment: '200' });
	const categoryId = async (name: string) => (await db.select().from(categories).where(eq(categories.name, name)))[0].id;
	const water = await categoryId('Cold Water');
	const chimney = await categoryId('Chimney Sweep');
	const mortgage = await categoryId('Mortgage Interest');
	// 2024: water every half-year, the chimney sweep once; 2025 only the first half-year of water
	await insertInvoice(rental.building, { categoryId: water, amount: '460.00', invoiceDate: '2024-06-30' });
	await insertInvoice(rental.building, { categoryId: water, amount: '475.00', invoiceDate: '2024-12-31' });
	await insertInvoice(rental.building, { categoryId: chimney, amount: '290.00', invoiceDate: '2024-10-15' });
	await insertInvoice(rental.building, { categoryId: water, amount: '470.00', invoiceDate: '2025-06-30' });
	// Not allocable: never expected in a statement
	await insertInvoice(rental.building, { categoryId: mortgage, amount: '5000.00', invoiceDate: '2024-03-31', isValidUtilityCost: false });
});

afterAll(async () => {
	await rental.remove();
});

const check = async (query: string) => {
	const response = await callApi(`/api/v1/invoices/completeness/${rental.building}?${query}`);
	return { status: response.status, body: (await response.json()) as { findings: unknown[] } };
};

describe('Prüfung auf fehlende Rechnungen pro Kategorie', () => {
	it('vergleicht die umlagefähigen Rechnungen mit dem gleichen Zeitraum im Vorjahr', async () => {
		const { status, body } = await check('periodStart=2025-01-01&periodEnd=2025-12-31');

		expect(status).toBe(200);
		expect(body).toMatchObject({
			buildingId: rental.building,
			comparedWith: { start: '2024-01-01', end: '2024-12-31' },
			hasComparison: true,
			findings: [
				{ categoryName: 'Kaminfeger', kind: 'missing', previous: { count: 1, total: 290 } },
				{ categoryName: 'Kaltwasser', kind: 'gap', missingParts: [{ start: '2025-07-01', end: '2025-12-31' }], current: { count: 1, total: 470 } }
			]
		});
		expect(body.findings).toHaveLength(2);
	});

	it('meldet für das erste Jahr mit Rechnungen keinen Vergleich', async () => {
		const { body } = await check('periodStart=2024-01-01&periodEnd=2024-12-31');

		expect(body).toMatchObject({ hasComparison: false, findings: [] });
	});

	it('verlangt eine gültige Abrechnungsperiode', async () => {
		expect((await check('periodStart=2025-01-01')).status).toBe(422);
		expect((await check('periodStart=2025-12-31&periodEnd=2025-01-01')).status).toBe(400);
		expect((await check('periodStart=2025-02-30&periodEnd=2025-12-31')).status).toBe(400);
	});

	// Die Rechnung für das 2. Halbjahr kommt im Januar: mit Leistungszeitraum fehlt sie dem Jahr nicht
	it('ordnet eine Rechnung nach ihrem Leistungszeitraum zu', async () => {
		const [water] = await db.select().from(categories).where(eq(categories.name, 'Cold Water'));
		await insertInvoice(rental.building, {
			categoryId: water.id,
			amount: '480.00',
			invoiceDate: '2026-01-20',
			servicePeriodStart: '2025-07-01',
			servicePeriodEnd: '2025-12-31'
		});
		const { body } = await check('periodStart=2025-01-01&periodEnd=2025-12-31');

		expect(body.findings).toMatchObject([{ categoryName: 'Kaminfeger', kind: 'missing' }]);
	});
});
