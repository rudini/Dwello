/**
 * «Mieter ist ausgezogen» is stored on an expired fixed-term contract, so the overview stops asking (A-6, #115)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { callApi, sendJson } from './helpers/auth';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;

const put = (body: Record<string, unknown>) => sendJson('PUT', `/api/v1/contracts/${rental.contract}`, body);
const stored = async () => (await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()) as Record<string, unknown>;

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), {
		startDate: '2024-01-01',
		endDate: '2025-12-31',
		monthlyAdvancePayment: '100'
	});
});

afterAll(() => rental.remove());

describe('Mieter ist ausgezogen', () => {
	it('ist bei einem neuen Mietvertrag nicht bestätigt', async () => {
		expect(await stored()).toMatchObject({ movedOut: false });
	});

	it('speichert die Bestätigung am Mietvertrag und nennt sie auch in der Liste', async () => {
		expect((await put({ movedOut: true })).status).toBe(200);

		expect(await stored()).toMatchObject({ endDate: '2025-12-31', movedOut: true });
		const list = (await (await callApi(`/api/v1/contracts?apartmentId=${rental.apartment}`)).json()) as { contracts: unknown[] };
		expect(list.contracts).toMatchObject([{ id: rental.contract, movedOut: true }]);
	});

	// Fachreview A-6 V-3: die Bestätigung gilt für ein Vertragsende
	it('vergisst die Bestätigung, wenn sich das Vertragsende ändert', async () => {
		expect((await put({ endDate: '2026-03-31' })).status).toBe(200);
		expect(await stored()).toMatchObject({ endDate: '2026-03-31', movedOut: false });
		expect((await put({ movedOut: true })).status).toBe(200);
	});

	it('vergisst die Bestätigung, wenn der Mietvertrag unbefristet weiterläuft', async () => {
		expect((await put({ endDate: null })).status).toBe(200);

		expect(await stored()).toMatchObject({ endDate: null, movedOut: false });
	});
});
