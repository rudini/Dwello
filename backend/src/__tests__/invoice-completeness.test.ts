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

		expect(findings).toMatchObject([{ categoryName: 'Kaltwasser', kind: 'gap', missingParts: [{ start: '2025-07-01', end: '2025-09-30' }] }]);
	});

	it('nennt bei halbjährlichen Rechnungen das fehlende Halbjahr', () => {
		const previous = [invoice('Kaltwasser', '2024-06-30', 460), invoice('Kaltwasser', '2024-12-31', 475)];
		const { findings } = checkCategories([invoice('Kaltwasser', '2025-06-30', 470)], previous, year2025);

		expect(findings).toMatchObject([{ kind: 'gap', missingParts: [{ start: '2025-07-01', end: '2025-12-31' }], current: { count: 1, total: 470 } }]);
	});

	it('nennt bei monatlichen Rechnungen den fehlenden Monat', () => {
		const months = (year: number, skip?: number) =>
			Array.from({ length: 12 }, (_, m) => m + 1)
				.filter((m) => m !== skip)
				.map((m) => invoice('Hauswart', `${year}-${String(m).padStart(2, '0')}-15`));
		const { findings } = checkCategories(months(2025, 3), months(2024), year2025);

		expect(findings).toMatchObject([{ kind: 'gap', missingParts: [{ start: '2025-03-01', end: '2025-03-31' }] }]);
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

		expect(findings).toMatchObject([{ kind: 'gap', missingParts: [{ start: '2025-10-01', end: '2025-12-31' }] }]);
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

	// Ein Vergleich mit dem gleichen Zeitraum ein Jahr früher überlappt bei längeren Perioden mit sich selbst
	it('vergleicht eine Periode über zwölf Monate nicht', () => {
		const long = { start: '2024-01-01', end: '2025-06-30' };

		expect(checkCategories([], [invoice('Kaminfeger', '2023-10-15', 290)], long)).toEqual({ hasComparison: false, findings: [] });
	});

	// Erstes Jahr mit Dwello: das Vorjahr ist nur teilweise erfasst, ein Vergleich ergäbe falsche Abweichungen
	it('vergleicht nicht, wenn die erste Rechnung des Gebäudes erst mitten im Vergleichszeitraum liegt', () => {
		const july = { start: '2024-07-01', end: '2025-06-30' };
		const previous = [invoice('Hauswart', '2024-03-31', 900), invoice('Hauswart', '2024-06-30', 900)];

		expect(checkCategories(quarterly('Hauswart', 2024, [3, 4]), previous, july, '2024-02-12')).toEqual({ hasComparison: false, findings: [] });
	});

	it('vergleicht, wenn die erste Rechnung in den ersten drei Monaten des Vergleichszeitraums liegt', () => {
		expect(checkCategories([], [invoice('Lift', '2024-02-12', 1650)], year2025, '2024-02-12').hasComparison).toBe(true);
	});

	// Lieferanten datieren unterschiedlich: vier Rechnungen wie im Vorjahr sind vollständig
	it('meldet keine Lücke, wenn gleich viele Rechnungen wie im Vorjahr da sind, auch kurz nach Quartalsende datiert', () => {
		// the first quarter billed on 2 April: the first quarter seems empty, the second has two invoices
		const late = ['04-02', '06-30', '09-30', '12-31'].map((day) => invoice('Kaltwasser', `2025-${day}`, 900));

		expect(checkCategories(late, quarterly('Kaltwasser', 2024), year2025).findings).toEqual([]);
	});

	it('zählt eine Gutschrift nicht als eigene Rechnung im Rhythmus', () => {
		const previous = [...quarterly('Kaltwasser', 2024), invoice('Kaltwasser', '2024-01-20', -50)];

		expect(checkCategories(quarterly('Kaltwasser', 2025), previous, year2025).findings).toEqual([]);
	});

	// Ohne Kategorie lässt sich nicht sagen, welche Rechnung fehlt
	it('vergleicht Rechnungen ohne Kategorie nicht', () => {
		const uncategorised = { ...invoice('Nicht kategorisiert', '2024-05-31', 300), categoryId: null };

		expect(checkCategories([], [uncategorised], year2025).findings).toEqual([]);
	});

	// Nebenkosten dürfen nur abgerechnet werden, wenn sie im Mietvertrag vereinbart sind (Art. 257a Abs. 2 OR)
	it('meldet eine Kategorie, die es im Vorjahr nicht gab', () => {
		const { findings } = checkCategories(
			[invoice('Hauswart', '2025-06-30', 900), invoice('Schneeräumung', '2025-05-20', 400)],
			[invoice('Hauswart', '2024-06-30', 900)],
			year2025
		);

		expect(findings).toMatchObject([
			{ categoryName: 'Schneeräumung', kind: 'new', current: { count: 1, total: 400 }, previous: { count: 0, total: 0 } }
		]);
	});

	it('fragt bei einer Gutschrift allein nicht nach einer neuen Kategorie', () => {
		const { findings } = checkCategories(
			[invoice('Hauswart', '2025-06-30', 900), invoice('Lift', '2025-05-20', -50)],
			[invoice('Hauswart', '2024-06-30', 900)],
			year2025
		);

		expect(findings).toEqual([]);
	});

	// Heizöl mit Tankbestand: verglichen wird der Verbrauch, nicht wann eingekauft wurde
	it('meldet bei einer Kategorie mit Tankbestand keine Lücke im Rhythmus der Einkäufe', () => {
		const stock = (date: string, amount: number) => ({ ...invoice('Heizung', date, amount), isFuelStock: true });
		const { findings } = checkCategories(
			[invoice('Heizung', '2025-03-10', 3000), stock('2025-12-31', 2500)],
			[invoice('Heizung', '2024-02-10', 2500), invoice('Heizung', '2024-10-10', 2500), stock('2024-12-31', 500)],
			year2025
		);

		expect(findings).toEqual([]);
	});

	it('zählt die Veränderung des Tankbestands nicht als Rechnung', () => {
		const { findings } = checkCategories(
			[invoice('Hauswart', '2025-06-30', 900)],
			[invoice('Hauswart', '2024-06-30', 900), invoice('Heizung', '2024-05-10', 3000), { ...invoice('Heizung', '2024-12-31', 500), isFuelStock: true }],
			year2025
		);

		expect(findings).toMatchObject([{ kind: 'missing', previous: { count: 1, total: 3500 } }]);
	});

	// Randfall: eine Periode, die nicht am Monatsersten beginnt, wird nach Tagen geteilt
	it('teilt eine Periode ab dem 16. nach Tagen', () => {
		const odd = { start: '2025-07-16', end: '2026-07-15' };
		const previous = [invoice('Hauswart', '2024-10-01', 900), invoice('Hauswart', '2025-04-01', 900)];
		const { findings } = checkCategories([invoice('Hauswart', '2025-10-01', 900)], previous, odd);

		expect(findings).toMatchObject([{ kind: 'gap', missingParts: [{ start: '2026-01-14', end: '2026-07-15' }] }]);
	});

	it('teilt bei mehr als zwölf Rechnungen höchstens in Monate', () => {
		const monthly = (year: number, count: number) =>
			Array.from({ length: count }, (_, i) => invoice('Hauswart', `${year}-${String((i % 12) + 1).padStart(2, '0')}-${i < 12 ? '10' : '20'}`));
		const { findings } = checkCategories(monthly(2025, 11), monthly(2024, 14), year2025);

		expect(findings).toMatchObject([{ kind: 'gap', missingParts: [{ start: '2025-12-01', end: '2025-12-31' }] }]);
	});

	it('ordnet eine Rechnung am letzten Tag eines Abschnitts diesem Abschnitt zu', () => {
		const { findings } = checkCategories(quarterly('Kaltwasser', 2025, [1, 2, 3]), quarterly('Kaltwasser', 2024), year2025);

		expect(findings[0].missingParts).toEqual([{ start: '2025-10-01', end: '2025-12-31' }]);
	});
});
