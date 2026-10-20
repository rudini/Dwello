import { target } from '../screenplay/target';

export const keyRow = (name: string) =>
	target(`Verteilschlüssel ${name} in der Liste`, (page) =>
		page
			.getByTestId('distribution-key-row')
			.filter({ has: page.getByTestId('distribution-key-name').getByText(name, { exact: true }) })
	);
export const nameInput = target('Name', (page) => page.getByTestId('distribution-key-name-input'));
export const frenchNameInput = target('Name auf Französisch', (page) => page.getByTestId('distribution-key-name-fr-input'));
export const formulaInput = target('Formel', (page) => page.getByTestId('distribution-key-formula-input'));
export const testButton = target('Formel testen', (page) => page.getByTestId('distribution-key-test-button'));
export const submitButton = target('Verteilschlüssel speichern', (page) => page.getByTestId('distribution-key-submit'));
export const sampleShare = (apartment: string) =>
	target(`Anteil der Beispielwohnung ${apartment}`, (page) =>
		page.getByTestId('formula-test-row').filter({ hasText: apartment }).getByTestId('formula-test-share')
	);
export const editButton = (name: string) =>
	target(`Verteilschlüssel ${name} bearbeiten`, (page) =>
		keyRow(name).locate(page).getByTestId('distribution-key-edit-button')
	);
export const deleteButton = (name: string) =>
	target(`Verteilschlüssel ${name} löschen`, (page) =>
		keyRow(name).locate(page).getByTestId('distribution-key-delete-button')
	);
export const keyActions = (name: string) =>
	target(`Aktionen des Verteilschlüssels ${name}`, (page) =>
		editButton(name).locate(page).or(deleteButton(name).locate(page))
	);
export const formula = (name: string) =>
	target(`Formel des Verteilschlüssels ${name}`, (page) =>
		keyRow(name).locate(page).getByTestId('distribution-key-formula')
	);
export const usage = (name: string) =>
	target(`Verwendung des Verteilschlüssels ${name}`, (page) =>
		keyRow(name).locate(page).getByTestId('distribution-key-usage')
	);
