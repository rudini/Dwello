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
		// #57: «Entwurf» is only the statement status; why, until when (Fachprüfung #57, R-1, R-2) and what (R-3)
		expect(draft).not.toContain('Entwurf');
		expect(draft).toContain('nur in diesem Browser auf, damit Sie später weitermachen können');
		expect(draft).toContain(
			'bis Sie den Mietvertrag speichern oder die Abrechnungen erstellen, Ihre Angaben verwerfen oder sich mit «Abmelden» abmelden'
		);
		expect(draft).toContain('Beträge, Daten und die Auswahl von Mieter und Wohnung');
		// a session that only expires leaves the input (review W9c-1, R-10)
		expect(draft).toContain('Läuft die Anmeldung nur ab, bleiben die Angaben erhalten.');
	});
});

// Protokoll (#357), Fachprüfung R-1/R-4/R-6: die Erklärung nennt alles, was das Protokoll festhält
describe('Datenschutzerklärung zum Protokoll', () => {
	it('nennt auch Abrechnungen, die durch eine berichtigte Abrechnung ersetzt wurden', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);

		expect(document.body.textContent).toContain(
			'sowie zurückgesetzte Zahlungen (mit Abrechnungsnummer und Zahlungsdatum) und Abrechnungen, die durch eine berichtigte Abrechnung ersetzt wurden (mit ihrer Nummer)'
		);
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

	// #458 (#330): in the demo the operator records all data
	it('sagt, dass in der Demo der Betreiber für alle Daten verantwortlich ist', () => {
		show(PrivacyPage, { data: { recipient: null, demo: true, providers: ['Google'] } } as never);

		expect(demoSection()?.textContent).toContain('In der Demo ist der Betreiber für alle Daten verantwortlich.');
	});

	// Fachprüfung R-3 (#357): das Protokoll unter den Einstellungen teilen sich alle Besucher der Demo
	it('sagt, dass alle Besucher die Anmeldungen der anderen im Protokoll sehen', () => {
		show(PrivacyPage, { data: { recipient: null, demo: true, providers: ['Google'] } } as never);

		expect(demoSection()?.textContent).toContain(
			'In der Demo sehen alle Besucher das Protokoll mit den Anmeldungen der anderen, ohne Namen und E-Mail-Adresse, und können Einträge löschen.'
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
			'Jede Anmeldung, jede Verlängerung der Sitzung (etwa alle 50 Minuten, solange Dwello offen ist) und jede Abmeldung wird im Protokoll des Servers festgehalten, mit der Kennung des Kontos und, ausser bei der Abmeldung, der E-Mail-Adresse.'
		);
		expect(login?.textContent).toContain('Das Protokoll dient der Sicherheit und der Fehlersuche; nur der Betreiber liest es.');
		expect(login?.textContent).not.toContain('verwendet sie nur');
	});
});

describe('Datenschutzerklärung zu Anmeldung, Dritten und Cookies', () => {
	const page = (providers: string[]) => {
		show(PrivacyPage, { data: { recipient: null, providers } } as never);
		return document.body.textContent ?? '';
	};

	it('nennt nur die eingerichteten Anmeldeanbieter', () => {
		expect(page(['Google'])).toContain('Sie können sich über Google anmelden.');
		expect(page(['Google'])).not.toContain('Microsoft');
		expect(page(['Google', 'Microsoft'])).toContain(
			'Sie können sich über Google oder Microsoft anmelden.'
		);
	});

	it('nennt die Adresssuche im Gebäuderegister, aber weder OpenPLZ, CARTO noch Google Fonts', () => {
		const text = page(['Google']);
		expect(text).not.toContain('CARTO');
		expect(text).not.toContain('OpenPLZ');
		expect(text).toContain('Gebäude- und Wohnungsregister (GWR)');
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
			'Google erhält die Adresse und die IP-Adresse des Browsers erst, wenn Sie den Link wählen; die Daten können dabei in die USA gelangen.'
		);
		expect(text()).not.toContain('Darüber hinaus gibt Dwello keine Daten an Dritte weiter.');
		expect(text()).toContain(
			'Ausser den hier und unter «Anmeldung» genannten Diensten erhält niemand Daten von Dwello.'
		);
	});

	it('sagt nicht, das Sprach-Cookie entstehe erst mit einer Wahl', () => {
		expect(text()).toContain('«PARAGLIDE_LOCALE» speichert die Sprache der Oberfläche');
	});

	it('sagt, dass das Sprach-Cookie beim ersten Besuch der Sprache des Browsers folgt', () => {
		expect(text()).toContain(
			'Beim ersten Besuch setzt Dwello es auf die Sprache Ihres Browsers, wenn sie Deutsch, Französisch, Italienisch oder Englisch ist, sonst auf Deutsch.'
		);
	});
});

// #82: controller, retention, providers with country and policy, cookie lifetime and refusal
describe('Datenschutzerklärung nach #82', () => {
	const operator = { name: 'Beispiel Hosting AG', address: 'Teststrasse 1, 9999 Testdorf', contact: 'kontakt@beispiel.test' };
	const section = (title: string) =>
		[...document.querySelectorAll('[data-testid="page-section"]')].find(
			(one) => one.querySelector('h2')?.textContent === title
		);
	const links = (title: string) =>
		[...(section(title)?.querySelectorAll('a') ?? [])].map((link) => link.getAttribute('href'));
	const page = (data: Record<string, unknown> = {}) =>
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'], mail: 'smtp', sessionSeconds: 604800, operator, ...data } } as never);

	// #458 (#330): the landlord for the recorded data, a provider only on his behalf, the operator for sign-in, log and cookies
	it('nennt den Vermieter als Verantwortlichen für die erfassten Daten und den Betreiber aus der Konfiguration mit Kontakt', () => {
		page();

		const text = section('Verantwortlich')?.textContent;
		expect(text).toContain(
			'Für die Daten, die Sie in Dwello erfassen, auch die Ihrer Mieter, sind Sie als Vermieter verantwortlich. Dwello wird von Beispiel Hosting AG, Teststrasse 1, 9999 Testdorf betrieben. Kontakt: kontakt@beispiel.test.'
		);
		expect(text).toContain('Betreiber ist, wer diese Dwello-Installation');
		expect(text).toContain('Ein solcher Anbieter bearbeitet die Daten, die Sie erfassen, nur in Ihrem Auftrag.');
		expect(text).toContain('Für die Anmeldung, das Protokoll des Servers und die Cookies ist der Betreiber verantwortlich.');
		expect(text).not.toContain('ist ihr Betreiber');
	});

	// PO on Fachreview 458-1 R-3: every person whose data the landlord records (Art. 25 Abs. 1 DSG «Jede Person»)
	it('sagt, dass Mieter und andere erfasste Personen beim Vermieter Auskunft verlangen und der Vermieter beim Betreiber', () => {
		page();

		expect(section('Verantwortlich')?.textContent).toContain(
			'Ihre Mieter und andere Personen, deren Daten Sie erfassen, etwa Rechnungssteller, können bei Ihnen kostenlos Auskunft darüber verlangen, ob und welche Daten über sie bearbeitet werden, Sie selbst beim Betreiber (Art. 25 DSG).'
		);
	});

	// #458 (#346): rights beyond access (Art. 28, 32, 49 DSG)
	it('nennt Berichtigung, Herausgabe, Löschung und die Anzeige beim EDÖB', () => {
		page();

		const text = section('Verantwortlich')?.textContent;
		expect(text).toContain('Ebenso können diese Personen bei Ihnen und Sie beim Betreiber verlangen');
		expect(text).toContain('dass unrichtige Daten berichtigt werden (Art. 32 Abs. 1 DSG)');
		expect(text).toContain('in einem gängigen elektronischen Format herausgegeben werden (Art. 28 DSG)');
		expect(text).toContain('die Daten gelöscht werden (Art. 32 Abs. 2 DSG)');
		expect(text).toContain('(EDÖB) anzeigen (Art. 49 DSG)');
	});

	it('sagt ohne eingetragenen Betreiber, wer verantwortlich ist und was zu tun ist', () => {
		page({ operator: null });

		const text = section('Verantwortlich')?.textContent;
		expect(text).toContain(
			'sind Sie als Vermieter verantwortlich. Der Betreiber dieser Dwello-Installation hat seinen Namen und seine Adresse noch nicht hinterlegt.'
		);
		// #577: the setup asks for no operator details (product owner, 2026-10-21)
		expect(text).toContain('Betreiben Sie Dwello selbst, tragen Sie sie in der Einstellungsdatei ein, wie die Installationsanleitung beschreibt');
	});

	// #458 (#333): the server's country only when OPERATOR_SERVER_COUNTRY is set (Art. 19 Abs. 4 DSG)
	// PO on Fachreview 458-1 R-1: no preposition before the value, so «Schweiz» reads right too
	it('nennt das Land des Servers, wenn es eingerichtet ist', () => {
		page({ serverCountry: 'Schweiz' });

		expect(section('Welche Daten Dwello speichert')?.textContent).toContain(
			'Die Daten liegen in der Datenbank des Betreibers dieser Dwello-Installation. Der Server steht in folgendem Land: Schweiz.'
		);
	});

	it('nennt ohne eingerichtetes Land nur die Datenbank des Betreibers', () => {
		page({ serverCountry: null });

		const text = section('Welche Daten Dwello speichert')?.textContent;
		expect(text).toContain('Die Daten liegen in der Datenbank des Betreibers dieser Dwello-Installation.');
		expect(text).not.toContain('Der Server steht');
		expect(text).not.toContain('PostgreSQL');
	});

	it('nennt beim Mailversand über SMTP Anbieter und Land des Mailservers, wenn beide eingerichtet sind', () => {
		page({ mailProvider: { name: 'Muster Mail AG', country: 'Schweiz' } });

		const text = section('Weitergabe an Dritte')?.textContent;
		expect(text).toContain(
			'werden über den Mailserver von Muster Mail AG (Schweiz) zugestellt. Dabei erhält Muster Mail AG Name und E-Mail-Adresse des Mieters'
		);
		expect(text).not.toContain('erfahren Sie beim Betreiber');
	});

	it('sagt, dass Dwello nichts von selbst löscht und wer 10 Jahre aufbewahren muss', () => {
		page();

		const text = section('Aufbewahrung')?.textContent;
		expect(text).toContain('Ausser in der öffentlichen Demo löscht Dwello keine gespeicherten Daten von selbst.');
		expect(text).toContain('Nicht einzeln löschen lassen sich versendete Abrechnungen, alle Mahnungen sowie Mieter und Mietverträge, zu denen es Abrechnungen gibt.');
		expect(text).toContain('Wer zur Buchführung verpflichtet ist');
		expect(text).toContain('10 Jahre ab Ende des Geschäftsjahres aufbewahren (Art. 958f OR)');
		expect(text).toContain('Hat der letzte Mietvertrag eines Mieters geendet');
	});

	it('nennt für Google Firma, Land, was Google erfährt und seine Datenschutzerklärung', () => {
		page();

		const text = section('Anmeldung')?.textContent;
		expect(text).toContain('nur Name, E-Mail-Adresse und die Kennung des Kontos beim Anbieter');
		expect(text).not.toContain('Profilbild');
		expect(text).toContain('Google (Google Ireland Limited, Irland, und Google LLC, USA) erfährt bei jeder Anmeldung');
		expect(text).toContain('Swiss-U.S. Data Privacy Framework');
		expect(text).not.toContain('Microsoft');
		expect(links('Anmeldung')).toEqual(['https://policies.google.com/privacy']);
	});

	it('nennt Microsoft nur, wenn es eingerichtet ist', () => {
		page({ providers: ['Microsoft'] });

		expect(section('Anmeldung')?.textContent).toContain('Microsoft (Microsoft Corporation, USA;');
		expect(links('Anmeldung')).toEqual(['https://privacy.microsoft.com/privacystatement']);
	});

	it('nennt beim Mailversand über SMTP den Mailserver, den der Betreiber eingerichtet hat', () => {
		page();

		const text = section('Weitergabe an Dritte')?.textContent;
		expect(text).toContain('über den Mailserver zugestellt, den der Betreiber eingerichtet hat');
		expect(text).not.toContain('Resend');
	});

	it('nennt Resend mit Land und Datenschutzerklärung, wenn Resend eingerichtet ist', () => {
		page({ mail: 'resend' });

		expect(section('Weitergabe an Dritte')?.textContent).toContain('über Resend (Resend, Inc., USA) zugestellt');
		// the safeguard itself, not a referral (Art. 19 Abs. 4 DSG, review W9c-2 R-5)
		expect(section('Weitergabe an Dritte')?.textContent).toContain('(Art. 16 Abs. 2 Bst. d DSG)');
		expect(links('Weitergabe an Dritte')).toContain('https://resend.com/legal/privacy-policy');
	});

	it('sagt ohne Mailversand, dass Dwello keine E-Mails versendet', () => {
		page({ mail: null });

		expect(section('Weitergabe an Dritte')?.textContent).toContain(
			'Dwello versendet keine E-Mails, weil der Betreiber keinen Mailversand eingerichtet hat.'
		);
	});

	// Gebäuderegister (#479): der Server fragt swisstopo, nicht der Browser
	it('nennt swisstopo und Google Maps mit Land und Datenschutzerklärung', () => {
		page();

		const text = section('Weitergabe an Dritte')?.textContent;
		expect(text).toContain('swisstopo auf geo.admin.ch bereitstellt (Schweiz)');
		expect(text).toContain('die IP-Adresse des Servers, nicht die des Browsers');
		expect(text).toContain('Google Maps (Google Ireland Limited, Irland, und Google LLC, USA)');
		expect(links('Weitergabe an Dritte')).toEqual([
			'https://www.swisstopo.admin.ch/en/legal-framework',
			'https://policies.google.com/privacy'
		]);
	});

	it('nennt die Gültigkeit der Anmelde-Cookies aus der Konfiguration', () => {
		page();
		expect(section('Cookies')?.textContent).toContain('Beide gelten 7 Tage ab der Anmeldung oder der letzten Verlängerung der Sitzung.');
	});

	it('nennt eine Gültigkeit in Stunden, wenn sie nicht ganze Tage dauert', () => {
		page({ sessionSeconds: 12 * 3600 });
		expect(section('Cookies')?.textContent).toContain('Beide gelten 12 Stunden ab der Anmeldung oder der letzten Verlängerung der Sitzung.');
	});

	it('sagt, dass Cookies im Browser abgelehnt werden können (Art. 45c FMG)', () => {
		page();

		expect(section('Cookies')?.textContent).toContain(
			'Sie können Cookies und andere Websitedaten in den Einstellungen Ihres Browsers ablehnen oder löschen.'
		);
	});
});

// #86: Dwello sendet auch Nebenkostenabrechnungen per E-Mail, mit dem PDF und allem, was darin steht
describe('Datenschutzerklärung zum E-Mail-Versand', () => {
	it('nennt Abrechnungen per E-Mail und was mit ihrem PDF den Server verlässt', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'], mail: 'smtp' } } as never);

		const text = document.body.textContent!.replace(/\s+/g, ' ');
		expect(text).toContain('Nebenkostenabrechnungen, Zahlungserinnerungen und Mahnungen per E-Mail');
		expect(text).toContain('die Kosten und ihre Verteilung, der Saldo sowie IBAN und Zahlungsreferenz');
	});

	it('nennt auch bei Resend die Abrechnungen und was jedes PDF enthält', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'], mail: 'resend' } } as never);

		const text = document.body.textContent!.replace(/\s+/g, ' ');
		expect(text).toContain('bei einer Zahlungserinnerung oder Mahnung Adresse und offener Betrag');
		expect(text).toContain('die Kosten und ihre Verteilung, der Saldo sowie IBAN und Zahlungsreferenz');
	});
});

// Persona Helga 458 P-1: the landlord can link his tenants to the sections the terms tell him to pass on
describe('Sprungmarken der Datenschutzerklärung', () => {
	it('gibt jedem Abschnitt eine Sprungmarke', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);

		const titles = Object.fromEntries(
			['controller', 'stored', 'retention', 'third'].map((id) => [id, document.getElementById(id)?.querySelector('h2')?.textContent])
		);
		expect(titles).toEqual({
			controller: 'Verantwortlich',
			stored: 'Welche Daten Dwello speichert',
			retention: 'Aufbewahrung',
			third: 'Weitergabe an Dritte'
		});
	});
});

// #458 (#347): both legal pages say when they last changed
describe('Stand der Datenschutzerklärung', () => {
	it('nennt den Stand in der Sprache der Oberfläche', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);

		expect(byTestId('legal-as-of')?.textContent).toBe('Stand: 20. Oktober 2026');
	});
});

// #576: the sign-in with a Konto mit Passwort (fach review 576 R-2 to R-5)
describe('Datenschutzerklärung zur Anmeldung mit Passwort', () => {
	const login = () => document.getElementById('login')?.textContent ?? '';

	it('erklärt das Konto mit Passwort ohne leere Anbieterliste, wenn Google nicht eingerichtet ist', () => {
		show(PrivacyPage, { data: { recipient: null, providers: [], password: true } } as never);

		expect(login()).toContain('Sie melden sich mit E-Mail-Adresse und Passwort an; das Konto legen Sie bei der Einrichtung von Dwello an, oder der Betreiber legt es für Sie an.');
		expect(login()).toContain('Daraus lässt sich das Passwort nicht zurückrechnen, nur durch Ausprobieren erraten.');
		expect(login()).toContain('Dazu speichert Dwello die Zahl der Fehlversuche und das Ende einer allfälligen Sperre bis zur nächsten erfolgreichen Anmeldung.');
		expect(login()).toContain('Jeder Fehlversuch mit Passwort und jede Sperre wird mit der eingetippten E-Mail-Adresse im Protokoll des Servers festgehalten');
		expect(login()).not.toContain('Google');
		expect(login()).not.toContain('über .');
	});

	it('nennt die Cookies der Anmeldung über einen Anbieter nur, wenn einer eingerichtet ist', () => {
		show(PrivacyPage, { data: { recipient: null, providers: [], password: true } } as never);

		const cookies = document.getElementById('cookies')?.textContent ?? '';
		expect(cookies).toContain('dwello_session');
		expect(cookies).not.toContain('«dwello_oauth_state» schützt die Anmeldung vor gefälschten Antworten');
	});

	it('nennt neben dem Passwort auch Google, wenn beides eingerichtet ist', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'], password: true } } as never);

		expect(login()).toContain('Sie melden sich mit E-Mail-Adresse und Passwort an; das Konto legen Sie bei der Einrichtung von Dwello an, oder der Betreiber legt es für Sie an.');
		expect(login()).toContain('Sie können sich über Google anmelden.');
		expect(login()).toContain('Ihr Passwort beim Anbieter sieht Dwello nie.');
	});

	it('erwähnt kein Passwort, wenn es kein Konto mit Passwort gibt', () => {
		show(PrivacyPage, { data: { recipient: null, providers: ['Google'] } } as never);

		expect(login()).not.toContain('Sie melden sich mit E-Mail-Adresse und Passwort an');
	});
});

// #577, fach review 577 R-2: the local KI fetches its model from Ollama by itself
describe('Datenschutzerklärung zum Download des KI-Modells', () => {
	const third = () => document.getElementById('third')?.textContent ?? '';

	it('nennt Ollama, wenn die KI auf dem Server läuft', () => {
		show(PrivacyPage, { data: { recipient: null, providers: [], password: true } } as never);

		expect(third()).toContain(
		'lädt Dwello es bei Ollama (Ollama Inc., USA) herunter, rund 6 GB: beim Start, wenn Sie die lokale KI wählen, und wenn Sie es unter «Einstellungen» › «KI» erneut herunterladen.'
	);
	});

	it('nennt Ollama nicht bei einem Anbieter der KI ausserhalb des Servers', () => {
		show(PrivacyPage, { data: { recipient: { provider: 'OpenAI', country: 'USA' }, providers: [], password: true } } as never);

		expect(third()).toContain('swisstopo');
		expect(third()).not.toContain('Ollama');
	});
});
