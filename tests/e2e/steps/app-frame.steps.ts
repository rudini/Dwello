import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import {
	draftNotice,
	llmRecipientNotice,
	operatorNotice,
	pageOverflowsSideways,
	pageTitleWidth,
	sectionTitled
} from '../questions/app-frame';
import {
	chooseInFooter,
	chooseInMainNav,
	chooseLogo,
	openSettingsFromUserMenu,
	useWindowWidth
} from '../tasks/app-frame';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter liest die Hilfe', async ({ verwalter }) => {
	await visit(verwalter.page, '/help');
});

Given('der Liegenschaftsverwalter liest die Datenschutzerklärung', async ({ verwalter }) => {
	await visit(verwalter.page, '/privacy');
});

Given('der Liegenschaftsverwalter liest die Nutzungsbedingungen', async ({ verwalter }) => {
	await visit(verwalter.page, '/terms');
});

When(
	'der Liegenschaftsverwalter in der Hauptnavigation {string} wählt',
	async ({ verwalter }, label: string) => {
		await verwalter.perform(chooseInMainNav(label));
	}
);

When('der Liegenschaftsverwalter das Logo wählt', async ({ verwalter }) => {
	await verwalter.perform(chooseLogo);
});

When(
	'der Liegenschaftsverwalter im Benutzermenü die Einstellungen wählt',
	async ({ verwalter }) => {
		await verwalter.perform(openSettingsFromUserMenu);
	}
);

When(
	'der Liegenschaftsverwalter in der Fusszeile {string} wählt',
	async ({ verwalter }, label: string) => {
		await verwalter.perform(chooseInFooter(label));
	}
);

Then(
	'sieht der Liegenschaftsverwalter den Abschnitt {string}',
	async ({ verwalter }, heading: string) => {
		await expect(sectionTitled(verwalter, heading)).toBeVisible();
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass Rechnungsdaten für die KI-Kategorisierung den Server nicht verlassen',
	async ({ verwalter }, heading: string) => {
		await expect(llmRecipientNotice(verwalter, heading)).toContainText('verlassen dafür den Server nicht');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass ungespeicherte Eingaben bis zum Speichern, Verwerfen oder Abmelden als Entwurf in diesem Browser bleiben',
	async ({ verwalter }, heading: string) => {
		await expect(draftNotice(verwalter, heading)).toContainText(
			'als Entwurf in diesem Browser auf, bis Sie sie speichern, verwerfen oder sich abmelden'
		);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass {string} die Installation betreibt und unter {string} erreichbar ist',
	async ({ verwalter }, heading: string, operator: string, contact: string) => {
		await expect(operatorNotice(verwalter, heading)).toContainText(operator);
		await expect(operatorNotice(verwalter, heading)).toContainText(contact);
	}
);

Given('das Browserfenster ist {int} Pixel breit', async ({ verwalter }, width: number) => {
	await verwalter.perform(useWindowWidth(width));
});

// Readable: wide enough for a few words per line, not one letter per line
Then('ist der Seitentitel lesbar', async ({ verwalter }) => {
	await expect.poll(() => pageTitleWidth(verwalter)).toBeGreaterThanOrEqual(200);
});

Then('scrollt die Seite nicht seitwärts', async ({ verwalter }) => {
	await expect.poll(() => pageOverflowsSideways(verwalter)).toBe(false);
});
