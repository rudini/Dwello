import { target } from '../screenplay/target';

export const rentalApartment = target('Gemietete Wohnung', (page) => page.getByTestId('tenant-rental-apartment'));
export const rentalRent = target('Monatliche Miete', (page) => page.getByTestId('tenant-rental-rent'));
export const rentalStart = target('Mietbeginn', (page) => page.getByTestId('tenant-rental-start'));
export const rentalApartmentLink = target('Link zur Wohnung', (page) => page.getByTestId('tenant-rental-apartment-link'));
export const editTenantButton = target('Mieter bearbeiten', (page) => page.getByTestId('tenant-edit-button'));
export const newContractButton = target('Mietvertrag erfassen', (page) => page.getByTestId('tenant-new-contract-button'));
export const exportTenantButton = target('Daten exportieren', (page) => page.getByTestId('tenant-export-button'));
export const deleteTenantButton = target('Mieter löschen', (page) => page.getByTestId('tenant-delete-button'));
export const confirmDeleteTenantButton = target('Mieter löschen bestätigen', (page) =>
	page.getByTestId('tenant-delete-confirm')
);
export const tenantAddress = target('Korrespondenzadresse', (page) => page.getByTestId('tenant-address'));
// #459: «Mieter anonymisieren» after the retention, and from when before it
export const anonymiseTenantButton = target('Mieter anonymisieren', (page) => page.getByTestId('tenant-anonymise-button'));
export const confirmAnonymiseTenantButton = target('Anonymisieren bestätigen', (page) =>
	page.getByTestId('tenant-anonymise-confirm')
);
export const anonymiseConsequence = target('Folge des Anonymisierens', (page) =>
	page.getByTestId('tenant-anonymise-message')
);
export const anonymiseFrom = target('Anonymisieren ab', (page) => page.getByTestId('tenant-anonymise-from'));
