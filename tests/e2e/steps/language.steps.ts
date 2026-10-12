import { expect, type Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { sessionCookies } from '../fixtures/session';
import { visit } from '../interactions/navigation';
import { chooseLanguage } from '../tasks/language';
import { chooseInFooter } from '../tasks/app-frame';
import { address, check, screens, seedFor } from '../interactions/accessibility';
import { cutOff, germanOnScreen } from '../interactions/german-text';
import { documentLanguage, useLanguage } from '../interactions/language';
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

Then(
	'zeigt der Bildschirm {string} im Zustand {string} auf Französisch, Italienisch und Englisch kein Deutsch und passt in 390 Pixel',
	async ({ page, seed, $testInfo }, name: string, state: string) => {
		$testInfo.setTimeout(180_000); // three languages, each with its own visit
		const screen = screens.find((candidate) => candidate.name === name)!;
		if (screen.public) await page.context().clearCookies();
		const path = await seedFor(seed, address(screen, state), state);
		const userData = [...seed.names.values()];
		const found: string[] = [];
		// 'other-language' chooses French itself
		for (const language of state === 'other-language' ? ['fr'] : ['fr', 'it', 'en']) {
			await useLanguage(page, language);
			const look = async (shownPage: Page) => {
				const shown = (await documentLanguage(shownPage).getAttribute('lang'))!;
				const german = shown === 'de' ? ['page shown in German'] : await germanOnScreen(shownPage, shown, userData);
				return [...german, ...(await cutOff(shownPage))].map((finding) => `${language}: ${finding}`);
			};
			found.push(...(await check(page, path, state, 'mobile', 'light', look)));
		}
		expect(found).toEqual([]);
	}
);

Given('der Browser des Liegenschaftsverwalters bevorzugt Englisch', async ({ verwalter }) => {
	await verwalter.page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en;q=0.9' });
});

Given('ein Besucher hat die Seite {string} geöffnet', async ({ besucher }, path: string) => {
	await visit(besucher.page, path);
});

When('der Besucher den Link zu den Nutzungsbedingungen öffnet', async ({ besucher }) => {
	await besucher.page.getByTestId('login-terms-link').click();
});

When('der Besucher den Link zur Anmeldung öffnet', async ({ besucher }) => {
	await besucher.page.getByTestId('public-login-link').click();
});

When('der Besucher in der Fusszeile {string} wählt', async ({ besucher }, label: string) => {
	await besucher.perform(chooseInFooter(label));
});

Then('ist der Besucher noch auf der Seite {string}', async ({ besucher }, path: string) => {
	// retried: a link opens the page in the browser, after the click returns
	await expect(besucher.page).toHaveURL((url) => url.pathname === path);
});
