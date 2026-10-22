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
	companyPhone: '044 123 45 67',
	companyEmail: 'info@muster.ch',
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

	// #465 (DMR-09, Fachreview 465-1 V-3): Telefon und E-Mail stehen nur im Kopf der Nebenkostenabrechnung
	it('bietet Telefon und E-Mail der Verwaltung an und sagt, wo sie stehen', () => {
		const body = settingsPage().replace(/\s+/g, ' ');

		expect(body).toContain('value="044 123 45 67"');
		// code review 465-1 C-4: the keypad of a phone number and of an e-mail, as in the tenant form
		expect(body).toMatch(/inputmode="tel"[^>]*name="companyPhone"|name="companyPhone"[^>]*inputmode="tel"/);
		expect(body).toMatch(/inputmode="email"[^>]*name="companyEmail"|name="companyEmail"[^>]*inputmode="email"/);
		expect(body).toContain('value="info@muster.ch"');
		expect(body).toContain('Freiwillig. Steht im Kopf der Nebenkostenabrechnung, damit Ihre Mieter Sie bei Fragen erreichen.');
		expect(body).toContain('Freiwillig. Steht im Kopf der Nebenkostenabrechnung, damit Ihre Mieter Ihnen schreiben können.');
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
					iban: 'Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein.'
				}
			})
		).toContain('Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein.');
	});

	// Persona Helga P-2 (#450): the message stays at the IBAN, the empty fields it names are marked; the focus goes to
	// the first invalid field, so to the first empty one
	it('kennzeichnet bei einer IBAN ohne Firmenadresse die leeren Felder', () => {
		const body = settingsPage({
			errors: { iban: 'Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort.' },
			missing: ['companyName', 'companyCity']
		});
		const inputOf = (name: string) => body.match(new RegExp(`<input[^>]*name="${name}"[^>]*>`))?.[0] ?? '';

		for (const name of ['companyName', 'companyCity']) {
			expect(inputOf(name)).toContain('aria-invalid="true"');
			expect(inputOf(name)).toContain('iban-error');
		}
		expect(inputOf('companyPostalCode')).not.toContain('aria-invalid');
	});

	it('bestätigt das Speichern und nennt, was gespeichert ist', () => {
		const saved = settingsPage({ saved: true });
		expect(saved).toContain('data-testid="settings-saved"');
		expect(saved).toContain('Absender, Verwaltungspauschale, Fristen und Vorschläge gespeichert');
		expect(settingsPage()).not.toContain('data-testid="settings-saved"');
	});

	it('erklärt die Begriffe in Alltagssprache', () => {
		const body = settingsPage().replace(/\s+/g, ' ');

		expect(body).toContain('Zeitraum, für den Sie die Nebenkosten abrechnen');
		expect(body).toContain(
			'Abgeltung Ihres Aufwands für die Nebenkosten: ein Prozentsatz der eigenen Nebenkosten jedes Mieters, für dessen Mietvertrag eine Verwaltungspauschale vereinbart ist. Üblich sind bis 3 %; ein höherer Satz muss Ihrem tatsächlichen Aufwand entsprechen (Art. 4 Absatz 3 VMWG). Dwello nimmt höchstens 10 % an.'
		);
		expect(body).toContain('Verteilt die Heizkosten in Prozent auf die 12 Monate');
		expect(body).toContain('wie die Kosten eines Gebäudes auf die einzelnen Wohnungen');
		// Fachreview #69 (V-7, V-10, V-12)
		for (const said of [
			'Eine Rückerstattung überweisen Sie selbst bis zur Zahlungsfrist auf das Konto des Mieters; die Abrechnung bittet ihn, Ihnen seine IBAN mitzuteilen.',
			'zum Beispiel Kalenderjahr (01.01.–31.12.)',
			// Fachreview 452-2 V-20: the latest invoice of the category in the building comes first (#379)
			'Dwello schlägt den hier gewählten Verteilschlüssel beim Erfassen einer Rechnung vor, wenn im Gebäude noch keine Rechnung derselben Kategorie einen hat.',
			'Mit einer IBAN braucht es Firmenname, PLZ und Ort.' // #490
		])
			expect(body).toContain(said);
		expect(body).not.toContain('z. B.');
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

	// Personas on #357 (Anna P-1, Helga P-3, Marco P-2): at the end of the long form nobody found it
	it('führt gleich nach den Stammdaten zum Protokoll, vor dem Formular', () => {
		const body = settingsPage();

		const protokoll = body.search(/<a href="\/config\/audit-log"[^>]*>Protokoll<\/a>/);
		expect(protokoll).toBeGreaterThan(body.indexOf('href="/config/heating-profiles"'));
		expect(protokoll).toBeLessThan(body.indexOf('<form'));
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
		const body = render(NewCategoryPage, {
			props: { data: { kiEnabled: true }, form: null } as never
		}).body;

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
