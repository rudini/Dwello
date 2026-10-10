import type { Page } from '@playwright/test';

export const contractRow = (page: Page, tenantName: string) =>
	page.getByTestId(/^contract-row-/).filter({ hasText: tenantName });
export const contractRows = (page: Page) => page.getByTestId(/^contract-row-/);
export const contractSearchInput = (page: Page) => page.getByTestId('contract-search-input');
export const contractSearchButton = (page: Page) => page.getByTestId('contract-search-submit');
export const contractBuildingFilter = (page: Page) => page.getByTestId('contract-building-filter');
export const contractStatusFilter = (page: Page) => page.getByTestId('contract-status-filter');
export const newContractButton = (page: Page) => page.getByTestId('contract-new-button');
export const viewContractButton = (page: Page, tenantName: string) =>
	contractRow(page, tenantName).getByTestId('contract-view-button');
export const editContractButton = (page: Page, tenantName: string) =>
	contractRow(page, tenantName).getByTestId('contract-edit-button');
export const contractsEmptyNotice = (page: Page) => page.getByTestId('contracts-empty');
// An amount of a listed contract by its label ("Nettomiete", "Monatlich total")
export const contractAmount = (page: Page, tenantName: string, label: string) =>
	contractRow(page, tenantName).locator(`dt:text-is("${label}") + dd`);
