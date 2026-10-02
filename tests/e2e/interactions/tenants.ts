import type { Page } from '@playwright/test';

export const tenantSearchInput = (page: Page) => page.getByTestId('tenants-search-input');
export const tenantSearchButton = (page: Page) => page.getByTestId('tenants-search-submit');
export const newTenantButton = (page: Page) => page.getByTestId('tenants-new-button');
export const tenantCards = (page: Page) => page.getByTestId(/^tenant-card-/);
export const tenantCard = (page: Page, name: string) => tenantCards(page).filter({ hasText: name });
export const tenantStatusFilter = (page: Page) => page.getByTestId('tenants-status-filter');
export const tenantActiveBadge = (page: Page, name: string) => tenantCard(page, name).getByTestId('tenant-active');
