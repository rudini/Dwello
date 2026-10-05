import type { Page } from '@playwright/test';

export const occupancyRow = (page: Page, building: string) =>
	page.getByTestId('occupancy-row').filter({ has: page.getByTestId('occupancy-building').getByText(building, { exact: true }) });
export const occupancyBuilding = (page: Page, building: string) => occupancyRow(page, building).getByTestId('occupancy-building');
export const occupancyRate = (page: Page, building: string) => occupancyRow(page, building).getByTestId('occupancy-rate');
export const occupancyCount = (page: Page, building: string) => occupancyRow(page, building).getByTestId('occupancy-count');
export const statTile = (page: Page, testId: string) => page.getByTestId(testId);
export const statementsTile = (page: Page, status: string) => page.getByTestId(`statements-${status}`);
export const headerAction = (page: Page, label: string) => page.getByTestId('dashboard-action').filter({ hasText: label });
export const quickAction = (page: Page, label: string) => page.getByTestId('quick-action').filter({ hasText: label });
// The filter a list page was opened with
export const listFilter = (page: Page, name: string) => new URL(page.url()).searchParams.get(name);
