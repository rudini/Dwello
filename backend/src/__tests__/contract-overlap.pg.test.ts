/**
 * A flat is let to one tenant at a time: new contracts and changed dates that overlap another contract are refused
 * (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { tenants } from '../db/schema';
import { apiRecords } from './helpers/records';
import { createRental } from './helpers/rental';

const contracts = apiRecords('contracts');
let rental: Awaited<ReturnType<typeof createRental>>;
let nextTenant: string;
let token: string;

// Contract of the next tenant for the flat let from 2024-04-01 without an end date
const letTo = (startDate: string, endDate: string) =>
	contracts.create({
		apartmentId: rental.apartment,
		tenantId: nextTenant,
		startDate,
		endDate,
		baseRent: '950',
		monthlyAdvancePayment: '150'
	});

beforeAll(async () => {
	token = crypto.randomUUID();
	rental = await createRental(token, { startDate: '2024-04-01', monthlyAdvancePayment: '150' });
	nextTenant = (await createTenant({ firstName: 'Beat', lastName: `Huber ${token}` })).id;
});

afterAll(async () => {
	await contracts.removeAll();
	await deleteTenant(nextTenant);
	await rental.remove();
});

describe('POST /api/v1/contracts', () => {
	it('lehnt einen Vertrag ab, der während des laufenden Vertrags beginnt', async () => {
		const response = await letTo('2025-01-01', '2025-12-31');

		expect(response.status).toBe(400);
		const body = (await response.json()) as { error: string; code: string; params: object };
		expect(body.error).toContain(rental.contract);
		expect(body).toMatchObject({ code: 'CONTRACT_OVERLAP', params: { contract: rental.contract } });
	});

	// #667 (Dr. Weber W-04): the refusal names the other contract, so the UI can say which one and what helps
	it('nennt in der Ablehnung Mieter und Zeitraum des anderen Mietvertrags', async () => {
		const response = await letTo('2025-01-01', '2025-12-31');

		expect(((await response.json()) as { params: object }).params).toEqual({
			contract: rental.contract,
			tenant: `Anna Keller ${token}`,
			start: '2024-04-01',
			terminated: 0
		});
	});

	it('nennt das Vertragsende eines befristeten anderen Mietvertrags', async () => {
		const fixed = (await (await letTo('2019-01-01', '2019-12-31')).json()) as { id: string };

		const response = await letTo('2019-06-01', '2019-06-30');

		expect(((await response.json()) as { params: object }).params).toEqual({
			contract: fixed.id,
			tenant: `Beat Huber ${token}`,
			start: '2019-01-01',
			end: '2019-12-31',
			terminated: 0
		});
	});

	// fach review b667 V-4: Dwello shows an anonymised tenant without a name
	it('nennt einen anonymisierten Mieter nicht beim Namen', async () => {
		const fixed = (await (await letTo('2017-01-01', '2017-12-31')).json()) as { id: string };
		await db.update(tenants).set({ anonymisedOn: '2026-01-01' }).where(eq(tenants.id, nextTenant));
		try {
			const response = await letTo('2017-06-01', '2017-06-30');

			expect(((await response.json()) as { params: object }).params).toEqual({
				contract: fixed.id,
				start: '2017-01-01',
				end: '2017-12-31',
				terminated: 0
			});
		} finally {
			await db.update(tenants).set({ anonymisedOn: null }).where(eq(tenants.id, nextTenant));
		}
	});

	it('lehnt einen früheren Vertrag ab, der am Starttag des laufenden Vertrags endet', async () => {
		expect((await letTo('2023-01-01', '2024-04-01')).status).toBe(400);
	});

	it('nimmt einen früheren Vertrag an, der vor dem laufenden Vertrag endet', async () => {
		expect((await letTo('2023-01-01', '2024-03-31')).status).toBe(201);
	});
});

describe('PUT /api/v1/contracts/:id', () => {
	it('lehnt neue Daten ab, mit denen der Vertrag den laufenden Vertrag überschneidet', async () => {
		const earlier = (await (await letTo('2021-01-01', '2021-12-31')).json()) as { id: string };

		const response = await contracts.send('PUT', `/${earlier.id}`, {
			endDate: '2024-06-30',
			confirmPastEnd: true
		});

		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'CONTRACT_OVERLAP' });
	});
});
