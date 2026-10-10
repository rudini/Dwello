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
		balance: 150
	},
	{
		contractId: 'c2',
		tenantName: 'Marc Huber',
		apartmentNumber: '2.02',
		totalCosts: 800,
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
		expect(byTestId<HTMLInputElement>('period-start-input')!.value).toBe('2024-01-01');
		expect(text()).toContain('Montag, 1. Januar 2024');
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

	it('verteilt die Verwaltungspauschale gleichmässig oder nach einem Verteilschlüssel und warnt über 3 %', async () => {
		await toSettings();
		const key = byTestId<HTMLSelectElement>('management-fee-key-select')!;
		expect([...key.options].map((o) => [o.value, o.textContent?.trim()])).toEqual([
			['', 'Gleichmässig pro Wohnung'],
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
		expect(rows[0]).toContain('3 Rechnungen vom 15.1.2024 bis 30.6.2024');
		expect(rows[1]).toContain('Keine Rechnungen erfasst');
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
		expect(byTestId('preview-empty')).not.toBeNull();
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

	it('warnt, wenn es für ein Gebäude in der Periode schon Abrechnungen gibt, und verlangt eine Bestätigung', async () => {
		open({
			preview,
			invoices: [
				{ buildingId: 'b1', count: 3, first: '2024-01-15', last: '2024-12-15', statements: 2 }
			]
		});
		expect(byTestId('existing-statements')!.textContent).toContain('Ahornhof');
		expect(byTestId('existing-statements')!.textContent).toContain('2 Nebenkostenabrechnungen');
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
	});
});

describe('Abrechnung bearbeiten', () => {
	it('füllt Zahlungsfrist und Bemerkung und zeigt die berechneten Kosten nur an', () => {
		show(EditStatementPage, {
			data: { statement: statement({ notes: 'Ratenzahlung' }) },
			form: null
		} as never);

		expect(byTestId<HTMLInputElement>('payment-deadline-input')!.value).toBe('2025-02-28');
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
		const calls = fakeBff((call) => [
			200,
			call.path.includes('buildingId=b2') ? { invoices: [], total: 0 } : { invoices: [], total: 3 }
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
		expect(calls[0].path).toMatch(/dateFrom=\d{4}-\d{2}-\d{2}&dateTo=\d{4}-\d{2}-\d{2}/);
	});
});
