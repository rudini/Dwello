import { target } from '../screenplay/target';

// #682: the search and filters of a list, one named landmark on every list
export const listSearch = target('Suche und Filter', (page) => page.getByRole('search', { name: 'Suche und Filter' }));
// «Filter zurücksetzen» wherever the page offers it: in the filters or in the hint of an empty list
export const resetFilterControls = target('Filter zurücksetzen', (page) =>
	page.getByRole('main').getByText('Filter zurücksetzen', { exact: true })
);
export const listResultsHeading = target('Überschrift der Liste', (page) => page.getByTestId('list-results'));
