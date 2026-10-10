import { describe, it, expect } from 'vitest';
import { actions } from '../routes/statements/generate/+page.server';

const run = {
	buildingIds: 'b1',
	periodStart: '2024-01-01',
	periodEnd: '2024-12-31',
	heatingProfileId: 'hp1',
	managementFeePercent: '3'
};

describe('Vorschau der Abrechnungen', () => {
	it('liefert neben der Vorschau die Rechnungen jedes Gebäudes in der Periode', async () => {
		// a building without contracts and invoices: every list answers empty
		const form = new FormData();
		for (const [name, value] of Object.entries(run)) form.append(name, value);
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		const fetch = async (url: string) =>
			Response.json(url.includes('/for-statement/') ? [] : { contracts: [], data: [], total: 0 });
		const result = (actions.preview as (event: unknown) => Promise<unknown>)({ fetch, request });
		expect(await result).toEqual({
			preview: [],
			invoices: [{ buildingId: 'b1', count: 0, first: null, last: null, statements: 0, check: expect.anything() }]
		});
	});
});
