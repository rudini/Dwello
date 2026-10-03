import { describe, it, expect, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));

import GeneratePage from '../routes/statements/generate/+page.svelte';
import EditStatementPage from '../routes/statements/[id]/edit/+page.svelte';
import { byTestId, click, fireEvent, show } from './helpers/dom';
import { statement } from './helpers/statement';

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
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
		{ id: 'b1', name: 'Ahornhof', address: 'Ahornweg 3', postalCode: '8400', city: 'Winterthur', apartmentCount: 4 },
		{ id: 'b2', name: 'Lindenhof', address: 'Lindenweg 1', postalCode: '8400', city: 'Winterthur', apartmentCount: 2 }
	],
	heatingProfiles: [profile('hp0', 'Unvollständig', 5), { ...profile('hp1', 'Gleichmässig', 0), monthlyPercentages: { ...profile('', '', 8).monthlyPercentages, january: 12 } }],
	defaultManagementFeePercent: 3,
	defaultHeatingProfileId: '',
	defaultPeriod: { start: '2024-01-01', end: '2024-12-31' }
};
const text = () => document.body.textContent ?? '';
const next = () => byTestId<HTMLButtonElement>('wizard-next');

describe('Abrechnungen erstellen', () => {
	it('wählt das erste vollständige Heizprofil vor und sperrt unvollständige', () => {
		show(GeneratePage, { data, form: null } as never);

		expect(byTestId<HTMLSelectElement>('heating-profile-select')!.value).toBe('hp1');
		expect(byTestId<HTMLOptionElement>('heating-profile-option-hp0')!.disabled).toBe(true);
		expect(byTestId('heating-profile-option-hp0')!.textContent).toContain('(60%) - nicht wählbar');
		expect(text()).toContain('Gleichmässig Verteilung');
	});

	it('verlangt eine Periode und mindestens ein Gebäude, bevor es weitergeht', () => {
		show(GeneratePage, { data, form: null } as never);

		fireEvent(byTestId<HTMLInputElement>('period-start-input')!, 'input', '');
		expect(next()!.disabled).toBe(true);
		fireEvent(byTestId<HTMLInputElement>('period-start-input')!, 'input', '2024-01-01');
		click('wizard-next');

		expect(text()).toContain('Schritt 2 von 4');
		expect(next()!.disabled).toBe(true);
		click('generate-building-b1');
		expect(text()).toContain('1 von 2 ausgewählt');
		expect(next()!.disabled).toBe(false);
	});

	it('wählt alle Gebäude aus und wieder ab', () => {
		show(GeneratePage, { data, form: null } as never);
		click('wizard-next');

		const all = document.querySelector<HTMLInputElement>('input[type="checkbox"]:not([data-testid])')!;
		click(all);
		expect(text()).toContain('2 von 2 ausgewählt');
		click(all);
		expect(text()).toContain('0 von 2 ausgewählt');
	});

	it('zeigt die Vorschau des Servers mit Summe pro Mietvertrag', () => {
		const preview = [
			{ contractId: 'c1', tenantName: 'Anna Keller', apartmentNumber: '2.01', totalCosts: 1200, balance: 150 },
			{ contractId: 'c2', tenantName: 'Marc Huber', apartmentNumber: '2.02', totalCosts: 800, balance: -50 }
		];
		show(GeneratePage, { data, form: { preview } } as never);

		expect(text()).toContain('Schritt 3 von 4');
		expect(byTestId('preview-count')!.textContent!.trim()).toBe('2');
		expect(text()).toContain('Anna Keller');
		expect(text()).toContain('2024 (1.1.2024 - 31.12.2024)');
	});

	it('meldet eine Periode ohne Mietverträge', () => {
		show(GeneratePage, { data, form: { preview: [] } } as never);
		expect(byTestId('preview-empty')).not.toBeNull();
	});

	it('meldet einen Fehler des Servers', () => {
		show(GeneratePage, { data, form: { error: 'Periode ungültig' } } as never);
		expect(text()).toContain('Periode ungültig');
	});

	it('geht von der Vorschau zum Erstellen, wo die Abrechnungen erzeugt werden', () => {
		const preview = [{ contractId: 'c1', tenantName: 'Anna Keller', apartmentNumber: '2.01', totalCosts: 1200, balance: 150 }];
		show(GeneratePage, { data, form: { preview } } as never);

		click('wizard-next');
		expect(text()).toContain('Schritt 4 von 4');
		expect(byTestId('generate-statements-button')).not.toBeNull();
		expect(next()).toBeNull();
	});
});

describe('Abrechnung bearbeiten', () => {
	it('füllt Zahlungsfrist und Bemerkung und zeigt die berechneten Kosten nur an', () => {
		show(EditStatementPage, { data: { statement: statement({ notes: 'Ratenzahlung' }) }, form: null } as never);

		expect(byTestId<HTMLInputElement>('payment-deadline-input')!.value).toBe('2025-02-28');
		expect(byTestId<HTMLTextAreaElement>('statement-notes-input')!.value).toBe('Ratenzahlung');
		expect(text()).toContain('Heizung');
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/statements/s1');
	});

	it('meldet einen Fehler beim Speichern', () => {
		show(EditStatementPage, { data: { statement: statement() }, form: { errors: { form: 'Speichern fehlgeschlagen' } } } as never);
		expect(text()).toContain('Speichern fehlgeschlagen');
	});
});
