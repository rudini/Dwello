import { target } from '../screenplay/target';

export const settingField = (name: string) => target(`Einstellung ${name}`, (page) => page.getByTestId(`setting-${name}`));
export const saveSettingsButton = target('Einstellungen speichern', (page) => page.getByTestId('settings-submit'));
export const savedNotice = target('Hinweis Einstellungen gespeichert', (page) => page.getByTestId('settings-saved'));
export const masterDataLink = (label: string) =>
	target(`Stammdaten «${label}»`, (page) => page.getByTestId('quick-links').getByRole('link').filter({ hasText: label }));
// #496: the ZIP with all data
export const exportAllDataButton = target('Alle Daten exportieren', (page) => page.getByTestId('config-export-button'));
