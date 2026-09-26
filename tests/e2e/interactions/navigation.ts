import type { Page } from '@playwright/test';

// SSR pages only react to clicks once hydrated; network idle means the client JS has loaded.
export const visit = async (page: Page, path: string) => {
	await page.goto(path);
	await page.waitForLoadState('networkidle');
};

export const breadcrumbLink = (page: Page, label: string) =>
	page.getByTestId('breadcrumb-link').filter({ hasText: label });
