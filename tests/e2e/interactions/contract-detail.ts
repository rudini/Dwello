import type { Page } from '@playwright/test';

export const contractApartment = (page: Page) => page.getByTestId('contract-apartment');
export const contractTotalRent = (page: Page) => page.getByTestId('contract-total-rent');
export const contractStatus = (page: Page) => page.getByTestId('contract-status');
export const endContractButton = (page: Page) => page.getByTestId('contract-end-button');
export const confirmEndContractButton = (page: Page) => page.getByTestId('contract-end-confirm');
export const deleteContractButton = (page: Page) => page.getByTestId('contract-delete-button');
export const confirmDeleteContractButton = (page: Page) =>
	page.getByTestId('contract-delete-confirm');
export const contractEditButton = (page: Page) => page.getByTestId('contract-edit-button');
export const contractTenantLink = (page: Page) => page.getByTestId('contract-tenant-link');
export const contractApartmentLink = (page: Page) => page.getByTestId('contract-apartment-link');
export const contractStatementsLink = (page: Page) => page.getByTestId('contract-statements-link');
export const contractInvoicesLink = (page: Page) => page.getByTestId('contract-invoices-link');
