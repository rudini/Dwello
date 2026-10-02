import type { Page } from '@playwright/test';

export const rentalApartment = (page: Page) => page.getByTestId('tenant-rental-apartment');
export const rentalRent = (page: Page) => page.getByTestId('tenant-rental-rent');
export const rentalStart = (page: Page) => page.getByTestId('tenant-rental-start');
export const rentalApartmentLink = (page: Page) => page.getByTestId('tenant-rental-apartment-link');
export const editTenantButton = (page: Page) => page.getByTestId('tenant-edit-button');
export const newContractButton = (page: Page) => page.getByTestId('tenant-new-contract-button');
export const deleteTenantButton = (page: Page) => page.getByTestId('tenant-delete-button');
export const confirmDeleteTenantButton = (page: Page) => page.getByTestId('tenant-delete-confirm');
