/**
 * «Nebenkostenpauschale» (#429): a fixed monthly amount on the Mietvertrag that counts in «Monatlich total» and is
 * never billed (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { callApi, sendJson } from './helpers/auth';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;

const contract = async () => (await callApi(`/api/v1/contracts/${rental.contract}`)).json();

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2020-01-01', monthlyAdvancePayment: '0' });
});

afterAll(async () => {
	await rental.remove();
});

describe('Nebenkostenpauschale', () => {
	it('ist ohne Angabe 0', async () => {
		expect((await contract()).flatRateUtilityCharge).toBe('0.00');
	});

	it('steht nach dem Speichern beim Mietvertrag', async () => {
		const response = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { flatRateUtilityCharge: '120' });
		expect(response.status).toBe(200);
		expect((await contract()).flatRateUtilityCharge).toBe('120.00');
	});
});
