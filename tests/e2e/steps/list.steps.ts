import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { listHeading, listSearchShown, offeredResets } from '../questions/list';

const { Then } = createBdd(test);

// #682: the filters or the hint of an empty list, not both
Then('bietet die Seite nur einmal an, die Filter zurückzusetzen', async ({ verwalter }) => {
	await verwalter.sees(offeredResets).toBe(1);
});

// after the search, so an error page does not pass
Then('bietet die Seite nicht an, die Filter zurückzusetzen', async ({ verwalter }) => {
	await verwalter.sees(listSearchShown).toBe(true);
	await verwalter.sees(offeredResets).toBe(0);
});

Then('steht über der Mietvertragsliste {string}', async ({ verwalter }, heading: string) => {
	await verwalter.sees(listHeading).toBe(heading);
});
