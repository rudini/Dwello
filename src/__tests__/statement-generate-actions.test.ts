import { describe, it, expect } from 'vitest';
import { actions } from '../routes/statements/generate/+page.server';
import { runAction } from './helpers/action';

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
		const { result } = runAction(actions.preview, '', 200, run, { contracts: [], invoices: [], data: [], total: 0 });
		expect(await result).toEqual({
			preview: [],
			invoices: [{ buildingId: 'b1', count: 0, first: null, last: null, statements: 0 }]
		});
	});
});
