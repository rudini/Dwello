import { expect, test } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toContainText('Welcome to Dwello');
});
