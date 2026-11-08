/**
 * A flat is let to one tenant at a time: new contracts and changed dates that overlap another contract are refused
 * (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { rentalContracts, tenants } from '../db/schema';
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
			terminated: 0,
			status: 'active'
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
			terminated: 0,
			status: 'ended'
		});
	});

	// fach review b667 V-3 (code review b667 C-2): of two overlapped contracts the earlier one is named
	it('nennt von zwei überschnittenen Mietverträgen den früheren', async () => {
		await letTo('2016-07-01', '2016-12-31'); // created first
		const earlier = (await (await letTo('2016-01-01', '2016-06-30')).json()) as { id: string };

		const response = await letTo('2016-03-01', '2016-09-30');

		expect(((await response.json()) as { params: { contract: string } }).params.contract).toBe(earlier.id);
	});

	// code review b667 C-2: a contract ended by notice is said to be gekündigt
	it('sagt, dass der andere Mietvertrag gekündigt ist', async () => {
		const noticed = await contracts.create({
			apartmentId: rental.apartment,
			tenantId: nextTenant,
			startDate: '2014-01-01',
			endDate: '2014-12-31',
			terminated: true,
			baseRent: '950',
			monthlyAdvancePayment: '150'
		});
		expect(noticed.status).toBe(201);

		const response = await letTo('2014-06-01', '2014-06-30');

		expect(((await response.json()) as { params: object }).params).toMatchObject({ terminated: 1 });
	});

	// #1148: a contract ended by an Aufhebungsvereinbarung is not said to be gekündigt
	it('sagt, dass der andere Mietvertrag mit einer Aufhebungsvereinbarung endet', async () => {
		const agreed = (await (await letTo('2013-01-01', '2013-12-31')).json()) as { id: string };
		await db.update(rentalContracts).set({ terminated: true, byAgreement: true }).where(eq(rentalContracts.id, agreed.id));

		const response = await letTo('2013-06-01', '2013-06-30');

		expect(((await response.json()) as { params: object }).params).toMatchObject({ terminated: 1, byAgreement: 1 });
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
				terminated: 0,
				status: 'ended'
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
