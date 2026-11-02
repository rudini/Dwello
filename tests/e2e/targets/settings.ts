import { target } from '../screenplay/target';

export const settingField = (name: string) => target(`Einstellung ${name}`, (page) => page.getByTestId(`setting-${name}`));
export const saveSettingsButton = target('Einstellungen speichern', (page) => page.getByTestId('settings-submit'));
export const savedNotice = target('Hinweis Einstellungen gespeichert', (page) => page.getByTestId('settings-saved'));
export const masterDataLink = (label: string) =>
	target(`Stammdaten «${label}»`, (page) => page.getByTestId('quick-links').getByRole('link').filter({ hasText: label }));
// #496: the ZIP with all data
export const exportAllDataButton = target('Alle Daten exportieren', (page) => page.getByTestId('config-export-button'));
// #1036: after saving another Abrechnungsperiode, the Mietverträge whose tenants must agree, each with its letter
export const periodChangeHint = target('Hinweis zum Wechsel der Abrechnungsperiode', (page) => page.getByTestId('settings-period-change'));
export const periodChangeLetter = (contractId: string) =>
	target(`Brief zur Zustimmung des Mietvertrags ${contractId}`, (page) => page.getByTestId(`settings-period-change-letter-${contractId}`));
