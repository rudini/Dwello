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
					{
						id: 'hp1',
						name: 'Even',
						nameDE: 'Gleichmässig',
						monthlyPercentages: { ...months(8), january: 12 }
					},
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
			settingsPage({
				errors: {
					iban: 'Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein'
				}
			})
		).toContain('Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein');
	});

	it('bestätigt das Speichern und nennt, was gespeichert ist', () => {
		const saved = settingsPage({ saved: true });
		expect(saved).toContain('data-testid="settings-saved"');
		expect(saved).toContain('Absender, Verwaltungspauschale und Vorschläge gespeichert');
		expect(settingsPage()).not.toContain('data-testid="settings-saved"');
	});

	it('erklärt die Begriffe in Alltagssprache', () => {
		const body = settingsPage().replace(/\s+/g, ' ');

		expect(body).toContain('Zeitraum, für den Sie die Nebenkosten abrechnen');
		expect(body).toContain(
			'Abgeltung Ihres Aufwands für die Nebenkosten: ein Prozentsatz der eigenen Nebenkosten jedes Mieters, für dessen Mietvertrag eine Verwaltungspauschale vereinbart ist. Üblich sind bis 3 %; ein höherer Satz muss Ihrem tatsächlichen Aufwand entsprechen. Dwello nimmt höchstens 10 % an.'
		);
		expect(body).toContain('Verteilt die Heizkosten in Prozent auf die 12 Monate');
		expect(body).toContain('wie die Kosten eines Gebäudes auf die einzelnen Wohnungen');
	});

	it('führt zu den Stammdaten unter den Namen der Hauptnavigation', () => {
		const body = settingsPage();

		for (const [href, label] of [
			['/config/categories', 'Kategorien'],
			['/config/distribution-keys', 'Verteilschlüssel'],
			['/config/heating-profiles', 'Heizprofile']
		]) {
			expect(body).toMatch(new RegExp(`<a href="${href}"[^>]*>${label}</a>`));
		}
	});
});

// The values of the checked choices «umlagefähig» ('true') and «nicht umlagefähig» ('false')
const chosenAllowance = (body: string) =>
	(body.match(/<input[^>]*name="isAllowedUtilityCost"[^>]*>/g) ?? [])
		.filter((radio) => / checked/.test(radio))
		.map((radio) => radio.match(/value="(\w+)"/)![1]);

describe('Kategorie erfassen und bearbeiten', () => {
	// Eine Kategorie ist nie umlagefähig, nur weil niemand hingeschaut hat (#176)
	it('beginnt eine neue Kategorie ohne Wahl der Umlagefähigkeit', () => {
		const body = render(NewCategoryPage, { props: { form: null } as never }).body;

		expect(chosenAllowance(body)).toEqual([]);
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
		expect(chosenAllowance(body)).toEqual(['false']);
		expect(body).toContain('Name ist schon vergeben');
	});
});
