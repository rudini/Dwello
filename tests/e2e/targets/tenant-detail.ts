import { target } from '../screenplay/target';

export const rentalApartment = target('Gemietete Wohnung', (page) => page.getByTestId('tenant-rental-apartment'));
export const rentalRent = target('Monatliche Miete', (page) => page.getByTestId('tenant-rental-rent'));
export const rentalStart = target('Mietbeginn', (page) => page.getByTestId('tenant-rental-start'));
export const rentalApartmentLink = target('Link zur Wohnung', (page) => page.getByTestId('tenant-rental-apartment-link'));
export const editTenantButton = target('Mieter bearbeiten', (page) => page.getByTestId('tenant-edit-button'));
export const newContractButton = target('Mietvertrag erfassen', (page) => page.getByTestId('tenant-new-contract-button'));
export const deleteTenantButton = target('Mieter löschen', (page) => page.getByTestId('tenant-delete-button'));
export const confirmDeleteTenantButton = target('Mieter löschen bestätigen', (page) =>
	page.getByTestId('tenant-delete-confirm')
);
