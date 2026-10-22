import { target } from '../screenplay/target';

// The KI in the settings (#580): local KI, a provider or none
export const kiLinkInSettings = target('Link zur KI in den Einstellungen', (page) =>
	page.getByTestId('quick-link-ki').getByRole('link')
);
export const kiPage = target('Seite KI', (page) => page.getByTestId('ki-settings-page'));
export const kiMode = (mode: 'local' | 'provider' | 'none') =>
	target(`Wahl der KI (${mode})`, (page) => page.getByTestId(`ki-mode-${mode}`));
export const kiBaseUrlInput = target('Adresse der KI', (page) => page.getByTestId('ki-base-url-input'));
export const kiApiKeyInput = target('API-Schlüssel', (page) => page.getByTestId('ki-api-key-input'));
export const kiModelInput = target('Modell', (page) => page.getByTestId('ki-model-input'));
export const kiProviderInput = target('Anbieter', (page) => page.getByTestId('ki-provider-input'));
export const kiCountryInput = target('Land des Anbieters', (page) => page.getByTestId('ki-country-input'));
export const kiPrivacyConfirm = target('Punkte zum Datenschutz geprüft', (page) => page.getByTestId('ki-privacy-confirm'));
export const kiCheckButton = target('Verbindung prüfen', (page) => page.getByTestId('ki-check-button'));
export const kiSaveButton = target('KI speichern', (page) => page.getByTestId('ki-save-button'));
export const kiCheckResult = target('Ergebnis der Prüfung', (page) => page.getByTestId('ki-check-result'));
