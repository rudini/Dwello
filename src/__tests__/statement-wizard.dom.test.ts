import PreviewChecks from '../routes/statements/generate/PreviewChecks.svelte';
import CategoryFindingItem from '../routes/statements/generate/CategoryFindingItem.svelte';
import completeness from '../../tests/contracts/invoice-completeness.json';
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

	// #89, closing review C-1: no other statement at the run's rate: the profile from them, the fee from the settings
	it('sagt, wenn nur das Heizprofil von den übrigen Abrechnungen kommt', async () => {
		const preset = {
			building: 'Seeblick',
			start: '2025-01-01',
			end: '2025-12-31',
			fromStatements: true,
			feeFromSettings: true
		};
		show(GeneratePage, {
			data: { ...data, defaultBuildingIds: ['b1'], preset },
			form: null
		} as never);
		await settle();
		expect(byTestId('wizard-preset')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Das Heizprofil ist wie bei den übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode eingestellt, die Verwaltungspauschale kommt aus den Einstellungen.'
		);
	});

	// #119: verschieden eingestellte übrige Abrechnungen: beides aus den Einstellungen
	it('sagt, wenn die übrigen Abrechnungen verschieden eingestellt sind', async () => {
		const preset = {
			building: 'Seeblick',
			start: '2025-01-01',
			end: '2025-12-31',
			fromStatements: false,
			feeFromSettings: true,
			differing: true
		};
		show(GeneratePage, {
			data: { ...data, defaultBuildingIds: ['b1'], preset },
			form: null
		} as never);
		await settle();
		expect(byTestId('wizard-preset')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Die übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode sind verschieden eingestellt. Heizprofil und Verwaltungspauschale kommen deshalb aus den Einstellungen.'
		);
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
		// step 3 asks whether the contracts agree the period's Nebenkosten (#91): none open here
		fakeBff((call) => (call.path.startsWith('/statements/agreements') ? [200, []] : [500]));
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
		// #89: the run's rate applies only where the contract agrees a fee; an own rate in the contract goes first
		expect(text()).toContain(
			'Prozentsatz der eigenen Nebenkosten jedes Mieters, für dessen Mietvertrag eine Verwaltungspauschale vereinbart ist.'
		);
		expect(text()).toContain(
			'Steht im Mietvertrag ein eigener Satz, gilt dieser. Ohne vereinbarte Verwaltungspauschale enthält die Abrechnung keine.'
		);
	});

	it('berechnet die Verwaltungspauschale aus den eigenen Nebenkosten jedes Mieters und warnt über 3 %', async () => {
		await toSettings();
		expect(text()).toContain('Prozentsatz der eigenen Nebenkosten jedes Mieters');
		fireEvent(byTestId<HTMLInputElement>('management-fee-input')!, 'input', '4.5');
		expect(byTestId('management-fee-hint')).not.toBeNull();
		// persona Dr. Weber P-2 (#124): above 10 % the field refuses the rate; a hint on it would contradict that
		fireEvent(byTestId<HTMLInputElement>('management-fee-input')!, 'input', '12');
		expect(byTestId('management-fee-hint')).toBeNull();
	});

	// Ein geleertes Feld ist kein Satz von 0 %: der Assistent fragt nach, statt still keine Pauschale zu verrechnen
	it('verlangt einen Satz, wenn das Feld der Verwaltungspauschale leer ist, und nimmt ein Komma an', async () => {
		await toSettings();
		const fee = byTestId<HTMLInputElement>('management-fee-input')!;
		fireEvent(fee, 'input', '');
		await next();
		expect(text()).toContain(
			'Bitte geben Sie einen Prozentsatz von 0 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.'
		);
		fireEvent(fee, 'input', '1e2');
		await next();
		expect(text()).toContain(
			'Bitte geben Sie einen Prozentsatz von 0 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.'
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

	// #76: neue Nebenkosten in einem Gebäude mit einem laufenden befristeten Mietvertrag
	it('nennt bei neuen Nebenkosten das Vertragsende eines befristeten Mietvertrags im Gebäude', () => {
		const added = {
			categoryId: 'w',
			categoryName: 'Hauswart',
			kind: 'new',
			current: { count: 1, total: 900 },
			previous: { count: 0, total: 0 },
			missingParts: [],
			changePercent: null
		};
		const check = { buildingId: 'b1', comparedWith: { start: '2023-01-01', end: '2023-12-31' }, hasComparison: true };
		open({
			preview,
			invoices: [{ ...invoices[0], fixedTerm: true, check: { ...check, findings: [added] } }]
		});
		expect(byTestId('category-finding')!.textContent).toContain(
			'Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich'
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

	// #132: der übliche Nachzügler; ohne neue Abrechnung zählen nur die Entwürfe, denen Rechnungen fehlen
	it('nennt bei einer leeren Vorschau die Entwürfe, denen Rechnungen fehlen, nicht die Einstellungen', () => {
		const draft = { id: '1', statementNumber: 'NK-2024-0001', tenantName: 'Nina Brunner', outdated: true, profile: null, profileEdited: 'Winter', fee: { used: 3, now: 4.5, source: 'run' as const } };
		const other = { ...draft, id: '2', outdated: false, profile: { used: 'Winter', run: 'Heizung Mittelland' } };
		open({ preview: [], invoices: [{ ...invoices[0], buildingId: 'b1', statements: 2, changed: [draft, other] }] });

		expect(byTestId('existing-statement-1')!.getAttribute('href')).toBe('/statements/1');
		expect(byTestId('existing-statement-notes-1')!.textContent!.trim()).toBe(
			'Seit dem Erstellen dieses Entwurfs wurden Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht.'
		);
		expect(byTestId('existing-statement-2')).toBeNull();
	});

	// code review C-1 (round 2), persona Dr. Weber P-1: löscht er den Entwurf und erstellt ihn in dieser Periode neu,
	// bleiben die Tage, die der Entwurf abrechnete, ohne Abrechnung
	it('rät bei einer leeren Vorschau mit offenen Tagen nicht, Entwürfe zu löschen', async () => {
		open({
			preview: [],
			invoices: [{ ...invoices[0], buildingId: 'b1', statements: 1, partlyBilled: 1 }]
		});

		const empty = byTestId('preview-empty')!.parentElement!.textContent!.replace(/\s+/g, ' ');
		expect(empty).toContain(
			'Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Mindestens eine dieser Abrechnungen deckt nicht alle Mietstage in dieser Abrechnungsperiode ab. Für die übrigen Mietstage erstellt dieser Lauf keine Abrechnung.'
		);
		expect(empty).not.toContain('löschen Sie ihn');
		expect(document.querySelector('a[href="/statements?building=b1"]')).not.toBeNull();
		next();
		await settle();
		expect(byTestId('form-error')!.textContent!.trim()).toBe(
			'Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude.'
		);
	});

	// #65: ohne Vorjahr kein Hinweis auf Monate ohne Rechnung; eine Rechnung im Jahr kann vollständig sein
	it('weist nicht auf Monate ohne Rechnung am Anfang oder Ende der Periode hin', () => {
		open({
			preview,
			invoices: [{ buildingId: 'b1', count: 2, first: '2024-01-15', last: '2024-03-31' }]
		});
		expect(byTestId('preview-invoices')!.textContent).toContain('Ahornhof');
		expect(document.body.textContent).not.toContain('Teil der Periode');
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

		withFindings([{ ...heating, kind: 'consumption', current: sums(0, -880) }]);
		expect(byTestId('category-finding-stock-link')!.textContent).toContain('Tankbestände prüfen');
		// a hint, no confirmation (#73)
		expect(byTestId('confirm-missing-invoices')).toBeNull();
	});

	// without the year before the frame says nothing about a comparison (fach-review V-4)
	it('nennt einen negativen Verbrauch ohne Vorjahr nicht als Vergleich mit dem Vorjahr', () => {
		open({
			preview,
			invoices: [
				{
					...invoices[0],
					check: {
						buildingId: 'b1',
						comparedWith: { start: '2023-01-01', end: '2023-12-31' },
						hasComparison: false,
						findings: [
							{
								categoryId: 'h',
								categoryName: 'Heizung',
								kind: 'consumption',
								current: { count: 1, total: -300 },
								previous: { count: 0, total: 0 },
								missingParts: [],
								changePercent: null
							}
						]
					}
				}
			]
		});

		const frame = byTestId('category-check')!;
		expect(frame.querySelector('p')!.textContent).toBe('Tankbestände prüfen');
		expect(frame.textContent).not.toContain('Vorjahr');
	});

	// with the year before as well: a Tankbestand hint alone is no comparison «nicht falsch» (persona Anna P-1, V-13)
	it('nennt einen negativen Verbrauch auch mit Vorjahr unter «Tankbestände prüfen»', () => {
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
								kind: 'consumption',
								current: { count: 1, total: -300 },
								previous: { count: 1, total: 4000 },
								missingParts: [],
								changePercent: null
							}
						]
					}
				}
			]
		});

		const frame = byTestId('category-check')!;
		expect(frame.querySelector('p')!.textContent).toBe('Tankbestände prüfen');
		expect(frame.textContent).not.toContain('heisst nicht, dass etwas falsch ist');
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
		// without a tank the landlord records it on the building, and the question stops (#72)
		const noTank = byTestId<HTMLAnchorElement>('tank-question-no-tank-b1')!;
		expect(noTank.getAttribute('href')).toBe('/buildings/b1/edit');
		expect(noTank.textContent).toContain('Kein Tank festhalten');
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
			'Kaltwasser: Die Rechnung für das 2. Halbjahr fehlt. Im Vorjahr: 2 Rechnungen.',
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

	// Ein Leistungszeitraum über die Periode hinaus erklärt tiefere Kosten (#130)
	it('nennt bei einer Abweichung die Rechnungen, die nur teilweise zählen', () => {
		const finding = {
			...completeness.findings[0],
			kind: 'deviation' as const,
			partialCount: 1
		};
		show(CategoryFindingItem, { finding, buildingId: 'b1' });

		expect(byTestId('category-finding')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'1 Rechnung zählt nur teilweise: ihr Leistungszeitraum reicht über die Abrechnungsperiode hinaus.'
		);
	});

	const withInvoices = (
		lists: Partial<Record<'lateInvoices' | 'invoicesWithoutServicePeriod', unknown[]>>
	) =>
		open({
			preview,
			invoices: [
				{
					...invoices[0],
					check: {
						...completeness,
						buildingId: 'b1',
						findings: [],
						lateInvoices: [],
						invoicesWithoutServicePeriod: [],
						...lists
					}
				}
			]
		});

	// Eine Rechnung ohne Leistungszeitraum kurz nach dem Ende zählt zur nächsten Periode (#131)
	it('nennt Rechnungen ohne Leistungszeitraum kurz nach der Abrechnungsperiode, ohne Bestätigung', async () => {
		withInvoices({ lateInvoices: completeness.lateInvoices });
		const hint = byTestId('late-invoices')!;
		const late = completeness.lateInvoices[0];

		expect(hint.textContent!.replace(/\s+/g, ' ')).toContain('Ahornhof');
		expect(byTestId('hinted-invoice')!.textContent!.replace(/\s+/g, ' ')).toContain(
			`${late.billingEntityName}: ${late.description}. Rechnungsdatum 20.01.2026, CHF 290.00`
		);
		expect(hint.querySelector('a')!.getAttribute('href')).toBe(`/invoices/${late.id}/edit`);
		expect(byTestId('confirm-missing-invoices')).toBeNull();
		next();
		await settle();
		expect(heading()).toBe('Erstellen');
	});

	// In einer Periode unter einem Jahr zählt eine Jahresrechnung ohne Leistungszeitraum ganz (#134)
	it('nennt Rechnungen ohne Leistungszeitraum einer kurzen Abrechnungsperiode', () => {
		withInvoices({ invoicesWithoutServicePeriod: completeness.lateInvoices });

		expect(byTestId('invoices-without-service-period')!.textContent).toContain(
			'Die Abrechnungsperiode ist kürzer als ein Jahr.'
		);
		expect(byTestId('late-invoices')).toBeNull();
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

	// A-5 (#114): schon beim Erstellen fällt auf, dass die Abrechnung an die verlassene Wohnung ginge
	it('warnt bei einem ausgezogenen Mieter, der noch die Adresse der Wohnung hat', () => {
		open({
			preview: [{ ...preview[0], tenantName: 'Eva Frei', oldAddress: true }, preview[1]],
			invoices: [invoices[0]]
		});
		const warnings = [...document.querySelectorAll('[data-testid="preview-old-address"]')];
		expect(warnings.map((w) => w.textContent!.replace(/\s+/g, ' ').trim())).toEqual([
			'Eva Frei ist ausgezogen. Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein.'
		]);
	});

	// #251: Mietverträge mit einer Abrechnung erhalten keine neue; das allein ist kein Befund
	it('nennt die schon erstellten Abrechnungen eines Gebäudes, ohne eine Bestätigung zu verlangen', async () => {
		open({
			preview,
			invoices: [
				{ buildingId: 'b1', count: 3, first: '2024-01-15', last: '2024-12-15', statements: 2 }
			]
		});
		expect(byTestId('existing-statements')!.textContent).toContain('Ahornhof');
		expect(byTestId('existing-statements')!.textContent).toContain('2 Nebenkostenabrechnungen');
		expect(byTestId('existing-statements')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Bestehende Abrechnungen bleiben, wie sie sind, auch Entwürfe. Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut.'
		);
		expect(
			byTestId('existing-statements')!.querySelector('a[href="/statements?building=b1"]')
		).not.toBeNull();
		expect(byTestId('confirm-missing-invoices')).toBeNull();
		next();
		await settle();
		expect(heading()).toBe('Erstellen');
	});

	// Fachreview M-1: die Tage, die eine Abrechnung offen lässt, rechnet dieser Lauf nicht ab
	it('verlangt eine Bestätigung, wenn eine Abrechnung nur einen Teil der Periode abdeckt', async () => {
		open({
			preview,
			invoices: [
				{
					buildingId: 'b1',
					count: 3,
					first: '2024-01-15',
					last: '2024-12-15',
					statements: 1,
					partlyBilled: 1
				}
			]
		});
		next();
		await settle();
		expect(byTestId('form-error')!.textContent).toContain('Bestätigen Sie');
		click('confirm-missing-invoices');
		next();
		await settle();
		expect(heading()).toBe('Erstellen');
	});

	// #132: veraltete Entwürfe und Abrechnungen mit anderen Einstellungen, je mit ihrem Link
	const changed = (id: string, more: object) => ({
		id,
		statementNumber: `NK-2024-000${id}`,
		tenantName: 'Nina Brunner',
		outdated: false,
		profile: null,
		profileEdited: null,
		fee: null,
		...more
	});
	const withChanged = (list: ReturnType<typeof changed>[]) =>
		open({ preview, invoices: [{ ...invoices[0], statements: 2, changed: list }] });
	const notesOf = (id: string) => byTestId(`existing-statement-notes-${id}`)!.textContent!.replace(/\s+/g, ' ').trim();
	const sameSettings =
		'Damit alle Abrechnungen dieser Abrechnungsperiode gleich gerechnet sind, wählen Sie im Schritt 3 «Heizprofil und Verwaltungspauschale» dasselbe Heizprofil und denselben Satz wie bei den bestehenden Abrechnungen.';

	it('nennt bestehende Abrechnungen, die veraltet oder anders eingestellt sind, mit ihrem Link', () => {
		withChanged([
			changed('1', { outdated: true }),
			changed('2', { profile: { used: 'Winter', run: 'Heizung Mittelland' }, fee: { used: 3, now: 4.5, source: 'run' } })
		]);

		expect(byTestId('existing-statement-1')!.getAttribute('href')).toBe('/statements/1');
		expect(byTestId('existing-statement-1')!.textContent!.trim()).toBe('NK-2024-0001, Nina Brunner');
		expect(notesOf('1')).toBe(
			'Seit dem Erstellen dieses Entwurfs wurden Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht.'
		);
		expect(notesOf('2')).toBe(
			'Erstellt mit dem Heizprofil «Winter», die neuen Abrechnungen mit «Heizung Mittelland». Erstellt mit 3 % Verwaltungspauschale, die neuen Abrechnungen mit 4.5 %.'
		);
		expect(byTestId('existing-statements')!.textContent!.replace(/\s+/g, ' ')).toContain(sameSettings);
		// Fachreview V-6: a statement named is a warning, also where #251 would only inform
		expect(byTestId('existing-statements')!.className).toContain('border-caution');
	});

	// Fachreview M-1: the contract's own rate or none is no choice of the run; Fachreview V-1: edited since
	it('sagt, woher der heutige Satz kommt, und rät nur zu den Einstellungen, die der Lauf wählt', () => {
		withChanged([
			changed('1', { fee: { used: 3, now: 2.5, source: 'contract' } }),
			changed('2', { fee: { used: 3, now: 0, source: 'none' } }),
			changed('3', { profileEdited: 'Winter' })
		]);

		expect(notesOf('1')).toBe('Erstellt mit 3 % Verwaltungspauschale; im Mietvertrag ist heute ein Satz von 2.5 % vereinbart.');
		expect(notesOf('2')).toBe(
			'Erstellt mit 3 % Verwaltungspauschale; im Mietvertrag ist heute keine Verwaltungspauschale vereinbart.'
		);
		expect(notesOf('3')).toBe(
			'Das Heizprofil «Winter» wurde nach dem Erstellen dieser Abrechnung bearbeitet. Die Abrechnung rechnet mit den Monatsanteilen von damals.'
		);
		expect(byTestId('existing-statements')!.textContent).not.toContain('Damit alle Abrechnungen');
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

	// #439: «Weiter» während der Prüfung der vereinbarten Nebenkosten geht weiter, sobald sie fertig ist
	it('geht nach «Weiter» während der Prüfung weiter, sobald die Mietverträge geprüft sind', async () => {
		let loaded = (_: Response) => {};
		globalThis.fetch = (() => new Promise<Response>((resolve) => (loaded = resolve))) as typeof fetch;
		open();
		next();
		await settle();
		click('generate-building-b1');
		next();
		await settle();

		next();
		await settle();
		expect(heading()).toBe('Heizprofil und Verwaltungspauschale');
		expect(byTestId('agreements-wait')!.textContent).toContain(
			'Dwello geht weiter, sobald die Mietverträge geprüft sind.'
		);

		loaded(new Response('[]', { status: 200 }));
		await settle();
		expect(byTestId('wizard-status')!.textContent).toContain('Vorschau wird berechnet');
		await answer({ type: 'success', data: { preview, invoices } });
		expect(heading()).toBe('Vorschau');
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
		open({ created: ['s1', 's2'] });
		expect(byTestId('generation-result')!.textContent).toContain(
			'2 Nebenkostenabrechnungen sind als Entwurf erstellt'
		);
		expect(byTestId('show-statements-button')!.getAttribute('href')).toBe(
			'/statements?status=draft&periodStart=2024-01-01&periodEnd=2024-12-31'
		);
		expect(byTestId('wizard-next')).toBeNull();
	});

	// the PDFs of this run only, e.g. to print them in one go (#356)
	it('bietet die PDFs der erstellten Entwürfe als eine ZIP-Datei an', () => {
		open({ created: ['s1', 's2'] });
		expect(byTestId('download-zip-button')!.getAttribute('href')).toBe(
			'/statements/zip?ids=s1%2Cs2&periodStart=2024-01-01&periodEnd=2024-12-31'
		);
		expect(byTestId('download-zip-button')!.textContent).toContain('Alle als ZIP herunterladen');
		// not to the page of a statement «zip»: the browser itself follows the link to the file
		expect(byTestId('download-zip-button')!.hasAttribute('data-sveltekit-reload')).toBe(true);
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
		expect(byTestId('save-status')!.textContent).toContain('Noch nicht gespeichert');

		document.body.innerHTML = '';
		open();
		await settle();
		expect(byTestId('draft-restored')).not.toBeNull();
		expect(heading()).toBe('Gebäude'); // in the step it was left in (#201)
		expect(byTestId<HTMLInputElement>('generate-building-b2')!.checked).toBe(true);
		// closed, the notice leaves the focus on the step, not on the page (persona Anna, review of #201)
		click('draft-close');
		await settle();
		expect(document.activeElement).toBe(document.querySelector('h2'));
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

		// the notice asks to check the buildings: the wizard opens their step (code review C-5)
		expect(heading()).toBe('Gebäude');
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

	// Beide Angaben kommen zusammen: eine, die später ankommt, schöbe die Zeilen darunter weg, während der
	// Liegenschaftsverwalter ein Gebäude anklickt (Firefox, #424)
	it('zeigt die Rechnungen eines Gebäudes erst, wenn auch die schon abgerechneten Mietverträge da sind', async () => {
		let releaseBilled = () => {};
		const billedLater = new Promise<void>((resolve) => (releaseBilled = resolve));
		globalThis.fetch = (async (url: string) => {
			if (String(url).includes('/statements/billed')) {
				await billedLater;
				return new Response(JSON.stringify([]), { status: 200 });
			}
			return new Response(JSON.stringify({ invoices: [{ buildingId: 'b1' }], total: 1 }), {
				status: 200
			});
		}) as typeof fetch;
		open();
		await settle();
		next();
		await settle();
		expect(byTestId('generate-building-invoices-b1')).toBeNull();

		releaseBilled();
		await settle();
		expect(byTestId('generate-building-invoices-b1')!.textContent).toContain(
			'1 Rechnung in der Abrechnungsperiode'
		);
	});

	// beide zusammen heisst nicht: beide oder keine (Code-Review 424-2, C-8)
	it('zeigt die Rechnungen eines Gebäudes auch, wenn die abgerechneten Mietverträge nicht geladen werden', async () => {
		fakeBff((call) =>
			call.path.startsWith('/statements/billed')
				? [500]
				: [200, { invoices: [{ buildingId: 'b1' }], total: 1 }]
		);
		open();
		await settle();
		next();
		await settle();
		expect(byTestId('generate-building-invoices-b1')!.textContent).toContain(
			'1 Rechnung in der Abrechnungsperiode'
		);
	});
});

// #89: the run's rate applies only where the contract agrees a Verwaltungspauschale; the others are named with a link
describe('Mietverträge ohne vereinbarte Verwaltungspauschale', () => {
	it('nennt im Schritt «Einstellungen» die Mietverträge ohne vereinbarte Pauschale, je mit Link', async () => {
		const calls = fakeBff((call) =>
			call.path.startsWith('/statements/billed')
				? [
						200,
						[
							{
								buildingId: 'b1',
								contracts: 2,
								billed: 0,
								withoutFee: [{ id: 'c7', tenantName: 'Anna Keller', apartmentNumber: '1.01' }]
							}
						]
					]
				: [200, { invoices: [], total: 0 }]
		);
		open();
		await settle();
		next();
		await settle();
		click('generate-building-b1');
		next();
		await settle();

		const hint = byTestId('management-fee-not-agreed')!;
		expect(hint.textContent).toContain('Ohne vereinbarte Verwaltungspauschale');
		expect(hint.textContent).toContain(
			'Bei diesen Mietverträgen ist keine Verwaltungspauschale vereinbart (Angabe beim Mietvertrag). Ihre Abrechnungen enthalten keine Pauschale (0 %).'
		);
		const link = byTestId('management-fee-not-agreed-link-c7')!;
		expect(link.textContent!.trim()).toBe('Anna Keller, Wohnung 1.01');
		expect(link.getAttribute('href')).toBe('/contracts/c7');
		// asked for the buildings chosen in step 2 only
		expect(calls.filter((c) => c.path.startsWith('/statements/billed')).at(-1)!.path).toContain(
			'buildingIds=b1&'
		);
	});
});

describe('Schon abgerechnete Mietverträge bei der Wahl der Gebäude', () => {
	const billed = (
		rows: { buildingId: string; contracts: number; billed: number; partly?: number }[]
	) =>
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
			'Von 3 Mietverträgen in dieser Abrechnungsperiode haben 2 schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.'
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
			'Alle Mietverträge in dieser Abrechnungsperiode haben schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen. Wenn Sie es wählen, wird dafür nichts erstellt. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.'
		);
		expect(billedText('b2')).toBe(
			'Der einzige Mietvertrag in dieser Abrechnungsperiode hat schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen. Wenn Sie es wählen, wird dafür nichts erstellt. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.'
		);
	});

	// #201: «Alle Gebäude» wählt nur Gebäude, für die eine neue Abrechnung entsteht, und sagt es beim Zähler
	it('lässt bei «Alle Gebäude» die Gebäude aus, deren Mietverträge alle schon eine Abrechnung haben', async () => {
		billed([
			{ buildingId: 'b1', contracts: 2, billed: 2, partly: 0 },
			{ buildingId: 'b2', contracts: 1, billed: 0, partly: 0 }
		]);
		open();
		await settle();
		next();
		await settle();

		expect(byTestId('generate-all-buildings-note')!.textContent!.trim()).toBe(
			'«Alle Gebäude» lässt 1 Gebäude aus, dessen Mietverträge in dieser Abrechnungsperiode alle schon eine Abrechnung haben.'
		);
		click('generate-all-buildings');
		await settle();
		expect(byTestId<HTMLInputElement>('generate-building-b1')!.checked).toBe(false);
		expect(byTestId<HTMLInputElement>('generate-building-b2')!.checked).toBe(true);
		expect(byTestId<HTMLInputElement>('generate-all-buildings')!.checked).toBe(true);
		click('generate-all-buildings');
		await settle();
		expect(byTestId<HTMLInputElement>('generate-building-b2')!.checked).toBe(false);
	});

	// Fachreview M-1: eine Abrechnung, die nur einen Teil der Periode abdeckt, lässt Tage offen
	it('wählt bei «Alle Gebäude» ein Gebäude, dessen Abrechnungen Tage der Periode offen lassen', async () => {
		billed([
			{ buildingId: 'b1', contracts: 2, billed: 2, partly: 1 },
			{ buildingId: 'b2', contracts: 1, billed: 1, partly: 0 }
		]);
		open();
		await settle();
		next();
		await settle();

		click('generate-all-buildings');
		await settle();
		expect(byTestId<HTMLInputElement>('generate-building-b1')!.checked).toBe(true);
		expect(byTestId<HTMLInputElement>('generate-building-b2')!.checked).toBe(false);
	});

	// Fachreview V-9, persona Dr. Weber P-1/P-2: offene Tage sind kein «Sie müssen es nicht wählen», und Löschen
	// und neu Erstellen in dieser Periode rechnete die Tage der bestehenden Abrechnung nicht mehr ab
	it('sagt bei einem Gebäude mit offenen Tagen, dass dieser Lauf sie nicht abrechnet', async () => {
		billed([
			{ buildingId: 'b1', contracts: 2, billed: 2, partly: 1 },
			{ buildingId: 'b2', contracts: 1, billed: 1, partly: 1 }
		]);
		open();
		await settle();
		next();
		await settle();

		const open_ =
			' Mindestens eine dieser Abrechnungen deckt nicht alle Mietstage in dieser Abrechnungsperiode ab. Für die übrigen Mietstage erstellt dieser Lauf keine Abrechnung.';
		expect(billedText('b1')).toBe(
			'Alle Mietverträge in dieser Abrechnungsperiode haben schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt.' +
				open_
		);
		expect(billedText('b2')).toBe(
			'Der einzige Mietvertrag in dieser Abrechnungsperiode hat schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt.' +
				open_
		);
	});

	it('lässt den Rat zum Neuberechnen weg, wenn bei einigen Mietverträgen Tage offen bleiben', async () => {
		billed([{ buildingId: 'b1', contracts: 3, billed: 2, partly: 1 }]);
		open();
		await settle();
		next();
		await settle();

		expect(billedText('b1')).toBe(
			'Von 3 Mietverträgen in dieser Abrechnungsperiode haben 2 schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt. Mindestens eine dieser Abrechnungen deckt nicht alle Mietstage in dieser Abrechnungsperiode ab. Für die übrigen Mietstage erstellt dieser Lauf keine Abrechnung.'
		);
	});

	it('nennt beim Zähler mehrere ausgelassene Gebäude in der Mehrzahl', async () => {
		billed([
			{ buildingId: 'b1', contracts: 2, billed: 2, partly: 0 },
			{ buildingId: 'b2', contracts: 1, billed: 1, partly: 0 }
		]);
		open();
		await settle();
		next();
		await settle();

		expect(byTestId('generate-all-buildings-note')!.textContent!.trim()).toBe(
			'«Alle Gebäude» lässt 2 Gebäude aus, deren Mietverträge in dieser Abrechnungsperiode alle schon eine Abrechnung haben.'
		);
		// nothing to choose: the box stays empty, as the counter says (code review C-1)
		click('generate-all-buildings');
		await settle();
		expect(byTestId<HTMLInputElement>('generate-all-buildings')!.checked).toBe(false);
		expect(text()).toContain('0 von 2 gewählt');
	});

	it('nennt einen einzelnen abgerechneten Mietvertrag in der Einzahl', async () => {
		billed([{ buildingId: 'b1', contracts: 2, billed: 1 }]);
		open();
		await settle();
		next();
		await settle();

		expect(billedText('b1')).toBe(
			'Von 2 Mietverträgen in dieser Abrechnungsperiode hat 1 schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.'
		);
	});
});
