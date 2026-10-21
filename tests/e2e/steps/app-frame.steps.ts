import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	draftNoticeText,
	footerVersionText,
	glossaryExplanationText,
	legalAsOfText,
	llmRecipientNotice,
	operatorNoticeText,
	pageAnchor,
	pagePurposeText,
	pageOverflowsSideways,
	pageTitleText,
	pageTitleWidth,
	sectionLinkAddresses,
	sectionShareInWindow,
	sectionShown,
	sectionText,
	tabIcon
} from '../questions/app-frame';
import { openPage } from '../tasks/navigation';
import {
	chooseInFooter,
	chooseInHelpContents,
	chooseInMainNav,
	chooseLogo,
	openPrivacySectionFromTerms,
	openSettingsFromUserMenu,
	useWindowWidth
} from '../tasks/app-frame';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter liest die Hilfe', async ({ verwalter }) => {
	await verwalter.attemptsTo(openPage('/help'));
});

Given('der Liegenschaftsverwalter liest die Datenschutzerklärung', async ({ verwalter }) => {
	await verwalter.attemptsTo(openPage('/privacy'));
});

Given('der Liegenschaftsverwalter liest die Nutzungsbedingungen', async ({ verwalter }) => {
	await verwalter.attemptsTo(openPage('/terms'));
});

When(
	'der Liegenschaftsverwalter in der Hauptnavigation {string} wählt',
	async ({ verwalter }, label: string) => {
		await verwalter.attemptsTo(chooseInMainNav(label));
	}
);

When(
	'der Liegenschaftsverwalter in den Nutzungsbedingungen den Abschnitt {string} der Datenschutzerklärung wählt',
	async ({ verwalter }, heading: string) => {
		await verwalter.attemptsTo(openPrivacySectionFromTerms(heading));
	}
);

When('der Liegenschaftsverwalter das Logo wählt', async ({ verwalter }) => {
	await verwalter.attemptsTo(chooseLogo);
});

When(
	'der Liegenschaftsverwalter im Benutzermenü die Einstellungen wählt',
	async ({ verwalter }) => {
		await verwalter.attemptsTo(openSettingsFromUserMenu);
	}
);

When(
	'der Liegenschaftsverwalter in der Fusszeile {string} wählt',
	async ({ verwalter }, label: string) => {
		await verwalter.attemptsTo(chooseInFooter(label));
	}
);

Then(
	'sieht der Liegenschaftsverwalter den Abschnitt {string}',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionShown(heading)).toBe(true);
	}
);

Then(
	'nennt die Datenschutzerklärung unter {string} {string}',
	async ({ verwalter }, heading: string, name: string) => {
		await verwalter.sees(sectionText(heading)).toContain(name);
	}
);

Then(
	'nennt die Datenschutzerklärung unter {string} nicht {string}',
	async ({ verwalter }, heading: string, name: string) => {
		await verwalter.sees(sectionText(heading)).not.toContain(name);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass Rechnungen und neue Kategorien für die KI den Server nicht verlassen',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(llmRecipientNotice(heading)).toContain('neue Kategorien');
		await verwalter.sees(llmRecipientNotice(heading)).toContain('verlassen dafür den Server nicht');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass Dwello das Passwort nur umgerechnet speichert, sodass es sich nicht zurückrechnen lässt',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('Daraus lässt sich das Passwort nicht zurückrechnen');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass jeder Fehlversuch mit der eingetippten E-Mail-Adresse protokolliert wird',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('Jeder Fehlversuch mit Passwort und jede Sperre wird mit der eingetippten E-Mail-Adresse im Protokoll des Servers festgehalten');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass jede Anmeldung und jede Verlängerung der Sitzung mit der E-Mail-Adresse protokolliert wird',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain(
			'Jede Anmeldung, jede Verlängerung der Sitzung (etwa alle 50 Minuten, solange Dwello offen ist) und jede Abmeldung wird im Protokoll des Servers festgehalten'
		);
		await verwalter.sees(sectionText(heading)).toContain('ausser bei der Abmeldung, der E-Mail-Adresse');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass ungespeicherte Angaben bis zum Speichern oder Erstellen, Verwerfen oder Abmelden nur in diesem Browser bleiben',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(draftNoticeText(heading)).toContain(
			'nur in diesem Browser auf, damit Sie später weitermachen können: bis Sie den Mietvertrag speichern oder die Abrechnungen erstellen, Ihre Angaben verwerfen oder sich mit «Abmelden» abmelden.'
		);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass {string} die Installation betreibt und unter {string} erreichbar ist',
	async ({ verwalter }, heading: string, operator: string, contact: string) => {
		await verwalter.sees(operatorNoticeText(heading)).toContain(operator);
		await verwalter.sees(operatorNoticeText(heading)).toContain(contact);
	}
);

Given('das Browserfenster ist {int} Pixel breit', async ({ verwalter }, width: number) => {
	await verwalter.attemptsTo(useWindowWidth(width));
});

// Readable: wide enough for a few words per line, not one letter per line
Then('ist der Seitentitel lesbar', async ({ verwalter }) => {
	await verwalter.sees(pageTitleWidth).toBeGreaterThanOrEqual(200);
});

Then('scrollt die Seite nicht seitwärts', async ({ verwalter }) => {
	await verwalter.sees(pageOverflowsSideways).toBe(false);
});

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass Dwello die zu Mietern hochgeladenen Dokumente speichert',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('Dokumente, die Sie zu Mietern hochladen');
	}
);

Then('zeigt das Browser-Tab das Dwello-Symbol', async ({ verwalter }) => {
	await verwalter.sees(tabIcon).toBe('image/svg+xml');
});

Then('zeigt die Fusszeile die Version {string}', async ({ verwalter }, version: string) => {
	await verwalter.sees(footerVersionText).toBe(`Version ${version}`);
});

Then('erklärt die Hilfe unter {string} {string}', async ({ verwalter }, heading: string, text: string) => {
	await verwalter.sees(sectionText(heading)).toContain(text);
});

Then(
	'erklärt die Datenschutzerklärung unter {string}, wer der Betreiber ist',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('Betreiber ist, wer');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass seine Mieter und andere erfasste Personen bei ihm Auskunft über ihre Daten verlangen können',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain(
			'Ihre Mieter und andere Personen, deren Daten Sie erfassen, etwa Rechnungssteller, können bei Ihnen kostenlos Auskunft'
		);
		await verwalter.sees(sectionText(heading)).toContain('Art. 25 DSG');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass ein Anbieter die erfassten Daten nur in seinem Auftrag bearbeitet und der Betreiber für Anmeldung, Protokoll des Servers und Cookies verantwortlich ist',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('Ein solcher Anbieter bearbeitet die Daten, die Sie erfassen, nur in Ihrem Auftrag.');
		await verwalter.sees(sectionText(heading)).toContain(
			'Für die Anmeldung, das Protokoll des Servers und die Cookies ist der Betreiber verantwortlich.'
		);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass erfasste Personen bei ihm Berichtigung, Herausgabe und Löschung verlangen und eine Verletzung beim EDÖB anzeigen können',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('Ebenso können diese Personen bei Ihnen und Sie beim Betreiber verlangen');
		await verwalter.sees(sectionText(heading)).toContain('dass unrichtige Daten berichtigt werden (Art. 32 Abs. 1 DSG)');
		await verwalter.sees(sectionText(heading)).toContain('in einem gängigen elektronischen Format herausgegeben werden (Art. 28 DSG)');
		await verwalter.sees(sectionText(heading)).toContain('die Daten gelöscht werden (Art. 32 Abs. 2 DSG)');
		await verwalter.sees(sectionText(heading)).toContain('(EDÖB) anzeigen (Art. 49 DSG)');
	}
);

Then(
	'nennen die Nutzungsbedingungen unter {string} {string}',
	async ({ verwalter }, heading: string, text: string) => {
		await verwalter.sees(sectionText(heading)).toContain(text);
	}
);

Then('nennt die Seite den Stand {string}', async ({ verwalter }, date: string) => {
	await verwalter.sees(legalAsOfText).toBe(`Stand: ${date}`);
});

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass Dwello nichts von selbst löscht und wer zur Buchführung verpflichtet ist, Geschäftsbücher und Buchungsbelege 10 Jahre aufbewahrt',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('löscht Dwello keine gespeicherten Daten von selbst');
		await verwalter.sees(sectionText(heading)).toContain('Wer zur Buchführung verpflichtet ist');
		await verwalter.sees(sectionText(heading)).toContain('10 Jahre');
		await verwalter.sees(sectionText(heading)).toContain('Art. 958f OR');
	}
);

Then(
	'nennt die Datenschutzerklärung unter {string} {string} in {string} mit seiner Datenschutzerklärung {string}',
	async ({ verwalter }, heading: string, name: string, country: string, policy: string) => {
		await verwalter.sees(sectionText(heading)).toContain(name);
		await verwalter.sees(sectionText(heading)).toContain(country);
		await verwalter.sees(sectionLinkAddresses(heading)).toContain(policy);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass Google erfährt, wann und von welcher IP-Adresse diese Installation genutzt wird',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('diese Dwello-Installation');
		await verwalter.sees(sectionText(heading)).toContain('IP-Adresse');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass swisstopo den Suchbegriff und die IP-Adresse des Servers erhält, nicht die des Browsers',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('den eingegebenen Suchbegriff');
		await verwalter.sees(sectionText(heading)).toContain('die IP-Adresse des Servers, nicht die des Browsers');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass nur der Betreiber das Protokoll des Servers zur Sicherheit und Fehlersuche liest und selbst bestimmt, wie lange es aufbewahrt wird',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('Sicherheit');
		await verwalter.sees(sectionText(heading)).toContain('Fehlersuche');
		await verwalter.sees(sectionText(heading)).toContain('nur der Betreiber');
		await verwalter.sees(sectionText(heading)).toContain('legt der Betreiber');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass {string} und {string} {int} Tage gelten',
	async ({ verwalter }, heading: string, first: string, second: string, days: number) => {
		await verwalter.sees(sectionText(heading)).toContain(`«${first}»`);
		await verwalter.sees(sectionText(heading)).toContain(`«${second}»`);
		await verwalter.sees(sectionText(heading)).toContain(`${days} Tage`);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass er Cookies im Browser ablehnen kann, sich dann aber nicht anmelden kann',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('ablehnen');
		await verwalter.sees(sectionText(heading)).toContain('nicht anmelden');
	}
);

Then(
	'erklärt die Hilfe den Begriff {string} mit {string}',
	async ({ verwalter }, term: string, explanation: string) => {
		await verwalter.sees(glossaryExplanationText(term)).toContain(explanation);
	}
);

When('der Liegenschaftsverwalter im Inhalt der Hilfe {string} wählt', async ({ verwalter }, label: string) => {
	await verwalter.attemptsTo(chooseInHelpContents(label));
});

// The glossary has its own address, so a link can lead straight to it (#109)
Then('sieht der Liegenschaftsverwalter die Begriffe der Hilfe unter ihrer eigenen Adresse', async ({ verwalter }) => {
	await verwalter.sees(pageAnchor).toBe('#glossary');
	await verwalter.sees(sectionShareInWindow('Begriffe kurz erklärt')).toBeGreaterThan(0);
});

Then('erklärt die Seite {string} {string}', async ({ verwalter }, title: string, text: string) => {
	await verwalter.sees(pageTitleText).toBe(title);
	await verwalter.sees(pagePurposeText).toContain(text);
});

When('der Liegenschaftsverwalter die Seite {string} öffnet', async ({ verwalter }, path: string) => {
	await verwalter.attemptsTo(openPage(path));
});

Then('sagt die Fehlerseite {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(pageTitleText).toBe(message);
});
