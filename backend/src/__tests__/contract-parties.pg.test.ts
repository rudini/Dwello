/**
 * B-15 (#152): tenant and apartment of a contract are fixed; a move or a Mieterwechsel is a new contract
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { getContract } from '../services/contract.service';
import { sendJson } from './helpers/auth';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
let other: Awaited<ReturnType<typeof createRental>>;

const put = (body: object) => sendJson('PUT', `/api/v1/contracts/${rental.contract}`, body);

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-04-01', monthlyAdvancePayment: '100' });
	other = await createRental(crypto.randomUUID(), { startDate: '2024-04-01', monthlyAdvancePayment: '100' });
});

afterAll(async () => {
	await rental.remove();
	await other.remove();
});

describe('Mieter und Wohnung eines Mietvertrags', () => {
	it('lehnt eine andere Wohnung ab, statt sie still zu übergehen', async () => {
		const response = await put({ apartmentId: other.apartment, baseRent: '980' });

		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'CONTRACT_PARTIES_FIXED' });
		expect(await getContract(rental.contract)).toMatchObject({ apartmentId: rental.apartment, baseRent: '950.00' });
	});

	it('lehnt einen anderen Mieter ab', async () => {
		const response = await put({ tenantId: other.tenant });

		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'CONTRACT_PARTIES_FIXED' });
		expect(await getContract(rental.contract)).toMatchObject({ tenantId: rental.tenant });
	});

	it('nimmt den gleichen Mieter und die gleiche Wohnung an, wie das Formular sie sendet', async () => {
		const response = await put({ tenantId: rental.tenant, apartmentId: rental.apartment, baseRent: '980' });

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ baseRent: '980.00' });
	});
});
