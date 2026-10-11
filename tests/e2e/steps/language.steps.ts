import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { sessionCookies } from '../fixtures/session';
import { visit } from '../interactions/navigation';
import { chooseLanguage } from '../tasks/language';
import { languageCode, pageLanguage, shownLanguage } from '../questions/language';

const { Given, When, Then } = createBdd(test);

Given('ein Besucher hat die Anmeldeseite geöffnet', async ({ besucher }) => {
	await visit(besucher.page, '/login');
});

Given('der Liegenschaftsverwalter öffnet eine Seite, die es nicht gibt', async ({ verwalter }) => {
	await visit(verwalter.page, '/gibt-es-nicht');
});

When('der Liegenschaftsverwalter die Sprache {string} wählt', async ({ verwalter }, language: string) => {
	await verwalter.perform(chooseLanguage(language));
});

When('der Besucher die Sprache {string} wählt', async ({ besucher }, language: string) => {
	await besucher.perform(chooseLanguage(language));
});

When('der Liegenschaftsverwalter die Seite neu lädt', async ({ verwalter }) => {
	await verwalter.page.reload();
});

When('der Liegenschaftsverwalter sich wieder anmeldet', async ({ verwalter, baseURL }) => {
	await verwalter.page.context().addCookies(await sessionCookies(baseURL!));
	await visit(verwalter.page, '/dashboard');
});

Then('ist die Seite auf {string}', async ({ page }, language: string) => {
	await expect(pageLanguage({ page })).toHaveAttribute('lang', languageCode(language));
	await expect(shownLanguage({ page })).toContainText(language);
});

Then('ist der Liegenschaftsverwalter noch auf der Seite {string}', async ({ verwalter }, path: string) => {
	expect(new URL(verwalter.page.url()).pathname).toBe(path);
});

Then('heisst die Seite {string}', async ({ page }, title: string) => {
	await expect(page).toHaveTitle(title);
});
