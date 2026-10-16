import { describe, it, expect } from 'vitest';
import PrivacyPage from '../routes/privacy/+page.svelte';
import { byTestId, show } from './helpers/dom';
import de from '../../messages/de.json';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import italian from '../../messages/it.json';

describe('Datenschutzerklärung zur KI-Kategorisierung', () => {
	it('sagt, dass Rechnungsdaten den Server nicht verlassen, wenn das Modell beim Betreiber läuft', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);

		expect(byTestId('llm-recipient')?.textContent).toContain('verlassen dafür den Server nicht');
	});

	it('sagt bei abgeschalteter KI, dass keine KI Rechnungen oder Kategorien bearbeitet (#216)', () => {
		show(PrivacyPage, { data: { recipient: null, enabled: false, providers: ['Google'] } } as never);

		const notice = byTestId('llm-recipient')?.textContent;
		expect(notice).toBe('Rechnungen und Kategorien werden nicht von einer KI bearbeitet.');
	});

	// one word for one thing: the dialog says «KI», so does the privacy statement, in every language (persona Dr. Weber)
	it('spricht in jeder Sprache und jeder Variante von der KI, nicht von einem Sprachmodell', () => {
		for (const messages of [de, fr, italian, en])
			for (const key of ['privacy_llm_external', 'privacy_llm_local', 'privacy_llm_off'] as const)
				expect(messages[key]).not.toMatch(/Sprachmodell|modèle de langage|modello linguistico|language model/);
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

	// #176: «Von der KI prüfen lassen» sendet Name und Beschreibung einer neuen Kategorie
	it('nennt auch Name und Beschreibung einer neuen Kategorie, die die KI prüft', () => {
		show(PrivacyPage, {
			data: { recipient: { provider: 'Beispiel AG', country: 'Schweiz' }, providers: ['Google'] }
		} as never);

		expect(byTestId('llm-recipient')?.textContent).toContain('Name und Beschreibung der Kategorie');
		expect(byTestId('llm-recipient')?.textContent).toContain('damit die KI vorschlägt, ob ihre Kosten umlagefähig sind');
	});

	// #217: «Rechnungen hochladen» schickt jede gewählte Datei sofort an die KI, auch wenn danach abgebrochen wird
	it('nennt hochgeladene Rechnungsdateien mit Dateiname, auch nach einem Abbruch, und ihren Inhalt', () => {
		show(PrivacyPage, {
			data: { recipient: { provider: 'Beispiel AG', country: 'Schweiz' }, providers: ['Google'] }
		} as never);

		const notice = byTestId('llm-recipient')?.textContent;
		expect(notice).toContain('wird jede sofort mit ihrem Dateinamen übermittelt (von PDF-Dateien höchstens die ersten drei Seiten, als Bilder)');
		expect(notice).toContain('auch wenn Sie das Hochladen danach abbrechen');
		expect(notice).toContain('auch Namen und Adressen');
	});

	it('sagt, dass auch hochgeladene Rechnungsdateien beim Betreiber ausgelesen werden, wenn das Modell dort läuft', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);

		expect(byTestId('llm-recipient')?.textContent).toContain('hochgeladene Rechnungsdateien liest sie aus');
	});

	it('nennt die gespeicherten Belege, ihren Zweck und wie lange sie bleiben', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);

		expect(document.body.textContent).toContain(
			'Die Belege (hochgeladene Dateien der Rechnungen mit allem, was auf ihnen steht, etwa Namen, Adressen und Beträge) erleichtern die Belegeinsicht der Mieter und bleiben gespeichert, bis Sie den Beleg ersetzen oder die Rechnung löschen.'
		);
	});

	// Seit #176 bietet jede Kategorisierung einer Rechnung der KI alle Kategorien an (F-12)
	it('nennt Name und Beschreibung aller Kategorien bei der Kategorisierung einer Rechnung', () => {
		show(PrivacyPage, {
			data: { recipient: { provider: 'Beispiel AG', country: 'Schweiz' }, providers: ['Google'] }
		} as never);

		expect(byTestId('llm-recipient')?.textContent).toContain('Name und Beschreibung aller Kategorien');
	});

	it('sagt, dass auch neue Kategorien den Server nicht verlassen, wenn das Modell beim Betreiber läuft', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);

		expect(byTestId('llm-recipient')?.textContent).toContain('neue Kategorien');
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

describe('Datenschutzerklärung der öffentlichen Demo', () => {
	const demoSection = () =>
		[...document.querySelectorAll('[data-testid="page-section"]')].find((section) =>
			section.querySelector('h2')?.textContent?.includes('Öffentliche Demo')
		);

	it('sagt, dass alle dieselben Daten sehen, alles jede Nacht gelöscht wird und andere Besucher Name und E-Mail nicht sehen', () => {
		show(PrivacyPage, { data: { recipient: null, demo: true, providers: ['Google'] } } as never);

		const text = demoSection()?.textContent;
		expect(text).toContain('sehen und ändern dieselben Daten');
		expect(text).toContain('jede Nacht werden alle Änderungen gelöscht');
		expect(text).toContain(
			'Ihren Namen und Ihre E-Mail-Adresse sehen andere Besucher nicht, nur der Betreiber im Protokoll des Servers'
		);
	});

	it('hat in einer eigenen Installation keinen Abschnitt zur Demo', () => {
		show(PrivacyPage, { data: { recipient: null, demo: false, providers: ['Google'] } } as never);

		expect(document.querySelectorAll('[data-testid="page-section"]').length).toBeGreaterThan(0);
		expect(demoSection()).toBeUndefined();
	});
});

describe('Datenschutzerklärung zur Anmeldung', () => {
	it('sagt, dass jede Anmeldung und jede Verlängerung der Sitzung mit der E-Mail-Adresse protokolliert wird', () => {
		show(PrivacyPage, { data: { recipient: null, demo: false, providers: ['Google'] } } as never);

		const login = [...document.querySelectorAll('[data-testid="page-section"]')].find((section) =>
			section.querySelector('h2')?.textContent?.includes('Anmeldung')
		);
		expect(login?.textContent).toContain(
			'Jede Anmeldung und jede Verlängerung der Sitzung (etwa alle 50 Minuten, solange Dwello offen ist) wird mit der E-Mail-Adresse im Protokoll des Servers festgehalten'
		);
		expect(login?.textContent).not.toContain('verwendet sie nur');
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
		expect(text()).toContain(
			'Google erhält die Adresse und die IP-Adresse des Browsers erst, wenn Sie den Link wählen.'
		);
		expect(text()).not.toContain('Darüber hinaus gibt Dwello keine Daten an Dritte weiter.');
		expect(text()).toContain(
			'Ausser den hier und unter «Anmeldung» genannten Diensten erhält niemand Daten von Dwello.'
		);
	});

	it('sagt nicht, das Sprach-Cookie entstehe erst mit einer Wahl', () => {
		expect(text()).toContain('«PARAGLIDE_LOCALE» speichert die Sprache der Oberfläche');
	});
});
