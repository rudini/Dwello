import { describe, it, expect } from 'vitest';
import {
	akontoHint,
	findingText,
	needsConfirmation,
	invoiceRows,
	restoredSelection,
	selectionErrors,
	statementSteps
} from '../lib/statement-wizard';

const selection = {
	periodStart: '2024-01-01',
	periodEnd: '2024-12-31',
	heatingProfileId: 'hp1',
	managementFeePercent: 3,
	managementFeeDistributionKeyId: '',
	buildingIds: ['b1']
};
const period = { periodStart: '2024-01-01', periodEnd: '2024-12-31' };
const buildings = [
	{ id: 'b1', name: 'Ahornhof' },
	{ id: 'b2', name: 'Lindenhof' }
];

describe('Abrechnungen Schritt für Schritt', () => {
	it('führt in fünf Schritten von der Periode bis zum Erstellen', () => {
		expect(statementSteps).toEqual([
			'Abrechnungsperiode',
			'Gebäude',
			'Heizprofil und Verwaltungspauschale',
			'Vorschau',
			'Erstellen'
		]);
	});

	it('prüft die Abrechnungsperiode', () => {
		expect(selectionErrors({ ...selection, periodStart: '' }, 1)).toEqual({
			periodStart: 'Bitte wählen Sie den Beginn der Abrechnungsperiode.'
		});
		expect(selectionErrors({ ...selection, periodEnd: '2023-12-31' }, 1)).toEqual({
			periodEnd: 'Das Ende muss nach dem Beginn der Abrechnungsperiode liegen.'
		});
		expect(selectionErrors({ ...selection, periodStart: '12024-01-01' }, 1)).toEqual({
			periodStart: 'Bitte prüfen Sie das Datum: Das Jahr ist nicht möglich.'
		});
		expect(selectionErrors(selection, 1)).toEqual({});
	});

	it('verlangt mindestens ein Gebäude', () => {
		expect(selectionErrors({ ...selection, buildingIds: [] }, 2)).toEqual({
			buildings: 'Bitte wählen Sie mindestens ein Gebäude.'
		});
	});

	it('verlangt ein Heizprofil und eine gültige Verwaltungspauschale', () => {
		expect(
			selectionErrors({ ...selection, heatingProfileId: '', managementFeePercent: -1 }, 3)
		).toEqual({
			heatingProfileId: 'Bitte wählen Sie ein Heizprofil.',
			managementFeePercent: 'Bitte geben Sie einen Prozentsatz ab 0 ein, zum Beispiel 3.'
		});
		expect(selectionErrors({ ...selection, managementFeePercent: NaN }, 3)).toHaveProperty(
			'managementFeePercent'
		);
	});
});

describe('Rechnungen pro Gebäude', () => {
	it('nennt Anzahl und Zeitraum der Rechnungen und markiert Gebäude ohne Rechnungen', () => {
		expect(
			invoiceRows(
				[
					{ buildingId: 'b1', count: 3, first: '2024-01-15', last: '2024-06-30' },
					{ buildingId: 'b2', count: 0, first: null, last: null }
				],
				buildings,
				period
			)
		).toEqual([
			{
				buildingId: 'b1',
				name: 'Ahornhof',
				text: '3 Rechnungen vom 15.1.2024 bis 30.6.2024',
				missing: false,
				partial: true, // nothing after June
				existing: 0,
				findings: [],
				incomplete: false,
				comparedWith: null
			},
			{
				buildingId: 'b2',
				name: 'Lindenhof',
				text: 'Keine Rechnungen erfasst',
				missing: true,
				partial: false,
				existing: 0,
				findings: [],
				incomplete: false,
				comparedWith: null
			}
		]);
		expect(
			invoiceRows(
				[{ buildingId: 'b1', count: 1, first: '2024-03-15', last: '2024-03-15' }],
				buildings,
				period
			)[0].text
		).toBe('1 Rechnung vom 15.3.2024');
	});
});

describe('Rechnungen über die ganze Periode', () => {
	// More than three months at the start or end without any invoice: worth a second look, not a stop
	it('weist auf Rechnungen hin, die nur einen Teil der Periode abdecken', () => {
		const rows = (first: string, last: string) =>
			invoiceRows([{ buildingId: 'b1', count: 4, first, last }], buildings, period)[0].partial;
		expect(rows('2024-01-10', '2024-12-20')).toBe(false);
		expect(rows('2024-01-10', '2024-03-31')).toBe(true); // only Q1
		expect(rows('2024-06-01', '2024-12-20')).toBe(true); // nothing in the first five months
	});
});

const finding = (kind: 'stock' | 'missing' | 'gap' | 'new' | 'deviation', extra = {}) => ({
	categoryId: 'c1',
	categoryName: 'Kaltwasser',
	kind,
	current: { count: 1, total: 470 },
	previous: { count: 2, total: 935 },
	missingParts: [],
	changePercent: null,
	...extra
});
const check = (findings: ReturnType<typeof finding>[], hasComparison = true) => ({
	buildingId: 'b1',
	comparedWith: { start: '2023-01-01', end: '2023-12-31' },
	hasComparison,
	findings
});

describe('Rechnungen pro Kategorie', () => {
	it('beschreibt eine Kategorie ohne Rechnung mit den Kosten des Vorjahres', () => {
		expect(findingText(finding('missing', { current: { count: 0, total: 0 }, previous: { count: 1, total: 290 } }))).toBe(
			'Keine Rechnung in dieser Kategorie erfasst. Im Vorjahr: 1 Rechnung über CHF\u00a0290.00.'
		);
	});

	it('nennt den Teil des Jahres, für den die Rechnung fehlt', () => {
		const part = (start: string, end: string) => ({ start, end });
		expect(findingText(finding('gap', { missingParts: [part('2025-07-01', '2025-12-31')] }))).toBe(
			'Rechnung für das 2. Halbjahr fehlt. Im Vorjahr: 2 Rechnungen.'
		);
		expect(
			findingText(
				finding('gap', {
					missingParts: [part('2025-01-01', '2025-03-31'), part('2025-07-01', '2025-09-30')],
					previous: { count: 4, total: 3600 }
				})
			)
		).toBe('Rechnungen für das 1. Quartal und das 3. Quartal fehlen. Im Vorjahr: 4 Rechnungen.');
		expect(findingText(finding('gap', { missingParts: [part('2025-03-01', '2025-03-31')] }))).toContain('für den März fehlt');
		expect(findingText(finding('gap', { missingParts: [part('2026-01-14', '2026-07-15')] }))).toContain(
			'für die Zeit vom 14.1.2026 bis 15.7.2026 fehlt'
		);
	});

	it('nennt Kosten, die deutlich vom Vorjahr abweichen, mit dem nächsten Schritt', () => {
		expect(
			findingText(finding('deviation', { current: { count: 1, total: 6565 }, previous: { count: 1, total: 4800 }, changePercent: 37 }))
		).toBe(
			'CHF\u00a06’565.00, 37 % mehr als im Vorjahr (CHF\u00a04’800.00). Prüfen Sie den Betrag und den Zeitraum, für den die Rechnung gilt.'
		);
		expect(findingText(finding('deviation', { changePercent: -40 }))).toContain('40 % weniger als im Vorjahr');
	});

	// Nebenkosten dürfen nur abgerechnet werden, wenn sie im Mietvertrag vereinbart sind
	it('fragt bei einer neuen Kategorie, ob sie im Mietvertrag vereinbart ist', () => {
		expect(findingText(finding('new', { current: { count: 1, total: 400 }, previous: { count: 0, total: 0 } }))).toBe(
			'Neu: CHF\u00a0400.00, im Vorjahr keine Kosten. Ist diese Kategorie im Mietvertrag vereinbart? Nur vereinbarte Nebenkosten dürfen Sie abrechnen. Wenn nicht, markieren Sie die Rechnungen als nicht umlagefähig; neue Nebenkosten führen Sie nur mit dem amtlichen Formular für die Zukunft ein.'
		);
	});

	// Ohne Anfangs- und Endbestand rechnet die Abrechnung das Heizöl nach Einkauf statt nach Verbrauch ab
	it('nennt den fehlenden Tankbestand mit seinem Stichtag und der Folge', () => {
		expect(findingText(finding('stock', { missingParts: [{ start: '2025-12-31', end: '2025-12-31' }] }))).toBe(
			'Tankbestand am 31.12.2025 fehlt. Ohne Anfangs- und Endbestand rechnet Dwello den Einkauf ab, nicht den Verbrauch. Erfassen Sie den Bestand auf der Seite des Gebäudes.'
		);
	});

	it('meldet einen negativen Verbrauch aus dem Tank', () => {
		expect(findingText(finding('stock', { current: { count: 1, total: -4900 } }))).toBe(
			'Der Endbestand ist CHF\u00a04’900.00 höher als Anfangsbestand und Einkauf zusammen, der Verbrauch wäre negativ. Prüfen Sie die Tankbestände.'
		);
	});

	it('verlangt eine Bestätigung bei fehlenden Rechnungen, nicht bei einer Abweichung', () => {
		const row = (findings: ReturnType<typeof finding>[]) =>
			invoiceRows([{ buildingId: 'b1', count: 3, first: '2024-01-01', last: '2024-12-31', check: check(findings) }], buildings, period)[0];

		expect(row([finding('gap', { missingParts: [{ start: '2025-07-01', end: '2025-12-31' }] })]).incomplete).toBe(true);
		expect(row([finding('new')]).incomplete).toBe(false);
		expect(row([finding('missing')]).incomplete).toBe(true);
		expect(row([finding('deviation', { changePercent: 30 })]).incomplete).toBe(false);
		expect(row([]).comparedWith).toEqual({ start: '2023-01-01', end: '2023-12-31' });
	});

	// Mit Vorjahr ersetzt der Vergleich pro Kategorie die grobe Prüfung von Anfang und Ende der Periode
	it('prüft Anfang und Ende der Periode nur, wenn es kein Vorjahr zum Vergleich gibt', () => {
		const partial = (hasComparison: boolean) =>
			invoiceRows([{ buildingId: 'b1', count: 2, first: '2024-01-15', last: '2024-03-31', check: check([], hasComparison) }], buildings, period)[0]
				.partial;

		expect(partial(true)).toBe(false);
		expect(partial(false)).toBe(true);
	});
});

describe('Bestätigung vor dem Erstellen', () => {
	const coverage = (extra = {}) => ({ buildingId: 'b1', count: 3, first: '2024-01-01', last: '2024-12-31', ...extra });

	it('verlangt sie ohne Rechnungen, bei bestehenden Abrechnungen und bei fehlenden Rechnungen einer Kategorie', () => {
		expect(needsConfirmation([coverage({ count: 0 })])).toBe(true);
		expect(needsConfirmation([coverage({ statements: 1 })])).toBe(true);
		expect(needsConfirmation([coverage({ check: check([finding('gap')]) })])).toBe(true);
		expect(needsConfirmation([coverage({ check: check([finding('stock')]) })])).toBe(true);
	});

	it('verlangt sie nicht für Hinweise auf neue Kategorien oder Abweichungen', () => {
		expect(needsConfirmation([coverage({ check: check([finding('new'), finding('deviation')]) })])).toBe(false);
	});
});

describe('Abweichung zum Akonto', () => {
	const row = (totalCosts: number, totalAdvancePayments: number, rentalDays = 365) => ({
		totalCosts,
		totalAdvancePayments,
		rentalDays,
		totalPeriodDays: 365
	});

	it('fragt nach fehlenden Rechnungen, wenn die Kosten weit unter dem Akonto liegen', () => {
		expect(akontoHint(row(1000, 2400))).toBe('Kosten CHF\u00a01’400.00 (58 %) unter dem Akonto. Fehlen Rechnungen?');
	});

	// Ein höheres Akonto ist eine Vertragsänderung: der Mieter erfährt sie mit dem amtlichen Formular
	it('schlägt schon ab 15 % darüber vor, das Akonto zu erhöhen, mit dem amtlichen Formular', () => {
		expect(akontoHint(row(2800, 2400))).toBe(
			'Kosten CHF\u00a0400.00 (17 %) über dem Akonto. Prüfen Sie, ob Sie das Akonto erhöhen. Eine Erhöhung gilt erst auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist.'
		);
	});

	it('schweigt bei üblichen Abweichungen und ohne Akonto', () => {
		expect(akontoHint(row(2700, 2400))).toBeNull(); // 12.5 % darüber
		expect(akontoHint(row(1700, 2400))).toBeNull(); // 29 % darunter
		expect(akontoHint(row(500, 0))).toBeNull();
	});

	// Randfall Mieterwechsel und Teilperiode: wer nur im Sommer mietet, trägt kaum Heizkosten
	it('fragt bei einem Teil der Periode nicht nach fehlenden Rechnungen', () => {
		expect(akontoHint(row(400, 1200, 92))).toBeNull();
		expect(akontoHint(row(1600, 1200, 92))).toContain('über dem Akonto');
	});
});

describe('Entwurf der Abrechnungen', () => {
	it('übernimmt nur Gebäude und Heizprofile, die es noch gibt', () => {
		const known = { buildingIds: ['b1'], heatingProfileIds: ['hp1'] };
		expect(
			restoredSelection(
				{ ...selection, buildingIds: ['b1', 'weg'], heatingProfileId: 'alt' },
				known
			)
		).toEqual({ ...selection, buildingIds: ['b1'], heatingProfileId: '' });
	});
});
