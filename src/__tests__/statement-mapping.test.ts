import { describe, it, expect } from 'vitest';
import { loadStatement, toStatement } from '../lib/server/statement';
// What GET /api/v1/statements/:id answers, checked against the real API (backend/src/__tests__/api-contracts.pg.test.ts)
import backendStatement from '../../tests/contracts/statement.json';
import resetStatement from '../../tests/contracts/statement-payment-reset.json';

describe('Abrechnung aus dem Backend', () => {
	it('zeigt den Satz der Verwaltungspauschale, mit dem die Abrechnung erstellt wurde', () => {
		expect(toStatement(backendStatement).managementFeePercent).toBe(3);
	});

	// A-10: wer neu abrechnet, sieht, welches Heizprofil diese Abrechnung verwendet
	it('nennt das Heizprofil der Abrechnung', () => {
		expect(toStatement(backendStatement).heatingProfileName).toBe('Standard');
		expect(toStatement({ ...backendStatement, heatingProfile: null }).heatingProfileName).toBe('');
	});

	// #229 (F-7): ein eigenes Heizprofil lässt sich umbenennen; die Abrechnung nennt es, wie sie es gespeichert hat
	it('nennt das Heizprofil, wie die Abrechnung es gespeichert hat', () => {
		const names = { name: 'Winter', nameDE: 'Winter', nameFR: null, nameIT: null, nameEN: null };
		const heatingShare = { byDays: false, percent: 43, months: [], names };
		expect(toStatement({ ...backendStatement, heatingShare }).heatingProfileName).toBe('Winter');
	});

	// #247: nach Tagen geteilt, das gewählte Heizprofil mit dem Namen beim Erstellen und dem Grund
	it('nennt das Heizprofil einer nach Tagen geteilten Abrechnung als nicht angewendet, mit dem Grund', () => {
		const names = { name: 'Winter', nameDE: 'Winter', nameFR: null, nameIT: null, nameEN: null };
		const named = (heatingShare: object) => toStatement({ ...backendStatement, heatingShare }).heatingProfileName;

		expect(named({ byDays: true, reason: 'wholePeriod', names })).toBe(
			'Winter (nicht angewendet: Mietvertrag über die ganze Periode)'
		);
		expect(named({ byDays: true, reason: 'noHeatingMonths', names })).toBe(
			'Winter (nicht angewendet: die Monate der Abrechnungsperiode haben im Heizprofil zusammen 0 %)'
		);
		// stored before #247: no name, no reason; the profile as it is now
		expect(named({ byDays: true })).toBe('Standard (nicht angewendet)');
	});

	// #92: der Verlauf nennt jede zurückgesetzte Zahlung
	it('übernimmt die zurückgesetzten Zahlungen', () => {
		expect(toStatement(resetStatement).paymentResets).toEqual([
			{ resetOn: '2025-02-10', paidDate: '2025-02-05' }
		]);
		expect(toStatement(backendStatement).paymentResets).toEqual([]);
	});

	it('übernimmt Mieter, Wohnung, Bemerkungen und Kostenpositionen', () => {
		expect(toStatement(backendStatement)).toMatchObject({
			tenantName: 'Eva Frei',
			apartmentUnit: '3.01',
			buildingName: 'Lindenhof',
			notes: 'Hauswart neu',
			lineItems: [{ categoryName: 'Heating', tenantShare: 1000, percentage: 100 }]
		});
	});

	// Wie im PDF auf zwei Stellen: der Anteil an den Gebäudekosten ist selten rund
	it('zeigt den Anteil an den Gebäudekosten auf zwei Stellen', () => {
		const [line] = backendStatement.lineItems;
		const statement = toStatement({
			...backendStatement,
			lineItems: [{ ...line, sharePercentage: '26.7233' }]
		});

		expect(statement.lineItems[0].percentage).toBe(26.72);
	});
});

describe('Abrechnung laden', () => {
	const heating = { id: 'c1', name: 'Heating', nameDE: 'Heizung' };
	const perArea = { id: 'k1', name: 'Per Area (m²)', nameDE: 'Pro Fläche (m²)' };
	const backend = (lineItems: unknown[]) =>
		(async (url: string) => {
			if (url.includes('/categories')) return Response.json({ categories: [heating] });
			if (url.includes('/distribution-keys')) return Response.json({ data: [perArea] });
			return Response.json({ ...backendStatement, lineItems });
		}) as typeof globalThis.fetch;

	it('nennt Kategorie und Verteilschlüssel jeder Position deutsch', async () => {
		const { lineItems } = await loadStatement(backend(backendStatement.lineItems), 's1');

		expect(lineItems[0]).toMatchObject({
			categoryName: 'Heizung',
			distributionKeyName: 'Pro Fläche (m²)'
		});
	});

	// Ohne Verteilschlüssel verteilt die Berechnung gleichmässig auf die Wohnungen
	it('nennt eine Position ohne Verteilschlüssel gleichmässig verteilt', async () => {
		const [line] = backendStatement.lineItems;
		const { lineItems } = await loadStatement(
			backend([{ ...line, distributionKeyId: null }]),
			's1'
		);

		expect(lineItems[0].distributionKeyName).toBe('Gleichmässig pro Wohnung');
	});
});
