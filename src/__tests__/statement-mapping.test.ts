import { describe, it, expect } from 'vitest';
import { loadStatement, toStatement } from '../lib/server/statement';
// What GET /api/v1/statements/:id answers, checked against the real API (backend/src/__tests__/api-contracts.pg.test.ts)
import backendStatement from '../../tests/contracts/statement.json';
import resetStatement from '../../tests/contracts/statement-payment-reset.json';

describe('Abrechnung aus dem Backend', () => {
	it('zeigt den Satz der Verwaltungspauschale, mit dem die Abrechnung erstellt wurde', () => {
		expect(toStatement(backendStatement).managementFeePercent).toBe(3);
	});

	// #448: die Schlussabrechnung, der Übertrag aus der letzten Abrechnung und was davon schon verrechnet ist
	it('übernimmt Schlussabrechnung, Übertrag und Verrechnetes als Zahlen', () => {
		const statement = toStatement({
			...backendStatement,
			final: true,
			carriedFrom: { id: 's0', statementNumber: 'NK-2023-1', balance: '-3.00' },
			offsetWith: [{ statementNumber: 'NK-2025-1', amount: '3.00' }]
		});

		expect(statement).toMatchObject({
			final: true,
			carriedFrom: { id: 's0', statementNumber: 'NK-2023-1', balance: -3 },
			offsetWith: [{ statementNumber: 'NK-2025-1', amount: 3 }]
		});
		expect(toStatement(backendStatement)).toMatchObject({ final: false, carriedFrom: null, offsetWith: [] });
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

	// #120: die berichtigte Abrechnung nennt die ersetzte und rechnet an, was darauf bezahlt ist
	it('übernimmt ersetzte und berichtigte Abrechnung und das schon Bezahlte', () => {
		const replaces = { id: 's0', statementNumber: 'NK-A', statementDate: '2025-01-15' };
		expect(
			toStatement({ ...backendStatement, replaces, replacedBy: { id: 's9', statementNumber: 'NK-C' }, priorPayments: '442.90', priorPaidOn: ['NK-A'] })
		).toMatchObject({ replaces, replacedBy: { id: 's9', statementNumber: 'NK-C' }, priorPayments: 442.9, priorPaidOn: ['NK-A'] });
		expect(toStatement(backendStatement)).toMatchObject({ replaces: null, replacedBy: null, priorPayments: 0, priorPaidOn: [] });
		// the dialog offsets what was paid; the replaced statement leads to its contract
		expect(toStatement({ ...backendStatement, paidAmount: '442.90' })).toMatchObject({ paidAmount: 442.9, contractId: 'c1' });
	});

	// #248: die abgerechneten Mietstage, wie die Abrechnung sie gespeichert hat
	it('übernimmt die abgerechneten Tage des Mietvertrags', () => {
		const statement = toStatement({ ...backendStatement, rentalStart: '2024-07-01' });
		expect([statement.rentalStart, statement.rentalEnd]).toEqual(['2024-07-01', '2024-12-31']);
	});

	it('übernimmt Mieter, Wohnung, Bemerkungen und Kostenpositionen', () => {
		expect(toStatement(backendStatement)).toMatchObject({
			tenantName: 'Eva Frei',
			tenantLanguage: 'fr',
			apartmentUnit: '3.01',
			buildingName: 'Lindenhof',
			notes: 'Hauswart neu',
			lineItems: [{ categoryName: 'Heating', tenantShare: 1000, percentage: 100 }]
		});
	});

	// #104: Wohnungsanteil und Zeitanteil wie im PDF
	it('übernimmt Wohnungsanteil, Zeitanteil und die Tage jeder Position', () => {
		expect(toStatement(backendStatement).lineItems[0]).toMatchObject({
			apartmentShare: 1000,
			periodShare: 1,
			shareDays: { days: 366, total: 366 }
		});
	});

	// #96, #104: die Rechnungen, die eine Position abrechnet; bei verschiedenen Tagen jede mit ihren Tagen (#240)
	it('übernimmt die abgerechneten Rechnungen jeder Position, mit ihren Tagen, wo sie verschieden sind', () => {
		const [line] = backendStatement.lineItems;
		const invoiceParts = [{ start: '2024-01-01', end: '2024-12-31', amount: 1000, days: 91, total: 366, noPeriod: true }];
		const [item] = toStatement({ ...backendStatement, lineItems: [{ ...line, invoiceParts }] }).lineItems;

		expect(item.invoices).toEqual([
			{ ...line.invoices[0], part: invoiceParts[0] }
		]);
		expect(toStatement(backendStatement).lineItems[0].invoices[0].part).toBeNull();
	});

	// Persona Marco P-1: bei Heizkosten nach Heizprofil ist der Zeitanteil der Anteil nach dem Heizprofil, wie das PDF sagt
	it('erkennt eine Position, deren Zeitanteil der Anteil nach dem Heizprofil ist', () => {
		const [line] = backendStatement.lineItems;
		const heatingShare = { byDays: false, percent: 55.8, months: [] };
		const heating = { ...line, periodShare: '0.5580', positionRentalDays: null, billedDays: null };
		const items = (statement: object) => toStatement({ ...backendStatement, ...statement }).lineItems;

		expect(items({ heatingShare, lineItems: [heating, line] }).map((item) => item.byProfile)).toEqual([true, false]);
		expect(items({ heatingShare: { byDays: true }, lineItems: [heating] })[0].byProfile).toBe(false);
	});

	// Vor #96 kannte eine Position ihre Rechnungen nicht
	it('nennt bei einer älteren Abrechnung keine Rechnungen der Positionen', () => {
		const [line] = backendStatement.lineItems;
		const statement = toStatement({ ...backendStatement, lineItems: [{ ...line, invoices: null }] });
		expect(statement.lineItems[0].invoices).toEqual([]);
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
