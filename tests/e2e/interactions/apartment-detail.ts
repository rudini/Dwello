import type { Page } from '@playwright/test';

export const infoCard = (page: Page, info: 'status' | 'rooms' | 'floor' | 'area') =>
	page.getByTestId(`apartment-info-${info}`);
export const currentTenantName = (page: Page) => page.getByTestId('current-tenant-name');
export const tenantProfileButton = (page: Page) => page.getByTestId('current-tenant-profile');
export const monthlyTotal = (page: Page) => page.getByTestId('monthly-costs-total');
export const vacancyNote = (page: Page) => page.getByTestId('apartment-vacant');
export const editButton = (page: Page) => page.getByTestId('apartment-edit-button');
export const historyRows = (page: Page) => page.getByTestId('contract-history-row');
export const historyLink = (page: Page, tenantName: string) =>
	page.getByTestId('contract-history-link').filter({ hasText: tenantName });
