import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { exampleOf } from '../fixtures/screens';
import { findings, heardAnnouncements, heardAnnouncementsWith } from '../questions/accessibility';
import { checkAccessibilityOf, listenLikeAScreenReader } from '../tasks/accessibility';

const { Given, Then } = createBdd(test);

Then(
	'ist der Bildschirm {string} im Zustand {string} in allen Ansichten barrierefrei',
	async ({ verwalter, seed, $testInfo }, name: string, state: string) => {
		$testInfo.setTimeout(180_000); // every viewport and colour scheme of the screen in one example
		await verwalter.attemptsTo(checkAccessibilityOf(await exampleOf(seed, name, state)));
		await verwalter.sees(findings).toEqual([]);
	}
);

// #1173: what a screen reader announces after the next step, in order
Given('ein Screenreader hört mit', async ({ verwalter }) => {
	await verwalter.attemptsTo(listenLikeAScreenReader);
});

Then('sagt der Screenreader {string} an', async ({ verwalter }, announcement: string) => {
	await verwalter.sees(heardAnnouncements).toContain(announcement);
});

// every page title ends in «Dwello» (src/routes/+layout.svelte and each page's <title>)
Then('sagt der Screenreader den Seitentitel nicht noch einmal an', async ({ verwalter }) => {
	await verwalter.sees(heardAnnouncementsWith('Dwello')).toEqual([]);
});

Then('sagt der Screenreader nur den Seitentitel des Mieters {string} an', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(heardAnnouncements).toEqual([`${names.get(tenant) ?? tenant} - Dwello`]);
});
