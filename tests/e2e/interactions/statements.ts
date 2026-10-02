import type { Page } from '@playwright/test';

export const statementRow = (page: Page, tenantName: string) =>
	page.getByTestId(/^statement-row-/).filter({ hasText: tenantName });
export const statementRowForYear = (page: Page, tenantName: string, year: number) =>
	statementRow(page, tenantName).filter({ hasText: `31.12.${year}` });
export const statementRows = (page: Page) => page.getByTestId(/^statement-row-/);
export const statementSearchInput = (page: Page) => page.getByTestId('statement-search-input');
export const statementBuildingFilter = (page: Page) => page.getByTestId('statement-building-filter');
export const statementSearchButton = (page: Page) => page.getByTestId('statement-search-submit');
export const draftFilter = (page: Page) => page.getByTestId('filter-draft');
export const nextPageLink = (page: Page) => page.getByTestId('pagination-next');
export const generateStatementsButton = (page: Page) => page.getByTestId('statements-generate-button');
export const openStatementLink = (page: Page, tenantName: string, year: number) =>
	statementRowForYear(page, tenantName, year).getByTestId('statement-view-link');
// Filters navigate on the client; the list is filtered once the URL carries them
export const filteredBy = (page: Page, filters: Record<string, string>) =>
	page.waitForURL((url) => Object.entries(filters).every(([key, value]) => url.searchParams.get(key) === value));
