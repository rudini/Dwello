/**
 * A flat is let to one tenant at a time: new contracts and changed dates that overlap another contract are refused
 * (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { apiRecords } from './helpers/records';
import { createRental } from './helpers/rental';

const contracts = apiRecords('contracts');
let rental: Awaited<ReturnType<typeof createRental>>;
let nextTenant: string;

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
	const token = crypto.randomUUID();
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
