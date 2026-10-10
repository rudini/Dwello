/**
 * Check for missing invoices per category: each category is compared with the same dates one year earlier
 */

import { describe, expect, it } from 'bun:test';
import { checkCategories, yearBefore, type CategoryFinding } from '../services/invoice-completeness.service';

const year2025 = { start: '2025-01-01', end: '2025-12-31' };
const invoice = (categoryName: string, invoiceDate: string, amount = 100) => ({
	categoryId: categoryName.toLowerCase(),
	categoryName,
	amount,
	invoiceDate
});
const quarterly = (category: string, year: number, quarters = [1, 2, 3, 4], amount = 900) =>
	quarters.map((q) => invoice(category, `${year}-${['03-31', '06-30', '09-30', '12-31'][q - 1]}`, amount));

describe('Vergleichszeitraum', () => {
	it('ist der gleiche Zeitraum ein Jahr früher', () => {
		expect(yearBefore(year2025)).toEqual({ start: '2024-01-01', end: '2024-12-31' });
		expect(yearBefore({ start: '2025-07-01', end: '2026-06-30' })).toEqual({ start: '2024-07-01', end: '2025-06-30' });
	});

	it('endet im Schaltjahr am 29. Februar, wenn die Periode Ende Februar endet', () => {
		expect(yearBefore({ start: '2024-03-01', end: '2025-02-28' })).toEqual({ start: '2023-03-01', end: '2024-02-29' });
		expect(yearBefore({ start: '2024-03-01', end: '2024-02-29' }).end).toBe('2023-02-28');
	});
});

describe('Prüfung pro Kategorie', () => {
	it('meldet nichts, wenn jede Kategorie wie im Vorjahr belegt ist', () => {
		const result = checkCategories(quarterly('Hauswart', 2025), quarterly('Hauswart', 2024), year2025);

		expect(result).toEqual({ hasComparison: true, findings: [] });
	});

	it('meldet eine Kategorie ohne Rechnung, die im Vorjahr Kosten hatte', () => {
		const { findings } = checkCategories([], [invoice('Kaminfeger', '2024-10-15', 290)], year2025);

		expect(findings).toEqual<CategoryFinding[]>([
			{
				categoryId: 'kaminfeger',
				categoryName: 'Kaminfeger',
				kind: 'missing',
				current: { count: 0, total: 0 },
				previous: { count: 1, total: 290 },
				missingParts: [],
				changePercent: null
			}
		]);
	});

	it('nennt die Lücke im Rhythmus: das fehlende Quartal', () => {
		const { findings } = checkCategories(quarterly('Kaltwasser', 2025, [1, 2, 4]), quarterly('Kaltwasser', 2024), year2025);

		expect(findings).toMatchObject([{ categoryName: 'Kaltwasser', kind: 'gap', missingParts: ['das 3. Quartal'] }]);
	});

	it('nennt bei halbjährlichen Rechnungen das fehlende Halbjahr', () => {
		const previous = [invoice('Kaltwasser', '2024-06-30', 460), invoice('Kaltwasser', '2024-12-31', 475)];
		const { findings } = checkCategories([invoice('Kaltwasser', '2025-06-30', 470)], previous, year2025);

		expect(findings).toMatchObject([{ kind: 'gap', missingParts: ['das 2. Halbjahr'], current: { count: 1, total: 470 } }]);
	});

	it('nennt bei monatlichen Rechnungen den fehlenden Monat', () => {
		const months = (year: number, skip?: number) =>
			Array.from({ length: 12 }, (_, m) => m + 1)
				.filter((m) => m !== skip)
				.map((m) => invoice('Hauswart', `${year}-${String(m).padStart(2, '0')}-15`));
		const { findings } = checkCategories(months(2025, 3), months(2024), year2025);

		expect(findings).toMatchObject([{ kind: 'gap', missingParts: ['den März'] }]);
	});

	it('weist auf deutlich höhere oder tiefere Kosten als im Vorjahr hin', () => {
		const { findings } = checkCategories(
			[invoice('Heizung', '2025-09-22', 6565), invoice('Lift', '2025-02-10', 1000)],
			[invoice('Heizung', '2024-09-18', 4800), invoice('Lift', '2024-02-12', 1650)],
			year2025
		);

		expect(findings).toMatchObject([
			{ categoryName: 'Heizung', kind: 'deviation', changePercent: 37 },
			{ categoryName: 'Lift', kind: 'deviation', changePercent: -39 }
		]);
	});

	it('übergeht kleine Schwankungen und kleine Beträge', () => {
		const { findings } = checkCategories(
			[invoice('Heizung', '2025-09-22', 6565), invoice('Kehricht', '2025-06-30', 90)],
			[invoice('Heizung', '2024-09-18', 6890), invoice('Kehricht', '2024-06-30', 50)],
			year2025
		);

		expect(findings).toEqual([]);
	});

	// Randfall: eine Kategorie ohne Kosten (Rechnung über CHF 0) erwartet im Folgejahr nichts
	it('erwartet keine Rechnung in einer Kategorie, die im Vorjahr keine Kosten hatte', () => {
		const { findings } = checkCategories([], [invoice('Schneeräumung', '2024-03-31', 0)], year2025);

		expect(findings).toEqual([]);
	});

	it('zählt eine Rechnung über CHF 0 als vorhanden', () => {
		const { findings } = checkCategories([invoice('Lift', '2025-02-10', 0)], [invoice('Lift', '2024-02-12', 1650)], year2025);

		expect(findings.map((f) => f.kind)).not.toContain('missing');
	});

	// Randfall Teilperiode: ein halbes Jahr wird mit demselben Halbjahr des Vorjahres verglichen
	it('vergleicht eine Teilperiode mit denselben Monaten des Vorjahres', () => {
		const half = { start: '2025-07-01', end: '2025-12-31' };
		const { findings } = checkCategories(quarterly('Kaltwasser', 2025, [3]), quarterly('Kaltwasser', 2024, [3, 4]), half);

		expect(findings).toMatchObject([{ kind: 'gap', missingParts: ['das 4. Quartal'] }]);
	});

	it('meldet ohne Rechnungen im Vorjahr keinen Vergleich', () => {
		expect(checkCategories(quarterly('Hauswart', 2025, [1]), [], year2025)).toEqual({ hasComparison: false, findings: [] });
	});

	it('sortiert fehlende Kategorien vor Lücken und Abweichungen', () => {
		const { findings } = checkCategories(
			[...quarterly('Kaltwasser', 2025, [1, 2, 3]), invoice('Heizung', '2025-09-01', 9000)],
			[...quarterly('Kaltwasser', 2024), invoice('Heizung', '2024-09-01', 5000), invoice('Kaminfeger', '2024-10-01', 290)],
			year2025
		);

		expect(findings.map((f) => f.kind)).toEqual(['missing', 'gap', 'deviation']);
	});
});
