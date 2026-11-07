import { target } from '../screenplay/target';

// #682: the search and filters of a list, one named landmark on every list
export const listSearch = target('Suche und Filter', (page) => page.getByRole('search', { name: 'Suche und Filter' }));
// «Filter zurücksetzen» wherever the page offers it: in the filters or in the hint of an empty list
export const resetFilterControls = target('Filter zurücksetzen', (page) =>
	page.getByRole('main').getByText('Filter zurücksetzen', { exact: true })
);
export const listResultsHeading = target('Überschrift der Liste', (page) => page.getByTestId('list-results'));
// #662: the text search and a filter of a list, by their labels inside the list's search landmark
export const listSearchField = target('Suche der Liste', (page) => listSearch.locate(page).getByLabel('Suche', { exact: true }));
export const listFilter = (label: string) =>
	target(`Filter «${label}»`, (page) => listSearch.locate(page).getByLabel(label, { exact: true }));
// #662 (persona Sven S-1): what a screen reader hears after a choice that keeps the focus in the filter
export const listResultStatus = target('Ansage des Ergebnisses', (page) => page.getByTestId('list-result-status'));
