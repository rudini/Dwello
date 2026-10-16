/**
 * «Abgerechnet bis» (#133): up to that day the Nebenkosten of the contract are billed outside Dwello, so Dwello bills
 * Mietstage, heating share and Akonto only from the day after (real PostgreSQL database)
 *
 * Apartment 2.01 (70 m², the building's only one) rented since 2020 with CHF 100 Akonto. Caretaker CHF 732 for 2024
 * (2.00 a day), heating CHF 1000 with a profile whose May to December carry 52 %.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, heatingProfiles, invoices } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

type LineItem = { isHeatingCost: boolean; periodShare: number; tenantShare: number };

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let heatingProfileId: string;

const billedUntil = (date: string | null) =>
	sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { billedUntil: date });

const preview = (periodStart = '2024-01-01', periodEnd = '2024-12-31') =>
	callApi('/api/v1/statements/preview', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ contractId: rental.contract, periodStart, periodEnd, heatingProfileId })
	});

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2020-01-01', monthlyAdvancePayment: '100' });
	await insertInvoice(rental.building, { amount: '732.00', invoiceDate: '2024-06-30' });
	const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
	await insertInvoice(rental.building, { categoryId: heating.id, amount: '1000.00', invoiceDate: '2024-06-30' });
	const [profile] = await db
		.insert(heatingProfiles)
		.values({
			name: `Abgerechnet bis ${token}`,
			type: 'custom',
			januaryPct: '18',
			februaryPct: '14',
			marchPct: '11',
			aprilPct: '5',
			mayPct: '2',
			junePct: '0',
			julyPct: '0',
			augustPct: '0',
			septemberPct: '2',
			octoberPct: '8',
			novemberPct: '14',
			decemberPct: '26'
		})
		.returning();
	heatingProfileId = profile.id;
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
	await db.delete(heatingProfiles).where(eq(heatingProfiles.id, heatingProfileId));
});

describe('Abgerechnet bis', () => {
	it('speichert «Abgerechnet bis» am Mietvertrag und vergisst es ohne Datum', async () => {
		expect((await billedUntil('2024-04-30')).status).toBe(200);
		expect(await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()).toMatchObject({ billedUntil: '2024-04-30' });
		expect((await billedUntil(null)).status).toBe(200);
		expect(await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()).toMatchObject({ billedUntil: null });
	});

	it('zählt Mietstage, Heizanteil und Akonto erst ab dem Tag nach «Abgerechnet bis»', async () => {
		await billedUntil('2024-04-30');
		const statement = (await (await preview()).json()) as {
			rentalDays: number;
			rentalStart: string;
			totalAdvancePayments: number;
			lineItems: LineItem[];
		};
		// 01.05. to 31.12.2024: 245 days, 8 months of Akonto
		expect(statement).toMatchObject({ rentalDays: 245, rentalStart: '2024-05-01', totalAdvancePayments: 800 });
		expect(statement.lineItems.find((line) => !line.isHeatingCost)?.tenantShare).toBe(490);
		expect(statement.lineItems.find((line) => line.isHeatingCost)).toMatchObject({ periodShare: 0.52, tenantShare: 520 });
	});

	it('rechnet eine Abrechnungsperiode, die bis «Abgerechnet bis» endet, nicht ab', async () => {
		await billedUntil('2024-12-31');
		const response = await preview();
		expect(response.ok).toBe(false);
		expect(await response.json()).toMatchObject({ code: 'CONTRACT_NOT_IN_PERIOD' });
	});
});
