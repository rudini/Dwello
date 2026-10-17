import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	draftNoticeText,
	footerVersionText,
	glossaryExplanationText,
	llmRecipientNotice,
	operatorNoticeText,
	pageAnchor,
	pagePurposeText,
	pageOverflowsSideways,
	pageTitleText,
	pageTitleWidth,
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
	'erfährt der Liegenschaftsverwalter unter {string}, dass jede Anmeldung und jede Verlängerung der Sitzung mit der E-Mail-Adresse protokolliert wird',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain(
			'Jede Anmeldung und jede Verlängerung der Sitzung (etwa alle 50 Minuten, solange Dwello offen ist) wird mit der E-Mail-Adresse im Protokoll des Servers festgehalten'
		);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass ungespeicherte Eingaben bis zum Speichern, Verwerfen oder Abmelden als Entwurf in diesem Browser bleiben',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(draftNoticeText(heading)).toContain(
			'als Entwurf in diesem Browser auf, bis Sie sie speichern, verwerfen oder sich abmelden'
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
