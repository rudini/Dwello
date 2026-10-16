import { target } from '../screenplay/target';

export const channelSelect = target('Korrespondenzweg', (page) => page.getByTestId('tenant-channel-select'));
export const emailInput = target('E-Mail-Adresse', (page) => page.getByTestId('tenant-email-input'));
export const addressInput = target('Adresse', (page) => page.getByTestId('tenant-address-input'));
export const postalCodeInput = target('PLZ', (page) => page.getByTestId('tenant-postal-code-input'));
export const cityInput = target('Ort', (page) => page.getByTestId('tenant-city-input'));
export const submitTenantButton = target('Mieter speichern', (page) => page.getByTestId('tenant-submit'));
export const languageSelect = target('Sprachauswahl', (page) => page.getByTestId('tenant-language-select'));
export const tenantLanguage = target('Korrespondenzsprache', (page) => page.getByTestId('tenant-language'));
export const tenantChannel = target('Korrespondenz', (page) => page.getByTestId('tenant-channel'));
export const firstNameInput = target('Vorname', (page) => page.getByTestId('tenant-first-name-input'));
export const lastNameInput = target('Nachname', (page) => page.getByTestId('tenant-last-name-input'));
export const countrySelect = target('Land', (page) => page.getByTestId('tenant-country-select'));
export const addressHelp = target('Hilfe zur Korrespondenzadresse', (page) => page.getByTestId('tenant-address-help'));
