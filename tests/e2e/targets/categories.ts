import { target } from '../screenplay/target';

export const categoryRow = (name: string) =>
	target(`Kategorie ${name} in der Liste`, (page) => page.getByTestId('category-row').filter({ hasText: name }));
export const allowedFilter = target('Filter umlagefähig', (page) => page.getByTestId('category-filter-allowed'));
export const nameInput = target('Name', (page) => page.getByTestId('category-name-input'));
export const allowedCheckbox = target('Umlagefähig', (page) => page.getByTestId('category-allowed-checkbox'));
export const submitButton = target('Kategorie speichern', (page) => page.getByTestId('category-submit'));
export const editButton = (name: string) =>
	target(`Kategorie ${name} bearbeiten`, (page) => categoryRow(name).locate(page).getByTestId('category-edit-button'));
export const deleteButton = (name: string) =>
	target(`Kategorie ${name} löschen`, (page) => categoryRow(name).locate(page).getByTestId('category-delete-button'));
export const allowedBadge = (name: string) =>
	target(`Umlagefähigkeit der Kategorie ${name}`, (page) => categoryRow(name).locate(page).getByTestId('category-allowed'));
export const usage = (name: string) =>
	target(`Verwendung der Kategorie ${name}`, (page) => categoryRow(name).locate(page).getByTestId('category-usage'));
