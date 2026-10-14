import { describe, it, expect } from 'vitest';
import PrivacyPage from '../routes/privacy/+page.svelte';
import { byTestId, show } from './helpers/dom';

describe('Datenschutzerklärung zur KI-Kategorisierung', () => {
	it('sagt, dass Rechnungsdaten den Server nicht verlassen, wenn das Modell beim Betreiber läuft', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);

		expect(byTestId('llm-recipient')?.textContent).toContain('verlassen dafür den Server nicht');
	});

	it('nennt Anbieter, Land und die übermittelten Angaben eines externen Anbieters (DSG Art. 19)', () => {
		show(PrivacyPage, {
			data: { recipient: { provider: 'Beispiel AG', country: 'Schweiz' }, providers: ['Google'] }
		} as never);

		const notice = byTestId('llm-recipient')?.textContent;
		expect(notice).toContain('Beispiel AG (Schweiz)');
		expect(notice).toContain('Rechnungssteller (auch Einzelpersonen), Beschreibung und Betrag');
		expect(notice).not.toContain('verlassen dafür den Server nicht');
	});
});

describe('Datenschutzerklärung zu Entwürfen im Browser', () => {
	it('sagt, dass ungespeicherte Eingaben der geführten Abläufe bis zum Speichern, Verwerfen oder Abmelden im Browser bleiben', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);

		const draft = byTestId('draft-notice')?.textContent;
		expect(draft).toContain('«Mietvertrag erfassen» und «Abrechnungen erstellen»');
		expect(draft).toContain('als Entwurf in diesem Browser');
		expect(draft).toContain('bis Sie sie speichern, verwerfen oder sich abmelden');
	});
});

describe('Datenschutzerklärung zu Anmeldung, Dritten und Cookies', () => {
	const page = (providers: string[]) => {
		show(PrivacyPage, { data: { recipient: null, providers } } as never);
		return document.body.textContent ?? '';
	};

	it('nennt nur die eingerichteten Anmeldeanbieter', () => {
		expect(page(['Google'])).toContain('Die Anmeldung erfolgt über Google.');
		expect(page(['Google'])).not.toContain('Microsoft');
		expect(page(['Google', 'Microsoft'])).toContain(
			'Die Anmeldung erfolgt über Google oder Microsoft.'
		);
	});

	it('nennt die Kartenkacheln von CARTO und die Adresssuche von OpenPLZ, aber kein Google Fonts', () => {
		const text = page(['Google']);
		expect(text).toContain('CARTO');
		expect(text).toContain('OpenPLZ');
		expect(text).not.toContain('Google Fonts');
	});

	it('nennt jedes Cookie, das Dwello setzt', () => {
		const text = page(['Google']);
		for (const cookie of [
			'dwello_session',
			'dwello_xsrf',
			'dwello_oauth_state',
			'dwello_login',
			'PARAGLIDE_LOCALE'
		]) {
			expect(text).toContain(cookie);
		}
	});
});

describe('Datenschutzerklärung: Grenzen der genannten Dienste', () => {
	const text = () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);
		return document.body.textContent ?? '';
	};

	it('nennt die Adresssuche nur beim Erfassen eines Gebäudes, wo es sie gibt', () => {
		expect(text()).toContain('Die Adresssuche beim Erfassen eines Gebäudes');
		expect(text()).not.toContain('Bearbeiten eines Gebäudes');
	});

	it('nennt Google Maps beim Planen einer Route und keine Weitergabe ausser den genannten', () => {
		expect(text()).toContain('Google Maps');
		expect(text()).not.toContain('Darüber hinaus gibt Dwello keine Daten an Dritte weiter.');
	});

	it('sagt nicht, das Sprach-Cookie entstehe erst mit einer Wahl', () => {
		expect(text()).toContain('«PARAGLIDE_LOCALE» speichert die Sprache der Oberfläche');
	});
});
