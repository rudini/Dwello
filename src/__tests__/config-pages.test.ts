import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import SettingsPage from '../routes/config/+page.svelte';
import NewCategoryPage from '../routes/config/categories/new/+page.svelte';
import EditCategoryPage from '../routes/config/categories/[id]/edit/+page.svelte';
import type { Settings } from '$lib/server/settings';

const settings: Settings = {
	companyName: 'Muster Immobilien AG',
	companyAddress: 'Bahnhofstrasse 1',
	companyPostalCode: '8001',
	companyCity: 'Zürich',
	iban: 'CH93 0076 2011 6238 5295 7',
	managementFeePercent: '3',
	accountingPeriod: 'july-june',
	defaultHeatingProfileId: 'hp1',
	defaultDistributionKeyId: 'dk1'
} as Settings;

const months = (pct: number) =>
	Object.fromEntries(
		[
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
		].map((m) => [m, pct])
	);

const settingsPage = (form: object | null = null) =>
	render(SettingsPage, {
		props: {
			data: {
				settings,
				heatingProfiles: [
					{ id: 'hp1', name: 'Gleichmässig', monthlyPercentages: { ...months(8), january: 12 } },
					{ id: 'hp2', name: 'Unvollständig', monthlyPercentages: months(5) }
				],
				distributionKeys: [{ id: 'dk1', name: 'Nach Fläche' }]
			},
			form
		} as never
	}).body;

describe('Einstellungen', () => {
	it('zeigt den gespeicherten Absender', () => {
		const body = settingsPage();

		expect(body).toContain('value="Muster Immobilien AG"');
		expect(body).toContain('value="CH93 0076 2011 6238 5295 7"');
	});

	it('bietet nur Heizprofile mit genau 100 % als Standard an', () => {
		const body = settingsPage();

		expect(body).toMatch(/<option value="hp1"[^>]*>Gleichmässig \(100%\)/);
		expect(body).toMatch(/<option value="hp2" disabled[^>]*>Unvollständig \(60%\)/);
	});

	it('bietet die Verteilschlüssel und Abrechnungsperioden zur Auswahl an', () => {
		const body = settingsPage();

		expect(body).toContain('Nach Fläche');
		expect(body).toContain('Juli – Juni');
	});

	it('meldet Fehler pro Feld', () => {
		expect(
			settingsPage({ errors: { iban: 'Bitte geben Sie eine gültige Schweizer IBAN ein' } })
		).toContain('Bitte geben Sie eine gültige Schweizer IBAN ein');
	});

	it('bestätigt das Speichern', () => {
		expect(settingsPage({ saved: true })).toContain('data-testid="settings-saved"');
		expect(settingsPage()).not.toContain('data-testid="settings-saved"');
	});
});

// The whole <input> tag of the checkbox, whatever the order of its attributes
const checkbox = (body: string) =>
	body.match(/<input[^>]*data-testid="category-allowed-checkbox"[^>]*>/)![0];

describe('Kategorie erfassen und bearbeiten', () => {
	it('beginnt eine neue Kategorie als umlagefähig', () => {
		const body = render(NewCategoryPage, { props: { form: null } as never }).body;

		expect(checkbox(body)).toContain('checked');
		expect(body).toContain('Kategorie speichern');
	});

	it('füllt beim Bearbeiten alle Felder samt Übersetzungen', () => {
		const category = {
			id: 'c1',
			name: 'Hauswartung',
			nameFR: 'Conciergerie',
			description: 'Reinigung und Unterhalt',
			sortOrder: 4,
			isAllowedUtilityCost: false
		};
		const body = render(EditCategoryPage, {
			props: { data: { category }, form: { errors: { name: 'Name ist schon vergeben' } } } as never
		}).body;

		expect(body).toContain('value="Hauswartung"');
		expect(body).toContain('value="Conciergerie"');
		expect(body).toContain('value="4"');
		expect(checkbox(body)).not.toContain('checked');
		expect(body).toContain('Name ist schon vergeben');
	});
});
