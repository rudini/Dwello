/**
 * «Als geprüft markieren» (#459, #331): the landlord checked the uploaded documents of a former tenant; stored on the
 * last contract with the day, so the overview task ends, and forgotten when that contract's end changes
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { swissToday } from '../services/today';
import { callApi, sendJson } from './helpers/auth';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;

const put = (body: Record<string, unknown>) => sendJson('PUT', `/api/v1/contracts/${rental.contract}`, body);
const stored = async () => (await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()) as Record<string, unknown>;

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-01-01', endDate: '2025-12-31', monthlyAdvancePayment: '100' });
});

afterAll(() => rental.remove());

describe('Dokumente als geprüft markieren', () => {
	it('ist bei einem Mietvertrag nicht geprüft', async () => {
		expect(await stored()).toMatchObject({ documentsCheckedOn: null });
	});

	it('speichert den heutigen Tag am Mietvertrag und nennt ihn auch in der Liste', async () => {
		expect((await put({ documentsChecked: true })).status).toBe(200);

		expect(await stored()).toMatchObject({ endDate: '2025-12-31', documentsCheckedOn: swissToday() });
		const list = (await (await callApi(`/api/v1/contracts?tenantId=${rental.tenant}`)).json()) as { contracts: unknown[] };
		expect(list.contracts).toMatchObject([{ id: rental.contract, documentsCheckedOn: swissToday() }]);
	});

	it('vergisst die Prüfung, wenn sich das Vertragsende ändert', async () => {
		expect((await put({ endDate: '2026-03-31' })).status).toBe(200);
		expect(await stored()).toMatchObject({ endDate: '2026-03-31', documentsCheckedOn: null });
	});
});
