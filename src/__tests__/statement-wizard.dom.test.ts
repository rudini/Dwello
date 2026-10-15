import PreviewChecks from '../routes/statements/generate/PreviewChecks.svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// enhance as SvelteKit wires it: the test can play the server's answer to the last submit
const server = vi.hoisted(() => ({ submit: null as null | ((input: unknown) => unknown) }));
vi.mock('$app/forms', () => ({
	enhance: (_form: unknown, submit?: (input: unknown) => unknown) => {
		if (submit) server.submit = submit;
		return { destroy() {} };
	}
}));
async function answer(result: { type: string; data?: unknown }) {
	const after = server.submit!({}) as (input: unknown) => Promise<void>;
	await after({ update: async () => {}, result });
	await settle();
}

import GeneratePage from '../routes/statements/generate/+page.svelte';
import EditStatementPage from '../routes/statements/[id]/edit/+page.svelte';
import {
	allByTestId,
	byTestId,
	click,
	fakeBff,
	fireEvent,
	settle,
	show,
	submit
} from './helpers/dom';
import { statement } from './helpers/statement';
import { browserStorage, writeDraft } from '$lib/wizard-draft';

const MONTHS = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december'
];
const profile = (id: string, name: string, pct: number) => ({
	id,
	name,
	type: 'predefined',
	isActive: true,
	description: `${name} Verteilung`,
	monthlyPercentages: Object.fromEntries(MONTHS.map((m) => [m, pct]))
});
const data = {
	buildings: [
		{
			id: 'b1',
			name: 'Ahornhof',
			address: 'Ahornweg 3',
			postalCode: '8400',
			city: 'Winterthur',
			apartmentCount: 4
		},
		{
			id: 'b2',
			name: 'Lindenhof',
			address: 'Lindenweg 1',
			postalCode: '8400',
			city: 'Winterthur',
			apartmentCount: 2
		}
	],
	heatingProfiles: [
		profile('hp0', 'Unvollständig', 5),
		{
			...profile('hp1', 'Gleichmässig', 0),
			monthlyPercentages: { ...profile('', '', 8).monthlyPercentages, january: 12 }
		}
	],
	defaultManagementFeePercent: 3,
	defaultHeatingProfileId: '',
	defaultPeriod: { start: '2024-01-01', end: '2024-12-31' },
	defaultBuildingIds: [] as string[]
};
const text = () => document.body.textContent ?? '';
const heading = () => document.querySelector('h2 [data-step-label]')!.textContent!.trim();
const next = () => submit('wizard-next');
const preview = [
	{
		contractId: 'c1',
		tenantName: 'Anna Keller',
		apartmentNumber: '2.01',
		totalCosts: 1200,
		totalAdvancePayments: 1050,
		balance: 150
	},
	{
		contractId: 'c2',
		tenantName: 'Marc Huber',
		apartmentNumber: '2.02',
		totalCosts: 800,
		totalAdvancePayments: 850,
		balance: -50
	}
];
const invoices = [
	{ buildingId: 'b1', count: 3, first: '2024-01-15', last: '2024-06-30' },
	{ buildingId: 'b2', count: 0, first: null, last: null }
];
const open = (form: unknown = null) => show(GeneratePage, { data, form } as never);

beforeEach(() => localStorage.clear());

describe('Abrechnungen erstellen', () => {
	// A-10: ein Link wählt Gebäude und Periode; der Assistent beginnt bei Heizprofil und Verwaltungspauschale
	it('beginnt bei den Einstellungen, wenn ein Link Gebäude und Periode gewählt hat', async () => {
		// an older draft for other buildings is not restored over the link's choice
		open();
		await settle();
		next();
		await settle();
		click('generate-building-b2');
		await settle();
		document.body.innerHTML = '';
		show(GeneratePage, { data: { ...data, defaultBuildingIds: ['b1'] }, form: null } as never);
		await settle();
		expect(document.querySelector('h2')!.textContent).toMatch(/Schritt 3 von 5/);
		expect(byTestId('draft-restored')).toBeNull();
	});

	// Personas K1: wer über einen Link kommt, sieht Gebäude, Periode und woher die Einstellungen stammen
	it('nennt die Auswahl des Links und die Herkunft von Heizprofil und Pauschale', async () => {
		const preset = {
			building: 'Seeblick',
			start: '2025-01-01',
			end: '2025-12-31',
			fromStatements: true
		};
		show(GeneratePage, {
			data: { ...data, defaultBuildingIds: ['b1'], preset },
			form: null
		} as never);
		await settle();
		const said = byTestId('wizard-preset')!.textContent!.replace(/\s+/g, ' ');
		expect(said).toContain('Seeblick');
		expect(said).toContain('01.01.2025 – 31.12.2025');
		expect(said).toContain('wie die übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode');
	});

	it('beginnt mit der vorgeschlagenen Abrechnungsperiode, in Worten wiederholt', () => {
		open();
		expect(heading()).toBe('Abrechnungsperiode');
		expect(document.querySelector('h2')!.textContent).toMatch(/Schritt 1 von 5/);
		expect(byTestId<HTMLInputElement>('period-start-input')!.value).toBe('01.01.2024');
		expect(text()).toContain('Montag, 1. Januar 2024');
	});

	// Akonto zählt für alle Monate der Periode, auch die noch nicht bezahlten
	it('warnt, wenn die Abrechnungsperiode noch nicht zu Ende ist', () => {
		open();
		expect(byTestId('period-future-warning')).toBeNull();

		fireEvent(byTestId<HTMLInputElement>('period-end-input')!, 'input', '31.12.2099');

		expect(byTestId('period-future-warning')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Die Abrechnungsperiode ist noch nicht zu Ende.'
		);
	});

	// In der Vorschau steht der eigentliche Grund für Kosten weit unter dem Akonto
	it('wiederholt die Warnung zur laufenden Periode in der Vorschau', () => {
		show(PreviewChecks, {
			rows: [],
			period: { periodStart: '2099-01-01', periodEnd: '2099-12-31' },
			confirmed: false
		});

		expect(byTestId('preview-period-warning')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Die Abrechnungsperiode ist noch nicht zu Ende.'
		);
		expect(byTestId('preview-period-warning')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Erstellen Sie die Abrechnungen erst nach dem Ende der Periode.'
		);
	});

	it('verlangt mindestens ein Gebäude und setzt den Fokus auf den Fehler', async () => {
		open();
		next();
		await settle();
		expect(heading()).toBe('Gebäude');
		next();
		await settle();
		expect(byTestId('form-error')!.textContent).toContain(
			'Bitte wählen Sie mindestens ein Gebäude.'
		);
		expect(document.activeElement).toBe(byTestId('generate-building-b1'));
		click('generate-building-b1');
		expect(text()).toContain('1 von 2 gewählt');
		expect(byTestId('form-error')).toBeNull(); // the error goes once a building is chosen
	});

	it('wählt alle Gebäude aus und wieder ab', async () => {
		open();
		next();
		await settle();
		click('generate-all-buildings');
		expect(text()).toContain('2 von 2 gewählt');
		click('generate-all-buildings');
		expect(text()).toContain('0 von 2 gewählt');
	});

	async function toSettings() {
		open();
		next();
		await settle();
		click('generate-building-b1');
		next();
		await settle();
	}

	it('wählt das erste vollständige Heizprofil vor und sperrt unvollständige', async () => {
		await toSettings();
		expect(heading()).toBe('Heizprofil und Verwaltungspauschale');
		expect(byTestId<HTMLSelectElement>('heating-profile-select')!.value).toBe('hp1');
		expect(byTestId<HTMLOptionElement>('heating-profile-option-hp0')!.disabled).toBe(true);
		expect(byTestId('heating-profile-option-hp0')!.textContent).toContain('(60%) - nicht wählbar');
		// The predefined profiles' descriptions are English; only an own profile's is shown
		expect(text()).not.toContain('Gleichmässig Verteilung');
	});

	// Nebenkosten, Pauschale und Heizkostentabelle gelten nur, wenn der Mietvertrag sie vorsieht (Art. 257a Abs. 2 OR)
	it('erinnert daran, dass Heizprofil und Verwaltungspauschale im Mietvertrag vereinbart sein müssen', async () => {
		await toSettings();
		// Dwello kennt keine Zwischenablesung: das sagt der Text, statt sie zu versprechen
		expect(text()).toContain(
			'Dwello verteilt nach dem Heizprofil und kann Zählerstände nicht berücksichtigen. Wurden beim Mieterwechsel die Zähler für Heizung oder Warmwasser in der Wohnung abgelesen, gelten diese Werte: Erstellen Sie die Abrechnung dieser Wohnung dann ausserhalb von Dwello und löschen Sie die Entwürfe aller Mietverträge dieser Wohnung, auch wenn Sie die Abrechnungen später neu erstellen.'
		);
		// Zähler in den Wohnungen: meist ist das ganze Gebäude nach Verbrauch abzurechnen
		expect(text()).toContain(
			'Hat Ihr Gebäude in den Wohnungen Wärme- oder Warmwasserzähler oder Heizkostenverteiler (kleine Geräte an den Heizkörpern), müssen Sie meist nach Verbrauch abrechnen. Das kann Dwello nicht: Erstellen Sie die Abrechnungen dann ausserhalb von Dwello.'
		);
		expect(text()).toContain(
			'Verlangen Sie eine Verwaltungspauschale nur, wenn sie im Mietvertrag vereinbart ist.'
		);
		// Ein Lauf rechnet alle Mietverträge eines Gebäudes: andere Sätze über die Entwürfe dieser Mietverträge
		expect(text()).toContain(
			'Hat ein Mietvertrag einen anderen Satz, löschen Sie danach seinen Entwurf und erstellen Sie ihn mit diesem Satz neu.'
		);
	});

	it('berechnet die Verwaltungspauschale aus den eigenen Nebenkosten jedes Mieters und warnt über 3 %', async () => {
		await toSettings();
		expect(text()).toContain('Prozentsatz der eigenen Nebenkosten jedes Mieters');
		fireEvent(byTestId<HTMLInputElement>('management-fee-input')!, 'input', '4.5');
		expect(byTestId('management-fee-hint')).not.toBeNull();
	});

	// Ein geleertes Feld ist kein Satz von 0 %: der Assistent fragt nach, statt still keine Pauschale zu verrechnen
	it('verlangt einen Satz, wenn das Feld der Verwaltungspauschale leer ist, und nimmt ein Komma an', async () => {
		await toSettings();
		const fee = byTestId<HTMLInputElement>('management-fee-input')!;
		fireEvent(fee, 'input', '');
		await next();
		expect(text()).toContain(
			'Bitte geben Sie einen Prozentsatz ab 0 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.'
		);
		fireEvent(fee, 'input', '1e2');
		await next();
		expect(text()).toContain(
			'Bitte geben Sie einen Prozentsatz ab 0 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.'
		);
		fireEvent(fee, 'input', '2,5');
		expect(fee.value).toBe('2,5');
		expect(
			document.querySelector<HTMLInputElement>('input[name="managementFeePercent"]')!.value
		).toBe('2.5');
	});

	// Vor dem Erstellen sieht man, mit welchem Heizprofil und welcher Pauschale gerechnet wurde
	it('nennt in der Vorschau Heizprofil und Verwaltungspauschale des Laufs', () => {
		const run = { ...data, defaultHeatingProfileId: 'hp1', defaultManagementFeePercent: 2.5 };
		show(GeneratePage, { data: run, form: { preview, invoices } } as never);
		expect(byTestId('preview-fee')!.textContent).toContain(
			'2.5 % der eigenen Nebenkosten jedes Mieters'
		);
		expect(byTestId('preview-heating-profile')!.textContent).toContain('Gleichmässig');
	});

	it('nennt einen Saldo von 0 in der Vorschau ausgeglichen', () => {
		open({ preview: [{ ...preview[0], balance: 0 }], invoices });
		expect(allByTestId('preview-row')[0].textContent!.replace(/\s+/g, ' ')).toContain(
			'Ausgeglichen CHF 0.00'
		);
	});

	it('erklärt, warum die Kosten aller Abrechnungen kleiner sein können als die Rechnungen', () => {
		open({ preview, invoices });
		expect(document.body.textContent).toContain(
			'Den Anteil leerer Wohnungen trägt der Vermieter; er ist in diesem Betrag nicht enthalten.'
		);
	});

	it('zeigt die Vorschau mit Saldo in Worten und den Rechnungen jedes Gebäudes', () => {
		open({ preview, invoices });
		expect(heading()).toBe('Vorschau');
		expect(byTestId('preview-count')!.textContent!.trim()).toBe('2');
		const [anna, marc] = [...document.querySelectorAll('[data-testid="preview-row"]')].map((r) =>
			r.textContent!.replace(/\s+/g, ' ')
		);
		expect(anna).toContain('Nachzahlung CHF 150.00');
		expect(marc).toContain('Rückerstattung CHF 50.00');
		const rows = [...document.querySelectorAll('[data-testid="preview-invoices"]')].map((r) =>
			r.textContent!.replace(/\s+/g, ' ')
		);
		expect(rows[0]).toContain('3 Rechnungen vom 15.01.2024 bis 30.06.2024');
		expect(rows[1]).toContain('Keine Rechnungen erfasst');
	});

	// Ein Jahr ohne Öllieferung: keine Rechnung, aber Verbrauch aus dem Tank
	it('zeigt beim Gebäude ohne Rechnungen den Hinweis zum Tankbestand und verspricht keine Kosten von CHF 0.00', () => {
		const sums = (count: number, total: number) => ({ count, total });
		open({
			preview,
			invoices: [
				invoices[0],
				{
					...invoices[1],
					check: {
						buildingId: 'b2',
						comparedWith: { start: '2023-01-01', end: '2023-12-31' },
						hasComparison: true,
						findings: [
							{
								categoryId: 'h',
								categoryName: 'Heizung',
								kind: 'stock',
								current: sums(0, 0),
								previous: sums(0, 0),
								missingParts: [{ start: '2024-12-31', end: '2024-12-31' }],
								changePercent: null
							},
							{
								categoryId: 'w',
								categoryName: 'Hauswart',
								kind: 'missing',
								current: sums(0, 0),
								previous: sums(1, 900),
								missingParts: [],
								changePercent: null
							}
						]
					}
				}
			]
		});

		const findings = [...document.querySelectorAll('[data-testid="category-finding"]')].map(
			(f) => f.textContent!
		);
		expect(findings).toHaveLength(1); // the missing invoices are the warning above
		expect(findings[0]).toContain('Tankbestand am 31.12.2024 fehlt');
		expect(byTestId('missing-invoices')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Ohne Rechnungen fehlen deren Kosten in den Abrechnungen, und die Mieter erhalten ihr Akonto weitgehend zurück.'
		);
	});

	it('warnt vor einem Gebäude ohne Rechnungen und geht erst nach Bestätigung weiter', async () => {
		open({ preview, invoices });
		const warning = byTestId('missing-invoices')!;
		expect(warning.textContent).toContain('Lindenhof');
		// The invoice form preselects the building and returns to the wizard after saving
		expect(warning.querySelector('a')!.getAttribute('href')).toBe(
			'/invoices/new?building=b2&returnTo=%2Fstatements%2Fgenerate%3Fschritt%3D3&periodStart=2024-01-01&periodEnd=2024-12-31'
		);
		next();
		await settle();
		expect(byTestId('form-error')!.textContent).toContain(
			'Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.'
		);
		expect(document.activeElement).toBe(byTestId('confirm-missing-invoices'));
		click('confirm-missing-invoices');
		next();
		await settle();
		expect(heading()).toBe('Erstellen');
		// the confirmed warning is repeated right before the final button
		expect(byTestId('generate-warning')!.textContent).toContain('Lindenhof');
		expect(byTestId('generate-warning')!.textContent).toContain('ohne Rechnungen');
	});

	it('sagt vor dem Erstellen, dass nur Entwürfe entstehen und nichts verschickt wird', async () => {
		open({ preview, invoices: [invoices[0]] });
		next();
		await settle();
		expect(byTestId('generate-drafts-note')!.textContent).toContain(
			'2 Nebenkostenabrechnungen als Entwurf'
		);
		expect(byTestId('generate-drafts-note')!.textContent).toContain('nichts verschickt');
		expect(byTestId('generate-statements-button')!.textContent).toContain('Entwürfe erstellen');
	});

	it('spricht bei einer einzigen Abrechnung in der Einzahl', async () => {
		open({ preview: [preview[0]], invoices: [invoices[0]] });
		next();
		await settle();
		expect(byTestId('generate-drafts-note')!.textContent).toContain(
			'Es wird 1 Nebenkostenabrechnung als Entwurf erstellt.'
		);
	});

	it('meldet eine Periode ohne Mietverträge und geht dann nicht weiter', async () => {
		open({ preview: [], invoices: [invoices[0]] });
		expect(byTestId('preview-empty')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'In dieser Abrechnungsperiode gibt es keine Mietverträge ohne Abrechnung in den gewählten Gebäuden.'
		);
		next();
		await settle();
		expect(heading()).toBe('Vorschau');
		expect(text()).toContain(
			'Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude, oder löschen Sie zuerst die Entwürfe, die Sie neu berechnen wollen.'
		);
	});

	// Nachzügler: alle Mietverträge haben schon eine Abrechnung, der Verwalter will einen Entwurf neu berechnen
	it('sagt bei einer leeren Vorschau, dass alle Mietverträge schon eine Abrechnung haben, und wo sie stehen', () => {
		open({ preview: [], invoices: [{ ...invoices[0], buildingId: 'b1', statements: 2 }] });

		const empty = byTestId('preview-empty')!.parentElement!.textContent!.replace(/\s+/g, ' ');
		expect(empty).toContain(
			'Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.'
		);
		expect(document.querySelector('a[href="/statements?building=b1"]')).not.toBeNull();
	});

	it('nennt Gebäude, deren Rechnungen nur einen Teil der Periode abdecken', () => {
		open({
			preview,
			invoices: [{ buildingId: 'b1', count: 2, first: '2024-01-15', last: '2024-03-31' }]
		});
		expect(byTestId('partial-invoices')!.textContent).toContain('Ahornhof');
		expect(byTestId('missing-invoices')).toBeNull();
	});

	it('führt bei fehlendem Tankbestand zum Gebäude, auch neben einem Hinweis zur selben Kategorie', () => {
		const sums = (count: number, total: number) => ({ count, total });
		const heating = {
			categoryId: 'h',
			categoryName: 'Heizung',
			current: sums(1, 4880),
			previous: sums(1, 5120),
			changePercent: null
		};
		open({
			preview,
			invoices: [
				{
					...invoices[0],
					check: {
						buildingId: 'b1',
						comparedWith: { start: '2023-01-01', end: '2023-12-31' },
						hasComparison: true,
						findings: [
							{
								...heating,
								kind: 'stock',
								missingParts: [{ start: '2025-12-31', end: '2025-12-31' }]
							},
							{ ...heating, kind: 'deviation', missingParts: [], changePercent: -40 }
						]
					}
				}
			]
		});

		const link = byTestId<HTMLAnchorElement>('category-finding-stock-link')!;
		expect(link.textContent).toContain('Tankbestand erfassen');
		expect(link.getAttribute('href')).toBe('/buildings/b1');
		// the fine print about missing invoices belongs to invoices, not to the tank
		expect(byTestId('category-check')!.textContent).not.toContain('Fehlt eine Rechnung');
		expect(byTestId('category-check')!.textContent).toContain(
			'Erfassen oder prüfen Sie die Tankbestände'
		);
		expect(byTestId('category-check')!.querySelector('p')!.textContent).toBe(
			'Möglicherweise fehlen Rechnungen'
		);
	});

	it('führt bei negativem Verbrauch zum Prüfen der Tankbestände', () => {
		const sums = (count: number, total: number) => ({ count, total });
		const heating = {
			categoryId: 'h',
			categoryName: 'Heizung',
			previous: sums(0, 0),
			missingParts: [],
			changePercent: null
		};
		const withFindings = (findings: unknown[]) =>
			open({
				preview,
				invoices: [
					{
						...invoices[0],
						check: {
							buildingId: 'b1',
							comparedWith: { start: '2023-01-01', end: '2023-12-31' },
							hasComparison: true,
							findings
						}
					}
				]
			});

		withFindings([{ ...heating, kind: 'stock', current: sums(0, -880) }]);
		expect(byTestId('category-finding-stock-link')!.textContent).toContain('Tankbestände prüfen');
	});

	it('bietet bei Heizkosten ohne Tankbestand an, ihn zu erfassen', () => {
		const sums = (count: number, total: number) => ({ count, total });
		open({
			preview,
			invoices: [
				{
					...invoices[0],
					check: {
						buildingId: 'b1',
						comparedWith: { start: '2023-01-01', end: '2023-12-31' },
						hasComparison: true,
						findings: [
							{
								categoryId: 'h',
								categoryName: 'Heizung',
								kind: 'tank',
								current: sums(1, 2000),
								previous: sums(0, 0),
								missingParts: [],
								changePercent: null
							}
						]
					}
				}
			]
		});

		// its own hint, not a comparison with the year before
		expect(byTestId('category-check')).toBeNull();
		const question = byTestId('tank-question')!;
		expect(question.textContent).toContain('Heizen Sie mit Öl, Flüssiggas, Pellets oder Holz?');
		expect(question.querySelector('a')!.getAttribute('href')).toBe('/buildings/b1');
		expect(question.querySelector('a')!.textContent).toContain('Tankbestand erfassen');
	});

	it('nennt pro Kategorie fehlende Rechnungen im Vergleich zum Vorjahr und verlangt eine Bestätigung', async () => {
		const sums = (count: number, total: number) => ({ count, total });
		open({
			preview,
			invoices: [
				{
					...invoices[0],
					check: {
						buildingId: 'b1',
						comparedWith: { start: '2023-01-01', end: '2023-12-31' },
						hasComparison: true,
						findings: [
							{
								categoryId: 'k',
								categoryName: 'Kaminfeger',
								kind: 'missing',
								current: sums(0, 0),
								previous: sums(1, 290),
								missingParts: [],
								changePercent: null
							},
							{
								categoryId: 'w',
								categoryName: 'Kaltwasser',
								kind: 'gap',
								current: sums(1, 470),
								previous: sums(2, 935),
								missingParts: [{ start: '2025-07-01', end: '2025-12-31' }],
								changePercent: null
							},
							{
								categoryId: 'h',
								categoryName: 'Heizung',
								kind: 'deviation',
								current: sums(1, 6565),
								previous: sums(1, 4800),
								missingParts: [],
								changePercent: 37
							}
						]
					}
				}
			]
		});
		const check = byTestId('category-check')!;
		expect(check.textContent).toContain('Ahornhof');
		expect(check.textContent).toContain('gleichen Zeitraum im Vorjahr (01.01.2023 – 31.12.2023)');
		const findings = [...document.querySelectorAll('[data-testid="category-finding"]')].map((f) =>
			f.textContent!.replace(/\s+/g, ' ').trim()
		);
		expect(findings).toEqual([
			'Kaminfeger: Keine Rechnung in dieser Kategorie erfasst. Im Vorjahr: Kosten von CHF 290.00.',
			'Kaltwasser: Rechnung für das 2. Halbjahr fehlt. Im Vorjahr: 2 Rechnungen.',
			'Heizung: CHF 6’565.00, 37 % mehr als im Vorjahr (CHF 4’800.00). Prüfen Sie den Betrag und den Zeitraum, für den die Rechnung gilt.'
		]);
		expect(check.querySelector('p')!.textContent).toBe('Möglicherweise fehlen Rechnungen');
		// the findings of a building form one list named by the building
		expect(check.querySelector('ul')!.getAttribute('aria-label')).toBe('Ahornhof');
		// what a missing invoice means for the tenants
		expect(check.textContent!.replace(/\s+/g, ' ')).toContain(
			'Später können Sie sie nur noch mit einer berichtigten Abrechnung und nicht in jedem Fall nachverlangen.'
		);
		next();
		await settle();
		expect(byTestId('form-error')!.textContent).toContain('Bestätigen Sie');
		click('confirm-missing-invoices');
		next();
		await settle();
		expect(heading()).toBe('Erstellen');
		// repeated before the final button
		expect(byTestId('generate-incomplete')!.textContent).toContain('Ahornhof');
	});

	it('weist auf eine Abweichung zum Vorjahr hin, ohne eine Bestätigung zu verlangen', async () => {
		open({
			preview,
			invoices: [
				{
					...invoices[0],
					check: {
						buildingId: 'b1',
						comparedWith: { start: '2023-01-01', end: '2023-12-31' },
						hasComparison: true,
						findings: [
							{
								categoryId: 'h',
								categoryName: 'Heizung',
								kind: 'deviation',
								current: { count: 1, total: 6565 },
								previous: { count: 1, total: 4800 },
								missingParts: [],
								changePercent: 37
							}
						]
					}
				}
			]
		});
		expect(byTestId('category-finding')!.textContent).toContain('Heizung');
		expect(byTestId('category-check')!.querySelector('p')!.textContent).toBe(
			'Kosten im Vergleich zum Vorjahr'
		);
		expect(byTestId('confirm-missing-invoices')).toBeNull();
		next();
		await settle();
		expect(heading()).toBe('Erstellen');
	});

	// A building without any invoice already has its own warning; its categories are not listed again
	it('nennt die Kategorien eines Gebäudes ohne Rechnungen nicht noch einmal', () => {
		open({
			preview,
			invoices: [
				{
					...invoices[1],
					check: {
						buildingId: 'b2',
						comparedWith: { start: '2023-01-01', end: '2023-12-31' },
						hasComparison: true,
						findings: [
							{
								categoryId: 'k',
								categoryName: 'Kaminfeger',
								kind: 'missing',
								current: { count: 0, total: 0 },
								previous: { count: 1, total: 290 },
								missingParts: [],
								changePercent: null
							}
						]
					}
				}
			]
		});
		expect(byTestId('missing-invoices')).not.toBeNull();
		expect(byTestId('category-check')).toBeNull();
	});

	it('vergleicht die Kosten jeder Abrechnung mit dem Akonto', () => {
		open({
			preview: [{ ...preview[0], totalCosts: 1200, totalAdvancePayments: 3000 }, preview[1]],
			invoices: [invoices[0]]
		});
		const hints = [...document.querySelectorAll('[data-testid="preview-akonto-hint"]')].map((h) =>
			h.textContent!.trim()
		);
		expect(hints).toEqual(['Kosten CHF\u00a01’800.00 (60 %) unter dem Akonto. Fehlen Rechnungen?']);
	});

	it('warnt, wenn es für ein Gebäude in der Periode schon Abrechnungen gibt, und verlangt eine Bestätigung', async () => {
		open({
			preview,
			invoices: [
				{ buildingId: 'b1', count: 3, first: '2024-01-15', last: '2024-12-15', statements: 2 }
			]
		});
		expect(byTestId('existing-statements')!.textContent).toContain('Ahornhof');
		expect(byTestId('existing-statements')!.textContent).toContain('2 Nebenkostenabrechnungen');
		expect(byTestId('existing-statements')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut.'
		);
		expect(
			byTestId('existing-statements')!.querySelector('a[href="/statements?building=b1"]')
		).not.toBeNull();
		next();
		await settle();
		expect(byTestId('form-error')!.textContent).toContain('Bestätigen Sie');
		click('confirm-missing-invoices');
		next();
		await settle();
		expect(heading()).toBe('Erstellen');
	});

	it('zeigt bei einer leeren Vorschau keine Rechnungsprüfung', () => {
		open({ preview: [], invoices });
		expect(byTestId('missing-invoices')).toBeNull();
		expect(byTestId('confirm-missing-invoices')).toBeNull();
	});

	it('sagt an, dass die Vorschau berechnet wird, und führt danach zur Vorschau', async () => {
		await toSettings();
		next();
		expect(byTestId('wizard-status')!.textContent).toContain('Vorschau wird berechnet');
		await answer({ type: 'success', data: { preview, invoices } });
		expect(heading()).toBe('Vorschau');
		expect(document.activeElement).toBe(document.querySelector('h2'));
		expect(byTestId('wizard-status')!.textContent!.trim()).toBe('');
	});

	it('behält die Vorschau, wenn das Erstellen scheitert', async () => {
		open({ preview, invoices: [invoices[0]] });
		next();
		await settle();
		submit('generate-statements-button'); // "Entwürfe erstellen"
		await answer({ type: 'failure', data: { error: 'Backend nicht erreichbar' } });
		expect(heading()).toBe('Erstellen');
		expect(byTestId('generate-drafts-note')!.textContent).toContain('2 Nebenkostenabrechnungen');
		expect(document.activeElement).toBe(document.querySelector('h2'));
	});

	it('verbindet die Warnungen mit dem Kästchen, das sie bestätigt', () => {
		open({ preview, invoices });
		const box = byTestId('confirm-missing-invoices')!;
		const described = box.getAttribute('aria-describedby')!.split(' ');
		expect(described.map((id) => document.getElementById(id)?.textContent).join(' ')).toContain(
			'Lindenhof'
		);
	});

	it('meldet einen Fehler des Servers', () => {
		open({ error: 'Periode ungültig' });
		expect(text()).toContain('Periode ungültig');
	});

	it('verbindet die fehlende Bestätigung mit dem Kästchen, damit sie vorgelesen wird', async () => {
		open({ preview, invoices });
		next();
		await settle();
		const box = byTestId('confirm-missing-invoices')!;
		expect(box.getAttribute('aria-invalid')).toBe('true');
		const described = box.getAttribute('aria-describedby')!.split(' ');
		expect(described.map((id) => document.getElementById(id)?.textContent).join(' ')).toContain(
			'Bestätigen Sie'
		);
	});

	it('meldet die erstellten Entwürfe und führt zu ihnen', () => {
		open({ created: 2 });
		expect(byTestId('generation-result')!.textContent).toContain(
			'2 Nebenkostenabrechnungen sind als Entwurf erstellt'
		);
		expect(byTestId('show-statements-button')!.getAttribute('href')).toBe(
			'/statements?status=draft&periodStart=2024-01-01&periodEnd=2024-12-31'
		);
		expect(byTestId('wizard-next')).toBeNull();
	});
});

describe('Entwurf der Abrechnungen', () => {
	it('legt nach der ersten Eingabe einen Entwurf an und setzt ihn später fort', async () => {
		open();
		await settle();
		expect(localStorage.length).toBe(0);
		next();
		await settle();
		click('generate-building-b2');
		await settle();
		expect(byTestId('save-status')!.textContent).toContain('Entwurf gespeichert');

		document.body.innerHTML = '';
		open();
		await settle();
		expect(byTestId('draft-restored')).not.toBeNull();
		next();
		await settle();
		expect(byTestId<HTMLInputElement>('generate-building-b2')!.checked).toBe(true);
	});
});

describe('Wiederhergestellte Angaben, die es nicht mehr gibt', () => {
	const notes = () => allByTestId('draft-note').map((note) => note.textContent!.trim());
	const draftWith = (buildingIds: string[], heatingProfileId: string) =>
		writeDraft(
			browserStorage(),
			'statements',
			{
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				heatingProfileId,
				managementFeePercent: 3,
				buildingIds
			},
			new Date()
		);

	it('nennt ein gelöschtes Gebäude und ein gelöschtes Heizprofil', async () => {
		draftWith(['b1', 'weg'], 'alt');
		open();
		await settle();
		expect(notes()).toEqual([
			'Ein Gebäude aus Ihren Angaben gibt es nicht mehr. Dwello hat es aus der Auswahl entfernt. Prüfen Sie die Gebäude im Schritt 2 «Gebäude».',
			'Das Heizprofil aus Ihren Angaben gibt es nicht mehr. Wählen Sie im Schritt 3 «Heizprofil und Verwaltungspauschale» ein anderes.'
		]);
	});

	it('nennt die Zahl mehrerer gelöschter Gebäude und schweigt, wenn es alles noch gibt', async () => {
		draftWith(['weg', 'fort'], 'hp1');
		open();
		await settle();
		expect(notes()).toEqual([
			'2 Gebäude aus Ihren Angaben gibt es nicht mehr. Dwello hat sie aus der Auswahl entfernt. Prüfen Sie die Gebäude im Schritt 2 «Gebäude».'
		]);

		document.body.innerHTML = '';
		draftWith(['b1'], 'hp1');
		open();
		await settle();
		expect(byTestId('draft-restored')).not.toBeNull();
		expect(notes()).toEqual([]);
	});
});

describe('Zurück vom Erfassen einer Rechnung', () => {
	it('überspringt die Wahl der Gebäude nicht, wenn ein gewähltes Gebäude inzwischen fehlt', async () => {
		writeDraft(
			browserStorage(),
			'statements',
			{
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				heatingProfileId: 'hp1',
				managementFeePercent: 3,
				buildingIds: ['b1', 'weg']
			},
			new Date()
		);
		history.replaceState(null, '', '/statements/generate?schritt=3');
		open();
		await settle();
		history.replaceState(null, '', '/');

		// the notice asks to check the buildings: the wizard does not skip their step (code review C-5)
		expect(heading()).toBe('Abrechnungsperiode');
		expect(byTestId('resume-notice')!.className).toContain('hidden');
	});

	it('führt zum Schritt vor der Vorschau, damit diese mit der neuen Rechnung neu berechnet wird', async () => {
		writeDraft(
			browserStorage(),
			'statements',
			{
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				heatingProfileId: 'hp1',
				managementFeePercent: 3,
				buildingIds: ['b1']
			},
			new Date()
		);
		history.replaceState(null, '', '/statements/generate?schritt=3');
		open();
		await settle();
		history.replaceState(null, '', '/');

		expect(heading()).toBe('Heizprofil und Verwaltungspauschale');
		// says why this step, so the way back does not look like a mistake
		expect(byTestId('resume-notice')!.textContent).toContain(
			'Mit «Weiter» berechnet Dwello die Vorschau mit der neuen Rechnung.'
		);
	});
});

describe('Abrechnung bearbeiten', () => {
	it('füllt Zahlungsfrist und Bemerkung und zeigt die berechneten Kosten nur an', () => {
		show(EditStatementPage, {
			data: { statement: statement({ notes: 'Ratenzahlung' }) },
			form: null
		} as never);

		expect(byTestId<HTMLInputElement>('payment-deadline-input')!.value).toBe('28.02.2025');
		expect(byTestId<HTMLTextAreaElement>('statement-notes-input')!.value).toBe('Ratenzahlung');
		expect(text()).toContain('Heizung');
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/statements/s1');
	});

	it('meldet einen Fehler beim Speichern', () => {
		show(EditStatementPage, {
			data: { statement: statement() },
			form: { errors: { form: 'Speichern fehlgeschlagen' } }
		} as never);
		expect(text()).toContain('Speichern fehlgeschlagen');
	});
});

describe('Verwaltungspauschale', () => {
	it('erklärt die Verteilung ohne unklaren Bezug', async () => {
		open();
		await settle();
		next();
		await settle();
		click('generate-building-b1');
		next();
		await settle();
		expect(heading()).toBe('Heizprofil und Verwaltungspauschale');
		expect(document.body.textContent).not.toContain('Die Pauschale wird so');
	});
});

describe('Rechnungen schon bei der Wahl der Gebäude', () => {
	it('sagt bei jedem Gebäude, ob für die Abrechnungsperiode Rechnungen erfasst sind', async () => {
		// one request for the whole period, counted per building in the browser
		const calls = fakeBff((call) =>
			call.path.startsWith('/statements/billed')
				? [200, []]
				: [
						200,
						{
							invoices: [{ buildingId: 'b1' }, { buildingId: 'b1' }, { buildingId: 'b1' }],
							total: 3
						}
					]
		);
		open();
		await settle();
		next();
		await settle();

		expect(byTestId('generate-building-invoices-b1')!.textContent).toContain(
			'3 Rechnungen in der Abrechnungsperiode'
		);
		expect(byTestId('generate-building-invoices-b2')!.textContent).toContain(
			'Keine Rechnungen in der Abrechnungsperiode erfasst'
		);
		const invoiceCalls = calls.filter((call) => call.path.startsWith('/invoices'));
		expect(invoiceCalls).toHaveLength(1);
		expect(invoiceCalls[0].path).toMatch(/dateFrom=\d{4}-\d{2}-\d{2}&dateTo=\d{4}-\d{2}-\d{2}/);
		expect(invoiceCalls[0].path).not.toContain('buildingId');
		// the list stays inside its panel on phones (a fieldset is as wide as its content by default)
		expect(document.querySelector('fieldset')!.className).toMatch(/(^| )min-w-0( |$)/);
	});
});

describe('Schon abgerechnete Mietverträge bei der Wahl der Gebäude', () => {
	const billed = (rows: { buildingId: string; contracts: number; billed: number }[]) =>
		fakeBff((call) =>
			call.path.startsWith('/statements/billed') ? [200, rows] : [200, { invoices: [], total: 0 }]
		);
	const billedText = (id: string) =>
		byTestId(`generate-building-billed-${id}`)?.textContent?.trim();

	it('nennt, wie viele Mietverträge der Abrechnungsperiode schon eine Abrechnung haben', async () => {
		const calls = billed([
			{ buildingId: 'b1', contracts: 3, billed: 2 },
			{ buildingId: 'b2', contracts: 2, billed: 0 }
		]);
		open();
		await settle();
		next();
		await settle();

		expect(billedText('b1')).toBe(
			'Von 3 Mietverträgen in dieser Abrechnungsperiode haben 2 schon eine Abrechnung, die diesen Zeitraum ganz oder teilweise abdeckt.'
		);
		expect(billedText('b2')).toBeUndefined();
		// read after the building's name, not as part of it (persona Sven P-1), and a tap on it still chooses the
		// building (persona Marco P-3)
		const checkbox = byTestId('generate-building-b1')!;
		const note = byTestId('generate-building-billed-b1')!;
		expect(checkbox.getAttribute('aria-describedby')).toBe(note.id);
		expect(note.getAttribute('aria-hidden')).toBe('true');
		expect(byTestId<HTMLInputElement>('generate-building-b1')!.checked).toBe(false);
		click('generate-building-billed-b1');
		await settle();
		expect(byTestId<HTMLInputElement>('generate-building-b1')!.checked).toBe(true);
		// one request for all buildings and the period of step 1
		const [call] = calls.filter((c) => c.path.startsWith('/statements/billed'));
		expect(call.path).toBe(
			'/statements/billed?buildingIds=b1%2Cb2&periodStart=2024-01-01&periodEnd=2024-12-31'
		);
	});

	it('sagt, dass für ein Gebäude keine Abrechnung entsteht, wenn alle Mietverträge eine haben', async () => {
		billed([
			{ buildingId: 'b1', contracts: 2, billed: 2 },
			{ buildingId: 'b2', contracts: 1, billed: 1 }
		]);
		open();
		await settle();
		next();
		await settle();

		expect(billedText('b1')).toBe(
			'Alle Mietverträge in dieser Abrechnungsperiode haben schon eine Abrechnung, die diesen Zeitraum ganz oder teilweise abdeckt. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen.'
		);
		expect(billedText('b2')).toBe(
			'Der einzige Mietvertrag in dieser Abrechnungsperiode hat schon eine Abrechnung, die diesen Zeitraum ganz oder teilweise abdeckt. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen.'
		);
	});

	it('nennt einen einzelnen abgerechneten Mietvertrag in der Einzahl', async () => {
		billed([{ buildingId: 'b1', contracts: 2, billed: 1 }]);
		open();
		await settle();
		next();
		await settle();

		expect(billedText('b1')).toBe(
			'Von 2 Mietverträgen in dieser Abrechnungsperiode hat 1 schon eine Abrechnung, die diesen Zeitraum ganz oder teilweise abdeckt.'
		);
	});
});
