import { describe, it, expect } from 'vitest';
import {
	akontoHint,
	draftsLink,
	findingText,
	heatingWholeText,
	needsConfirmation,
	invoiceRows,
	restoredSelection,
	restoredStep,
	selectionErrors,
	statementSteps
} from '../lib/statement-wizard';

const selection = {
	periodStart: '2024-01-01',
	periodEnd: '2024-12-31',
	heatingProfileId: 'hp1',
	managementFeePercent: 3,
	buildingIds: ['b1']
};
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
			managementFeePercent: 'Bitte geben Sie einen Prozentsatz von 0 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.'
		});
		expect(selectionErrors({ ...selection, managementFeePercent: NaN }, 3)).toHaveProperty(
			'managementFeePercent'
		);
		// #124: höchstens 10 %, so fällt ein Tippfehler wie 1000 statt 10 auf, bevor eine Anfrage ihn ablehnt
		expect(selectionErrors({ ...selection, managementFeePercent: 10 }, 3)).toEqual({});
		expect(selectionErrors({ ...selection, managementFeePercent: 10.01 }, 3)).toHaveProperty(
			'managementFeePercent'
		);
		// ein geleertes Feld kommt aus dem gespeicherten Zwischenstand als null zurück, nicht als 0 %
		expect(
			selectionErrors({ ...selection, managementFeePercent: null as unknown as number }, 3)
		).toHaveProperty('managementFeePercent');
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
				buildings
			)
		).toEqual([
			{
				buildingId: 'b1',
				name: 'Ahornhof',
				text: '3 Rechnungen vom 15.01.2024 bis 30.06.2024',
				missing: false,
				existing: 0,
				changed: [],
				fixedTerm: false,
				uncategorized: [],
				skipped: [],
				allSkipped: false,
				lateInvoices: [],
				invoicesWithoutServicePeriod: [],
				heatingWithoutServicePeriod: [],
				findings: [],
				incomplete: false,
				comparedWith: null
			},
			{
				buildingId: 'b2',
				name: 'Lindenhof',
				text: 'Keine Rechnungen erfasst',
				missing: true,
				existing: 0,
				changed: [],
				fixedTerm: false,
				uncategorized: [],
				skipped: [],
				allSkipped: false,
				lateInvoices: [],
				invoicesWithoutServicePeriod: [],
				heatingWithoutServicePeriod: [],
				findings: [],
				incomplete: false,
				comparedWith: null
			}
		]);
		expect(
			invoiceRows(
				[{ buildingId: 'b1', count: 1, first: '2024-03-15', last: '2024-03-15' }],
				buildings
			)[0].text
		).toBe('1 Rechnung vom 15.03.2024');
	});
});

const finding = (
	kind: 'stock' | 'tank' | 'consumption' | 'keys' | 'missing' | 'gap' | 'new' | 'deviation',
	extra = {}
) => ({
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
		expect(
			findingText(
				finding('missing', { current: { count: 0, total: 0 }, previous: { count: 1, total: 290 } })
			)
		).toBe('Keine Rechnung in dieser Kategorie erfasst. Im Vorjahr: Kosten von CHF\u00a0290.00.');
	});

	// #890, Option 1: Lieferungen für den Tank mit verschiedenen Verteilschlüsseln
	it('nennt bei verschiedenen Verteilschlüsseln der Lieferungen den Schlüssel der Veränderung Tankbestand', () => {
		expect(findingText(finding('keys', { categoryName: 'Heizung', keyName: 'Pro Einheit' }))).toBe(
			'Die Lieferungen der Kategorie Heizung haben verschiedene Verteilschlüssel. Die Veränderung Tankbestand wird nach «Pro Einheit» verteilt. Prüfen Sie die Verteilschlüssel der Rechnungen.'
		);
	});

	// Nur eine Lücke oder Abweichung lässt sich durch einen Teil der Kosten erklären (#130)
	it('nennt bei Lücke und Abweichung die Rechnungen, die nur teilweise zählen', () => {
		const parts = { missingParts: [{ start: '2025-07-01', end: '2025-12-31' }], partialCount: 2 };

		expect(findingText(finding('gap', parts))).toContain(
			'2 Rechnungen zählen nur teilweise: ihre Leistungszeiträume reichen über die Abrechnungsperiode hinaus.'
		);
		expect(findingText(finding('deviation', { changePercent: -40, partialCount: 2 }))).toContain(
			'2 Rechnungen zählen nur teilweise'
		);
		expect(findingText(finding('new', { partialCount: 2 }))).not.toContain('teilweise');
	});

	// #76: die Kategorie gilt für das ganze Gebäude; mit einem laufenden befristeten Mietvertrag gilt für ihn das Vertragsende
	it('ergänzt neue Nebenkosten um das Vertragsende, wenn das Gebäude einen laufenden befristeten Mietvertrag hat', () => {
		const fixedTerm =
			'Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor.';
		// after the form rule, which holds for both (fach-review V-4), not after the net rent
		expect(findingText(finding('new'), true)).toContain(`ist die Änderung nichtig. ${fixedTerm} Waren die Kosten`);
		expect(findingText(finding('new'))).not.toContain('befristet');
		expect(findingText(finding('missing'), true)).not.toContain('befristet');
	});

	it('nennt den Teil des Jahres, für den die Rechnung fehlt', () => {
		const part = (start: string, end: string) => ({ start, end });
		expect(findingText(finding('gap', { missingParts: [part('2025-07-01', '2025-12-31')] }))).toBe(
			'Die Rechnung für das 2. Halbjahr fehlt. Im Vorjahr: 2 Rechnungen.'
		);
		expect(
			findingText(
				finding('gap', {
					missingParts: [part('2025-01-01', '2025-03-31'), part('2025-07-01', '2025-09-30')],
					previous: { count: 4, total: 3600 }
				})
			)
		).toBe('Die Rechnungen für das 1. Quartal und das 3. Quartal fehlen. Im Vorjahr: 4 Rechnungen.');
		expect(findingText(finding('gap', { missingParts: [part('2025-03-01', '2025-03-31')] }))).toContain('Die Rechnung für März fehlt.');
		expect(findingText(finding('gap', { missingParts: [part('2026-01-14', '2026-07-15')] }))).toContain(
			'für die Zeit vom 14.01.2026 bis 15.07.2026 fehlt'
		);
		// a list says each month once, without «den» before each (#348)
		expect(
			findingText(
				finding('gap', {
					missingParts: [
						part('2025-01-01', '2025-01-31'),
						part('2025-02-01', '2025-02-28'),
						part('2025-03-01', '2025-03-31')
					]
				})
			)
		).toContain('Die Rechnungen für Januar, Februar und März fehlen.');
	});

	it('nennt Kosten, die deutlich vom Vorjahr abweichen, mit dem nächsten Schritt', () => {
		expect(
			findingText(
				finding('deviation', {
					current: { count: 1, total: 6565 },
					previous: { count: 1, total: 4800 },
					changePercent: 37
				})
			)
		).toBe(
			'CHF\u00a06’565.00, 37 % mehr als im Vorjahr (CHF\u00a04’800.00). Prüfen Sie den Betrag und den Zeitraum, für den die Rechnung gilt.'
		);
		expect(findingText(finding('deviation', { changePercent: -40 }))).toContain(
			'40 % weniger als im Vorjahr'
		);
	});

	// Nebenkosten dürfen nur abgerechnet werden, wenn sie im Mietvertrag vereinbart sind
	// #91: ob vereinbart, sagt der Mietvertrag; der Hinweis zeigt auf die Mietverträge, nicht auf die Rechnungen
	it('weist bei einer neuen Kategorie darauf hin, dass nur Mietverträge mit Vereinbarung sie bezahlen', () => {
		expect(
			findingText(
				finding('new', { current: { count: 1, total: 400 }, previous: { count: 0, total: 0 } })
			)
		).toBe(
			'Neu: CHF\u00a0400.00, im Vorjahr keine Kosten. Dwello rechnet diese Kosten nur bei Mietverträgen ab, die sie vereinbaren (Angabe beim Mietvertrag). Prüfen Sie, ob sie in den unterschriebenen Mietverträgen stehen. Neue Nebenkosten führen Sie nur für die Zukunft ein, frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist die Änderung nichtig. Waren die Kosten bisher in der Nettomiete enthalten, senken Sie diese entsprechend.'
		);
	});

	// Ohne Anfangs- und Endbestand rechnet die Abrechnung das Heizöl nach Einkauf statt nach Verbrauch ab
	it('nennt den fehlenden Tankbestand mit seinem Stichtag und der Folge', () => {
		expect(
			findingText(finding('stock', { missingParts: [{ start: '2025-12-31', end: '2025-12-31' }] }))
		).toBe(
			'Der Tankbestand am 31.12.2025 fehlt. Ohne Anfangs- und Endbestand rechnet Dwello den Einkauf ab, nicht den Verbrauch. Abrechnen dürfen Sie aber nur den Verbrauch: Erfassen Sie den Bestand auf der Seite des Gebäudes. Bestätigen Sie nur, wenn der Tank am Anfang und am Ende gleich voll war.'
		);
		expect(
			findingText(
				finding('stock', {
					missingParts: [
						{ start: '2024-12-31', end: '2024-12-31' },
						{ start: '2025-12-31', end: '2025-12-31' }
					]
				})
			)
		).toContain('Die Tankbestände am 31.12.2024 und am 31.12.2025 fehlen.');
	});

	// Erste Abrechnung: ob das Gebäude einen Tank hat, weiss Dwello nicht
	it('fragt bei Heizkosten ohne Tankbestand ohne Bestätigung', () => {
		expect(
			needsConfirmation([
				{
					buildingId: 'b1',
					count: 3,
					first: '2024-01-01',
					last: '2024-12-31',
					check: check([finding('tank')])
				}
			])
		).toBe(false);
	});

	it('meldet einen negativen Verbrauch aus dem Tank', () => {
		expect(findingText(finding('consumption', { current: { count: 1, total: -4900 } }))).toBe(
			'Der Endbestand ist CHF\u00a04’900.00 höher als Anfangsbestand und Einkauf zusammen, der Verbrauch wäre negativ. Prüfen Sie die Tankbestände und ob eine Lieferung fehlt oder ihre Rechnung erst nach dem Ende der Periode datiert ist.'
		);
	});

	// Plausibilität der Tankbestände gegen das Vorjahr (#73)
	it('vergleicht den Verbrauch an Heizmaterial mit dem Vorjahr', () => {
		const consumption = (total: number, changePercent: number) =>
			findingText(
				finding('consumption', {
					current: { count: 1, total },
					previous: { count: 1, total: 1000 },
					changePercent
				})
			);
		expect(consumption(2000, 100)).toBe(
			'Verbrauch CHF\u00a02’000.00, 100 % mehr als im Vorjahr (CHF\u00a01’000.00). Prüfen Sie die Tankbestände.'
		);
		expect(consumption(600, -40)).toBe(
			'Verbrauch CHF\u00a0600.00, 40 % weniger als im Vorjahr (CHF\u00a01’000.00). Prüfen Sie die Tankbestände.'
		);
	});

	it('verlangt eine Bestätigung bei fehlenden Rechnungen, nicht bei einer Abweichung', () => {
		const row = (findings: ReturnType<typeof finding>[]) =>
			invoiceRows(
				[
					{
						buildingId: 'b1',
						count: 3,
						first: '2024-01-01',
						last: '2024-12-31',
						check: check(findings)
					}
				],
				buildings
			)[0];

		expect(
			row([finding('gap', { missingParts: [{ start: '2025-07-01', end: '2025-12-31' }] })])
				.incomplete
		).toBe(true);
		expect(row([finding('new')]).incomplete).toBe(false);
		expect(row([finding('missing')]).incomplete).toBe(true);
		expect(row([finding('deviation', { changePercent: 30 })]).incomplete).toBe(false);
		expect(row([]).comparedWith).toEqual({ start: '2023-01-01', end: '2023-12-31' });
	});
});

describe('Bestätigung vor dem Erstellen', () => {
	const coverage = (extra = {}) => ({
		buildingId: 'b1',
		count: 3,
		first: '2024-01-01',
		last: '2024-12-31',
		...extra
	});

	it('verlangt sie ohne Rechnungen und bei fehlenden Rechnungen einer Kategorie', () => {
		expect(needsConfirmation([coverage({ count: 0 })])).toBe(true);
		expect(needsConfirmation([coverage({ check: check([finding('gap')]) })])).toBe(true);
		expect(needsConfirmation([coverage({ check: check([finding('stock')]) })])).toBe(true);
	});

	// #251: Mietverträge mit einer Abrechnung erhalten keine neue; das allein ist kein Befund
	it('verlangt sie nicht, nur weil es schon Abrechnungen gibt', () => {
		expect(needsConfirmation([coverage({ statements: 1 })])).toBe(false);
	});

	// ein Hinweis auf die Tankbestände, nie eine Bestätigung (#73)
	it('verlangt sie nicht für einen unplausiblen Verbrauch an Heizmaterial', () => {
		expect(needsConfirmation([coverage({ check: check([finding('consumption')]) })])).toBe(false);
	});

	it('verlangt sie nicht für Hinweise auf neue Kategorien oder Abweichungen', () => {
		expect(
			needsConfirmation([coverage({ check: check([finding('new'), finding('deviation')]) })])
		).toBe(false);
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
		expect(akontoHint(row(1000, 2400))).toBe(
			'Kosten CHF\u00a01’400.00 (58 %) unter dem Akonto. Fehlen Rechnungen?'
		);
	});

	// Ein höheres Akonto ist eine Vertragsänderung: der Mieter erfährt sie mit dem amtlichen Formular
	it('schlägt schon ab 15 % darüber vor, das Akonto zu erhöhen, mit dem amtlichen Formular', () => {
		expect(akontoHint(row(2800, 2400))).toBe(
			'Kosten CHF\u00a0400.00 (17 %) über dem Akonto. Prüfen Sie, ob Sie das Akonto erhöhen. Eine Erhöhung gilt frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist sie nichtig.'
		);
	});

	it('schweigt bei üblichen Abweichungen und ohne Akonto', () => {
		expect(akontoHint(row(2700, 2400))).toBeNull(); // 12.5 % darüber
		expect(akontoHint(row(1700, 2400))).toBeNull(); // 29 % darunter
		expect(akontoHint(row(500, 0))).toBeNull();
	});

	// Ausgezogen: es gibt kein Akonto mehr zu erhöhen
	it('schlägt bei einem beendeten Mietvertrag keine Erhöhung vor', () => {
		expect(akontoHint({ ...row(2800, 2400), movedOut: true })).toBe(
			'Kosten CHF\u00a0400.00 (17 %) über dem Akonto.'
		);
	});

	// #76: ein befristeter Mietvertrag hat vor seinem Ende keinen Kündigungstermin (Text des Product Owners; das
	// Formular dazu ist #388, Option A)
	it('nennt bei einem laufenden befristeten Mietvertrag das Vertragsende statt des Kündigungstermins', () => {
		expect(akontoHint({ ...row(2800, 2400), fixedTerm: true })).toBe(
			'Kosten CHF 400.00 (17 %) über dem Akonto. Prüfen Sie, ob Sie das Akonto erhöhen. Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor. Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig.'
		);
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
		).toEqual({
			selection: { ...selection, buildingIds: ['b1'], heatingProfileId: '' },
			dropped: { buildings: 1, heatingProfile: true }
		});
	});

	it('meldet nichts als weggefallen, wenn es alles noch gibt oder kein Heizprofil gewählt war', () => {
		const known = { buildingIds: ['b1'], heatingProfileIds: ['hp1'] };
		expect(restoredSelection({ ...selection, heatingProfileId: '' }, known).dropped).toEqual({
			buildings: 0,
			heatingProfile: false
		});
	});
});

describe('Entwürfe nach dem Abrechnungslauf ansehen', () => {
	const selection = {
		periodStart: '2024-07-01',
		periodEnd: '2025-06-30',
		heatingProfileId: 'hp1',
		managementFeePercent: 3,
		buildingIds: ['b1']
	};

	it('zeigt die Entwürfe der Abrechnungsperiode des Laufs und seines einzigen Gebäudes', () => {
		expect(draftsLink(selection)).toBe(
			'/statements?status=draft&periodStart=2024-07-01&periodEnd=2025-06-30&building=b1'
		);
	});

	it('zeigt nach einem Lauf über mehrere Gebäude die Entwürfe der Periode in allen Gebäuden', () => {
		expect(draftsLink({ ...selection, buildingIds: ['b1', 'b2'] })).toBe(
			'/statements?status=draft&periodStart=2024-07-01&periodEnd=2025-06-30'
		);
	});
});

// #201: der Assistent öffnet im Schritt, in dem er verlassen wurde, wenn dieser noch gilt
describe('Wiederhergestellter Schritt', () => {
	const none = { buildings: 0, heatingProfile: false };

	it('öffnet den Schritt, in dem der Liegenschaftsverwalter aufgehört hat', () => {
		expect(restoredStep(2, selection, none)).toBe(2);
		expect(restoredStep(3, selection, none)).toBe(3);
	});

	it('öffnet nach der Vorschau den Schritt davor, denn die Vorschau rechnet der Server neu', () => {
		expect(restoredStep(4, selection, none)).toBe(3);
		expect(restoredStep(5, selection, none)).toBe(3);
	});

	it('öffnet den ersten Schritt, der nicht mehr gilt', () => {
		expect(restoredStep(3, { ...selection, periodStart: '' }, none)).toBe(1);
		expect(restoredStep(3, { ...selection, buildingIds: [] }, none)).toBe(2);
		expect(restoredStep(3, selection, { ...none, buildings: 1 })).toBe(2);
	});

	it('öffnet einen Entwurf ohne gespeicherten Schritt im ersten Schritt', () => {
		expect(restoredStep(undefined, selection, none)).toBe(1);
	});
});

// #339 (#451, Fachreview V-15): der Hinweis auf Rechnungen der Heizkosten ohne Leistungszeitraum nennt jede Kategorie in
// eigenen Anführungszeichen, bei mehreren in der Mehrzahl
describe('Hinweis auf Rechnungen der Heizkosten ohne Leistungszeitraum', () => {
	const row = (categoryName: string) => ({ invoices: [{ categoryName }] });

	it('nennt eine Kategorie in der Einzahl', () => {
		expect(heatingWholeText([row('Heizung'), row('Heizung')])).toContain(
			'Diese Rechnungen der Kategorie «Heizung» haben keinen Leistungszeitraum'
		);
	});

	it('nennt mehrere Kategorien je in Anführungszeichen, in der Mehrzahl', () => {
		expect(heatingWholeText([row('Heizung'), row('Kaminfeger')])).toContain(
			'Diese Rechnungen der Kategorien «Heizung» und «Kaminfeger» haben keinen Leistungszeitraum'
		);
	});
});
