import type { Page } from '@playwright/test';

export const apartmentRow = (page: Page, number: string) =>
	page.getByTestId(/^apartment-row-/).filter({ hasText: number });
export const deleteButton = (page: Page) => page.getByTestId('building-delete-button');
export const confirmDeleteButton = (page: Page) => page.getByTestId('building-delete-confirm');
export const editButton = (page: Page) => page.getByTestId('building-edit-button');
export const addApartmentButton = (page: Page) => page.getByTestId('apartment-add-button');
export const firstApartmentButton = (page: Page) => page.getByTestId('apartment-first-create-button');
export const addressLine = (page: Page) => page.getByTestId('building-address');
export const yearBuiltValue = (page: Page) => page.getByTestId('building-year-built');
