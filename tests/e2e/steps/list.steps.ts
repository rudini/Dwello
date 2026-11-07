import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { announcedResult, focusedFilter, listHeading, listSearchText, offeredResets } from '../questions/list';
import { chooseInListFilter, typeIntoListSearch } from '../tasks/list';

const { When, Then } = createBdd(test);

// #682: the filters or the hint of an empty list, not both
Then('bietet die Seite nur einmal an, die Filter zurückzusetzen', async ({ verwalter }) => {
	await verwalter.sees(offeredResets).toBe(1);
});

Then('steht über der Mietvertragsliste {string}', async ({ verwalter }, heading: string) => {
	await verwalter.sees(listHeading).toBe(heading);
});

// #662: typed into the search of the list shown, without «Suchen»
When('der Liegenschaftsverwalter {string} in die Suche eingibt', async ({ verwalter, names }, term: string) => {
	await verwalter.attemptsTo(typeIntoListSearch(names.get(term) ?? term));
});

// #662: the choice applies at once; a record's name (a building) with its test suffix
When(
	'der Liegenschaftsverwalter im Filter {string} {string} wählt',
	async ({ verwalter, names }, filter: string, option: string) => {
		await verwalter.attemptsTo(chooseInListFilter(filter, names.get(option) ?? option));
	}
);

Then('bleibt der Fokus im Filter {string}', async ({ verwalter }, filter: string) => {
	await verwalter.sees(focusedFilter).toBe(filter);
});

Then('sagt die Seite das Ergebnis {string} an', async ({ verwalter }, result: string) => {
	await verwalter.sees(announcedResult).toBe(result);
});

Then('zeigt die Suche {string}', async ({ verwalter, names }, term: string) => {
	await verwalter.sees(listSearchText).toBe(names.get(term) ?? term);
});
