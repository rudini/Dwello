import { describe, it, expect } from 'vitest';
import { loadStatement, toStatement } from '../lib/server/statement';
// What GET /api/v1/statements/:id answers, checked against the real API (backend/src/__tests__/api-contracts.pg.test.ts)
import backendStatement from '../../tests/contracts/statement.json';

describe('Abrechnung aus dem Backend', () => {
	it('zeigt den Satz der Verwaltungspauschale, mit dem die Abrechnung erstellt wurde', () => {
		expect(toStatement(backendStatement).managementFeePercent).toBe(3);
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
