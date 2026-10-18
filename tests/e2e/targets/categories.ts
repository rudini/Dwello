import { target } from '../screenplay/target';

export const categoryRow = (name: string) =>
	target(`Kategorie ${name} in der Liste`, (page) => page
		.getByTestId('category-row')
		.filter({ has: page.getByTestId('category-name').getByText(name, { exact: true }) })
);
export const allowedFilter = target('Filter umlagefähig', (page) => page.getByTestId('category-filter-allowed'));
export const nameInput = target('Name', (page) => page.getByTestId('category-name-input'));
// The radio's name starts with its label and goes on with its description
export const allowanceOption = (label: 'Umlagefähig' | 'Nicht umlagefähig') =>
	target(`Wahl ${label}`, (page) => page.getByTestId('category-allowance').getByRole('radio', { name: new RegExp(`^${label} `) }));
export const heatingCheckbox = target('Heizkosten nach dem Heizprofil verteilen', (page) =>
	page.getByTestId('category-heating-checkbox')
);
export const fuelCheckbox = target('Brennstoff', (page) => page.getByTestId('category-fuel-checkbox'));
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
// Why a predefined category is or is not umlagefähig (#186), in its row and on its edit page
export const reason = (name: string) =>
	target(`Grund der Umlagefähigkeit von ${name}`, (page) => categoryRow(name).locate(page).getByTestId('category-reason'));
export const descriptionInput = target('Beschreibung', (page) => page.getByTestId('category-description-input'));
export const formReason = target('Grund der Umlagefähigkeit', (page) => page.getByTestId('category-reason'));
export const contractNote = target('Hinweis auf den Mietvertrag', (page) => page.getByTestId('category-contract-note'));
// Whether Dwello supplies the category or the Liegenschaftsverwalter recorded it (#166)
export const kindBadge = (name: string) =>
	target(`Herkunft der Kategorie ${name}`, (page) => categoryRow(name).locate(page).getByTestId('category-kind'));
export const predefinedHint = target('Hinweis auf eine vordefinierte Kategorie', (page) =>
	page.getByTestId('category-predefined-hint')
);
