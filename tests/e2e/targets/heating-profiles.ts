import { target } from '../screenplay/target';

export const profileCard = (name: string) =>
	target(`Heizprofil ${name}`, (page) => page.getByTestId('heating-profile-card').filter({ hasText: name }));
export const nameInput = target('Name', (page) => page.getByTestId('heating-profile-name-input'));
export const monthInput = (month: string) =>
	target(`Anteil ${month}`, (page) => page.getByTestId(`heating-profile-month-${month}`));
export const submitButton = target('Heizprofil speichern', (page) => page.getByTestId('heating-profile-submit'));
export const monthShare = (month: string) =>
	target(`Anteil ${month} im Heizprofil`, (page) => page.getByTestId(`heating-profile-share-${month}`));
export const profileTotal = target('Summe der Monatsanteile', (page) => page.getByTestId('heating-profile-total'));
export const editButton = target('Heizprofil bearbeiten', (page) => page.getByTestId('heating-profile-edit-button'));
export const deleteButton = target('Heizprofil löschen', (page) => page.getByTestId('heating-profile-delete-button'));
export const profileActions = target('Aktionen des Heizprofils', (page) =>
	editButton.locate(page).or(deleteButton.locate(page))
);
export const confirmDeleteButton = target('Löschen des Heizprofils bestätigen', (page) =>
	page.getByTestId('heating-profile-delete-confirm')
);
