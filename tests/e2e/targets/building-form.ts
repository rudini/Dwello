import { target } from '../screenplay/target';

export const nameInput = target('Gebäudename', (page) => page.getByTestId('building-name-input'));
export const addressInput = target('Adresse', (page) => page.getByTestId('building-address-input'));
export const postalCodeInput = target('PLZ', (page) => page.getByTestId('building-postal-code-input'));
export const cityInput = target('Ort', (page) => page.getByTestId('building-city-input'));
export const cantonSelect = target('Kanton', (page) => page.getByTestId('building-canton-select'));
export const yearBuiltInput = target('Baujahr', (page) => page.getByTestId('building-year-built-input'));
export const noTankCheckbox = target('Kein Tank oder Tank stillgelegt', (page) => page.getByTestId('building-no-tank-checkbox'));
export const submitButton = target('Gebäude speichern', (page) => page.getByTestId('building-form-submit'));
