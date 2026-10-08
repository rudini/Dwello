import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { llmRecipientNotice, sectionTitled } from '../questions/app-frame';
import {
	chooseInFooter,
	chooseInMainNav,
	chooseLogo,
	openSettingsFromUserMenu
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
