import { target } from '../screenplay/target';

export const apartmentRow = (number: string) =>
	target(`Wohnungszeile «${number}»`, (page) => page.getByTestId(/^apartment-row-/).filter({ hasText: number }));
export const deleteButton = target('Gebäude löschen', (page) => page.getByTestId('building-delete-button'));
export const confirmDeleteButton = target('Gebäude löschen bestätigen', (page) =>
	page.getByTestId('building-delete-confirm')
);
export const editButton = target('Gebäude bearbeiten', (page) => page.getByTestId('building-edit-button'));
export const addApartmentButton = target('Wohnung hinzufügen', (page) => page.getByTestId('apartment-add-button'));
export const firstApartmentButton = target('Erste Wohnung erstellen', (page) =>
	page.getByTestId('apartment-first-create-button')
);
export const addressLine = target('Adresse des Gebäudes', (page) => page.getByTestId('building-address'));
export const buildingMap = target('Karte des Gebäudes', (page) => page.getByTestId('building-mini-map'));
export const yearBuiltValue = target('Baujahr', (page) => page.getByTestId('building-year-built'));
export const fuelStockDate = target('Stichtag Tankbestand', (page) => page.getByTestId('fuel-stock-date-input'));
export const fuelStockAmount = target('Wert Tankbestand', (page) => page.getByTestId('fuel-stock-amount-input'));
export const saveFuelStockButton = target('Tankbestand speichern', (page) => page.getByTestId('fuel-stock-save-button'));
export const fuelStockRows = target('Tankbestände', (page) => page.getByTestId(/^fuel-stock-[0-9a-f-]{36}$/));
