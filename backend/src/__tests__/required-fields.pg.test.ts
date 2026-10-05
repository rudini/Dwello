/**
 * Fields the database requires are required by the API too (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { sendJson } from './helpers/auth';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), {
		startDate: '2024-01-01',
		monthlyAdvancePayment: '0'
	});
});

afterAll(async () => {
	await rental.remove();
});

describe('Pflichtfelder', () => {
	it('verlangt Fläche und Zimmer für eine neue Wohnung', async () => {
		const response = await sendJson('POST', '/api/v1/apartments', {
			buildingId: rental.building,
			number: '9.01',
			floor: 9
		});

		expect(response.status).toBe(422);
	});

	it('lässt Fläche und Zimmer einer Wohnung nicht leeren', async () => {
		const response = await sendJson('PUT', `/api/v1/apartments/${rental.apartment}`, {
			area: null,
			rooms: null
		});

		expect(response.status).toBe(422);
	});

	it('verlangt das Akonto für einen neuen Mietvertrag', async () => {
		const response = await sendJson('POST', '/api/v1/contracts', {
			apartmentId: rental.apartment,
			tenantId: rental.tenant,
			startDate: '2030-01-01',
			baseRent: '950'
		});

		expect(response.status).toBe(422);
	});

	it('lässt das Akonto eines Mietvertrags nicht leeren', async () => {
		const response = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, {
			monthlyAdvancePayment: null
		});

		expect(response.status).toBe(422);
	});
});
