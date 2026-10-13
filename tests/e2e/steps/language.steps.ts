import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { exampleOf } from '../fixtures/screens';
import { findings } from '../questions/accessibility';
import { userMenuCount } from '../questions/app-frame';
import { languageCode, pageLanguage, shownLanguage } from '../questions/language';
import { pagePath, pageTitle } from '../questions/navigation';
import { checkLanguagesOf } from '../tasks/accessibility';
import {
	chooseInFooter,
	openHelpFromPublicPage,
	openLoginFromPublicPage,
	openTermsFromLogin
} from '../tasks/app-frame';
import { loseSession, signInAgain } from '../tasks/authentication';
import { chooseLanguage, preferEnglishInTheBrowser } from '../tasks/language';
import { openPage, reloadPage } from '../tasks/navigation';

const { Given, When, Then } = createBdd(test);

Given('ein Besucher hat die Anmeldeseite geöffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openPage('/login'));
});

Given('der Liegenschaftsverwalter öffnet eine Seite, die es nicht gibt', async ({ verwalter }) => {
	await verwalter.attemptsTo(openPage('/gibt-es-nicht'));
});

When('der Liegenschaftsverwalter die Sprache {string} wählt', async ({ verwalter }, language: string) => {
	await verwalter.attemptsTo(chooseLanguage(language));
});

When('der Besucher die Sprache {string} wählt', async ({ besucher }, language: string) => {
	await besucher.attemptsTo(chooseLanguage(language));
});

When('der Liegenschaftsverwalter die Seite neu lädt', async ({ verwalter }) => {
	await verwalter.attemptsTo(reloadPage);
});

When('der Liegenschaftsverwalter sich wieder anmeldet', async ({ verwalter, baseURL }) => {
	await verwalter.attemptsTo(signInAgain(baseURL!));
});

// asked of whoever looks at the page, signed in or not: Liegenschaftsverwalter and Besucher share the browser
Then('ist die Seite auf {string}', async ({ verwalter: viewer }, language: string) => {
	await viewer.sees(pageLanguage).toBe(languageCode(language));
	await viewer.sees(shownLanguage).toContain(language);
});

Then('ist der Liegenschaftsverwalter noch auf der Seite {string}', async ({ verwalter }, path: string) => {
	await verwalter.sees(pagePath).toBe(path);
});

Then('heisst die Seite {string}', async ({ verwalter: viewer }, title: string) => {
	await viewer.sees(pageTitle).toBe(title);
});

Then(
	'zeigt der Bildschirm {string} im Zustand {string} auf Französisch, Italienisch und Englisch kein Deutsch und passt in 390 Pixel',
	async ({ verwalter, seed, $testInfo }, name: string, state: string) => {
		$testInfo.setTimeout(180_000); // three languages, each with its own visit
		const example = await exampleOf(seed, name, state);
		await verwalter.attemptsTo(checkLanguagesOf(example, [...seed.names.values()]));
		await verwalter.sees(findings).toEqual([]);
	}
);

Given('der Browser des Liegenschaftsverwalters bevorzugt Englisch', async ({ verwalter }) => {
	await verwalter.attemptsTo(preferEnglishInTheBrowser);
});

Given('ein Besucher hat die Seite {string} geöffnet', async ({ besucher }, path: string) => {
	await besucher.attemptsTo(openPage(path));
});

When('der Besucher den Link zu den Nutzungsbedingungen öffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openTermsFromLogin);
});

When('der Besucher den Link zur Anmeldung öffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openLoginFromPublicPage);
});

When('der Besucher den Link zur Hilfe öffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openHelpFromPublicPage);
});

When('die Anmeldung des Liegenschaftsverwalters abläuft', async ({ verwalter }) => {
	await verwalter.attemptsTo(loseSession);
});

Then('zeigt die Seite kein Benutzermenü', async ({ verwalter }) => {
	await verwalter.sees(userMenuCount).toBe(0);
});

When('der Besucher in der Fusszeile {string} wählt', async ({ besucher }, label: string) => {
	await besucher.attemptsTo(chooseInFooter(label));
});

Then('ist der Besucher noch auf der Seite {string}', async ({ besucher }, path: string) => {
	// retried: a link opens the page in the browser, after the click returns
	await besucher.sees(pagePath).toBe(path);
});
