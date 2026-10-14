import { describe, it, expect } from 'vitest';
import PrivacyPage from '../routes/privacy/+page.svelte';
import { byTestId, show } from './helpers/dom';

describe('Datenschutzerklärung zur KI-Kategorisierung', () => {
	it('sagt, dass Rechnungsdaten den Server nicht verlassen, wenn das Modell beim Betreiber läuft', () => {
		show(PrivacyPage, { data: { recipient: null } } as never);

		expect(byTestId('llm-recipient')?.textContent).toContain('verlassen dafür den Server nicht');
	});

	it('nennt Anbieter, Land und die übermittelten Angaben eines externen Anbieters (DSG Art. 19)', () => {
		show(PrivacyPage, {
			data: { recipient: { provider: 'Beispiel AG', country: 'Schweiz' } }
		} as never);

		const notice = byTestId('llm-recipient')?.textContent;
		expect(notice).toContain('Beispiel AG (Schweiz)');
		expect(notice).toContain('Rechnungssteller (auch Einzelpersonen), Beschreibung und Betrag');
		expect(notice).not.toContain('verlassen dafür den Server nicht');
	});
});

describe('Datenschutzerklärung zu Entwürfen im Browser', () => {
	it('sagt, dass ungespeicherte Eingaben der geführten Abläufe bis zum Speichern, Verwerfen oder Abmelden im Browser bleiben', () => {
		show(PrivacyPage, { data: { recipient: null } } as never);

		const draft = byTestId('draft-notice')?.textContent;
		expect(draft).toContain('«Mietvertrag erfassen» und «Abrechnungen erstellen»');
		expect(draft).toContain('als Entwurf in diesem Browser');
		expect(draft).toContain('bis Sie sie speichern, verwerfen oder sich abmelden');
	});
});

describe('Datenschutzerklärung der öffentlichen Demo', () => {
	const demoSection = () =>
		[...document.querySelectorAll('[data-testid="page-section"]')].find((section) =>
			section.querySelector('h2')?.textContent?.includes('Öffentliche Demo')
		);

	it('sagt, dass alle dieselben Daten sehen, alles jede Nacht gelöscht wird und andere Besucher Name und E-Mail nicht sehen', () => {
		show(PrivacyPage, { data: { recipient: null, demo: true } } as never);

		const text = demoSection()?.textContent;
		expect(text).toContain('sehen und ändern dieselben Daten');
		expect(text).toContain('jede Nacht werden alle Änderungen gelöscht');
		expect(text).toContain(
			'Ihren Namen und Ihre E-Mail-Adresse sehen andere Besucher nicht, nur der Betreiber im Protokoll des Servers'
		);
	});

	it('hat in einer eigenen Installation keinen Abschnitt zur Demo', () => {
		show(PrivacyPage, { data: { recipient: null, demo: false } } as never);

		expect(document.querySelectorAll('[data-testid="page-section"]').length).toBeGreaterThan(0);
		expect(demoSection()).toBeUndefined();
	});
});

describe('Datenschutzerklärung zur Anmeldung', () => {
	it('sagt, dass jede Anmeldung und jede Verlängerung der Sitzung mit der E-Mail-Adresse protokolliert wird', () => {
		show(PrivacyPage, { data: { recipient: null, demo: false } } as never);

		const login = [...document.querySelectorAll('[data-testid="page-section"]')].find((section) =>
			section.querySelector('h2')?.textContent?.includes('Anmeldung')
		);
		expect(login?.textContent).toContain(
			'Jede Anmeldung und jede Verlängerung der Sitzung (etwa alle 50 Minuten, solange Dwello offen ist) wird mit der E-Mail-Adresse im Protokoll des Servers festgehalten'
		);
		expect(login?.textContent).not.toContain('verwendet sie nur');
	});
});
