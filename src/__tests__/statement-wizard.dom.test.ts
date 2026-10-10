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
import { byTestId, click, fakeBff, fireEvent, settle, show, submit } from './helpers/dom';
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
	distributionKeys: [{ id: 'k-area', name: 'Pro Fläche (m²)' }],
	defaultManagementFeePercent: 3,
	defaultHeatingProfileId: '',
	defaultPeriod: { start: '2024-01-01', end: '2024-12-31' }
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
			'Dwello verteilt nach dem Heizprofil und kann Zählerstände nicht berücksichtigen. Wurden beim Mieterwechsel die Zähler abgelesen, gelten diese Werte: Erstellen Sie die Abrechnung dieser Wohnung dann ausserhalb von Dwello und löschen Sie die Entwürfe aller Mietverträge dieser Wohnung, auch wenn Sie die Abrechnungen später neu erstellen.'
		);
		// Zähler in den Wohnungen: meist ist das ganze Gebäude nach Verbrauch abzurechnen
		expect(text()).toContain(
			'Hat Ihr Gebäude Zähler oder Heizkostenverteiler (kleine Geräte an den Heizkörpern) in den Wohnungen, müssen Sie meist nach Verbrauch abrechnen. Das kann Dwello nicht: Erstellen Sie die Abrechnungen dann ausserhalb von Dwello.'
		);
		expect(text()).toContain(
			'Verlangen Sie eine Verwaltungspauschale nur, wenn sie im Mietvertrag vereinbart ist.'
		);
		expect(text()).toContain(
			'Haben Mietverträge verschiedene Sätze, erstellen Sie die Abrechnungen getrennt.'
		);
	});

	it('berechnet die Verwaltungspauschale aus den eigenen Nebenkosten oder verteilt sie nach einem Verteilschlüssel und warnt über 3 %', async () => {
		await toSettings();
		const key = byTestId<HTMLSelectElement>('management-fee-key-select')!;
		expect([...key.options].map((o) => [o.value, o.textContent?.trim()])).toEqual([
			['', 'Nach den eigenen Nebenkosten jedes Mieters'],
			['k-area', 'Pro Fläche (m²)']
		]);
		fireEvent(key, 'change', 'k-area');
		expect(
			document.querySelector<HTMLInputElement>('input[name="managementFeeDistributionKeyId"]')!
				.value
		).toBe('k-area');
		fireEvent(byTestId<HTMLInputElement>('management-fee-input')!, 'input', '4.5');
		expect(byTestId('management-fee-hint')).not.toBeNull();
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
		expect(text()).toContain('Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude.');
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
			'/statements?status=draft'
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

describe('Zurück vom Erfassen einer Rechnung', () => {
	it('führt zum Schritt vor der Vorschau, damit diese mit der neuen Rechnung neu berechnet wird', async () => {
		writeDraft(
			browserStorage(),
			'statements',
			{
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				heatingProfileId: 'hp1',
				managementFeePercent: 3,
				managementFeeDistributionKeyId: '',
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
		const calls = fakeBff(() => [
			200,
			{ invoices: [{ buildingId: 'b1' }, { buildingId: 'b1' }, { buildingId: 'b1' }], total: 3 }
		]);
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
		expect(calls).toHaveLength(1);
		expect(calls[0].path).toMatch(/dateFrom=\d{4}-\d{2}-\d{2}&dateTo=\d{4}-\d{2}-\d{2}/);
		expect(calls[0].path).not.toContain('buildingId');
		// the list stays inside its panel on phones (a fieldset is as wide as its content by default)
		expect(document.querySelector('fieldset')!.className).toMatch(/(^| )min-w-0( |$)/);
	});
});
