import { describe, expect, it } from 'bun:test';
import { heatingSum } from '../services/statement-run.service';

// #508 (Fachreview 508-1 M-1, V-3, V-4): what the apartment's statements bill for its heating costs, against the tenants' part
describe('Summe der Heizkosten einer Wohnung beim Mieterwechsel', () => {
	it('nennt, wie viel die Abrechnungen zu wenig verrechnen, wenn die neue nach der alten Regel versendet ist', () => {
		expect(heatingSum({ costs: 2000, tenants: 1920, billed: 1390, unagreed: false })).toEqual({
			costs: '2000.00',
			tenants: '1920.00',
			landlord: '80.00',
			billed: '1390.00',
			difference: '530.00',
			result: 'less',
			landlordFor: 'vacancy'
		});
	});

	it('nennt Rappen aus der Rundung gleich viel', () => {
		expect(
			heatingSum({ costs: 2000, tenants: 2000, billed: 2000.04, unagreed: false })
		).toMatchObject({ difference: '0.04', result: 'equal', landlordFor: null });
	});

	it('nennt den Anteil eines Mietvertrags ohne vereinbarte Heizkosten beim Vermieter', () => {
		expect(heatingSum({ costs: 2000, tenants: 1500, billed: 1500, unagreed: true })).toMatchObject({
			landlord: '500.00',
			result: 'equal',
			landlordFor: 'leases'
		});
	});
});
