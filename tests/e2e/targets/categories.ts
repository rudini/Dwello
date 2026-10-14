import { target } from '../screenplay/target';

export const categoryRow = (name: string) =>
	target(`Kategorie ${name} in der Liste`, (page) => page.getByTestId('category-row').filter({ hasText: name }));
export const allowedFilter = target('Filter umlagefähig', (page) => page.getByTestId('category-filter-allowed'));
export const nameInput = target('Name', (page) => page.getByTestId('category-name-input'));
export const allowanceOption = (label: 'Umlagefähig' | 'Nicht umlagefähig') =>
	target(`Wahl ${label}`, (page) => page.getByTestId('category-allowance').getByRole('radio', { name: label, exact: true }));
export const proposeButton = target('Von der KI prüfen lassen', (page) => page.getByTestId('category-propose-button'));
export const proposal = target('Vorschlag der KI', (page) => page.getByTestId('category-proposal'));
export const submitButton = target('Kategorie speichern', (page) => page.getByTestId('category-submit'));
export const editButton = (name: string) =>
	target(`Kategorie ${name} bearbeiten`, (page) => categoryRow(name).locate(page).getByTestId('category-edit-button'));
export const deleteButton = (name: string) =>
	target(`Kategorie ${name} löschen`, (page) => categoryRow(name).locate(page).getByTestId('category-delete-button'));
export const allowedBadge = (name: string) =>
	target(`Umlagefähigkeit der Kategorie ${name}`, (page) => categoryRow(name).locate(page).getByTestId('category-allowed'));
export const usage = (name: string) =>
	target(`Verwendung der Kategorie ${name}`, (page) => categoryRow(name).locate(page).getByTestId('category-usage'));
export const description = (name: string) =>
	target(`Beschreibung der Kategorie ${name}`, (page) => categoryRow(name).locate(page).getByTestId('category-description'));
