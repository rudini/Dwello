import type { Page } from '@playwright/test';

// SSR pages only react to clicks once hydrated; network idle means the client JS has loaded.
export const visit = async (page: Page, path: string) => {
	await page.goto(path);
	await page.waitForLoadState('networkidle');
};

export const breadcrumbLink = (page: Page, label: string) =>
	page.getByTestId('breadcrumb-link').filter({ hasText: label });

// Opens a page with its client JS held back, so it stays server-rendered (not hydrated) until the returned function
// releases the JS and waits for it to load: what a user sees on a slow connection
export const visitWhileLoading = async (page: Page, path: string) => {
	let release!: () => void;
	const released = new Promise<void>((resolve) => (release = resolve));
	await page.route('**/*', async (route) => {
		if (route.request().resourceType() === 'script') await released;
		await route.continue();
	});
	await page.goto(path, { waitUntil: 'commit' });
	return async () => {
		release();
		await page.waitForLoadState('networkidle');
	};
};
