import { target } from '../screenplay/target';

export const settingField = (name: string) => target(`Einstellung ${name}`, (page) => page.getByTestId(`setting-${name}`));
export const saveSettingsButton = target('Einstellungen speichern', (page) => page.getByTestId('settings-submit'));
export const savedNotice = target('Hinweis Einstellungen gespeichert', (page) => page.getByTestId('settings-saved'));
export const masterDataLink = (label: string) =>
	target(`Stammdaten «${label}»`, (page) => page.getByTestId('quick-links').getByRole('link').filter({ hasText: label }));
// #496: the ZIP with all data
export const exportAllDataButton = target('Alle Daten exportieren', (page) => page.getByTestId('config-export-button'));
// #1166: «Kontoinhaber ist der Absender»
export const holderIsSenderBox = target('Kontoinhaber ist der Absender', (page) => page.getByTestId('setting-accountHolderIsSender'));
// #1456: the overview's groups and the form's own page
export const settingsGroupEntries = (group: string) =>
	target(`Einträge der Gruppe «${group}»`, (page) =>
		page
			.getByTestId('settings-group')
			.filter({ has: page.getByRole('heading', { name: group, exact: true }) })
			.getByTestId('settings-entry-name')
	);
export const settingsButtons = target('Knöpfe der Einstellungen', (page) => page.getByTestId('config-page').getByRole('button'));
export const senderEntry = target('Eintrag «Absender und Konto»', (page) => page.getByTestId('quick-link-sender'));
export const senderLink = target('Link «Absender und Konto»', (page) => page.getByTestId('quick-link-sender').getByRole('link'));
export const senderMissing = target('Fehlende Angaben bei «Absender und Konto»', (page) => page.getByTestId('sender-missing'));
export const updateCheckSaved = target('Bestätigung beim Schalter', (page) => page.getByTestId('update-check-saved'));
