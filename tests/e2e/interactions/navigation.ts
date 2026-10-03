import type { Page } from '@playwright/test';

// SSR pages only react to input once hydrated; hydration resets fields changed before it (seen on WebKit in CI)
export const visit = async (page: Page, path: string) => {
	await page.goto(path);
	await page.locator('body[data-hydrated]').waitFor({ state: 'attached' });
};

export const breadcrumbLink = (page: Page, label: string) =>
	page.getByTestId('breadcrumb-link').filter({ hasText: label });
