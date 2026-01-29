import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { When, Then } = createBdd(test);

// ============================================
// When steps
// ============================================

When('I open the config page', async ({ page }) => {
	await page.goto('/config');
	await page.waitForLoadState('networkidle');
});

When('I click the {string} quick link', async ({ page }, linkText: string) => {
	const currentUrl = page.url();
	await page.getByRole('link', { name: linkText }).click();
	// Wait for URL to change
	await page.waitForFunction(
		(prevUrl) => window.location.href !== prevUrl,
		currentUrl,
		{ timeout: 10000 }
	);
	await page.waitForLoadState('domcontentloaded');
});

When('I select {string} as the default heating profile', async ({ page }, profileName: string) => {
	const select = page.locator('#heatingProfile');
	// Find the option that contains the profile name
	const options = await select.locator('option').all();
	for (const option of options) {
		const text = await option.textContent();
		if (text?.includes(profileName)) {
			const value = await option.getAttribute('value');
			if (value) {
				await select.selectOption(value);
				break;
			}
		}
	}
});

When('I change the management fee to {string}', async ({ page }, value: string) => {
	const input = page.locator('#managementFee');
	await input.fill(value);
});

// ============================================
// Then steps
// ============================================

Then('I should see the config page', async ({ page }) => {
	// Use level 1 to match the main page heading specifically
	await expect(page.getByRole('heading', { name: 'Einstellungen', level: 1 })).toBeVisible({ timeout: 10000 });
});

Then('I should see the quick links section', async ({ page }) => {
	// Use exact matches or first() to avoid duplicates in descriptions
	await expect(page.getByText('Kategorien').first()).toBeVisible({ timeout: 10000 });
	await expect(page.getByText('Heizprofile').first()).toBeVisible({ timeout: 10000 });
	await expect(page.getByText('Verteilschlüssel').first()).toBeVisible({ timeout: 10000 });
});

Then('I should see the company info section', async ({ page }) => {
	// Use heading role to be specific
	await expect(page.getByRole('heading', { name: /Unternehmensdaten/ })).toBeVisible({ timeout: 10000 });
});

Then('I should see the accounting settings section', async ({ page }) => {
	await expect(page.getByRole('heading', { name: /Abrechnungseinstellungen/ })).toBeVisible({ timeout: 10000 });
});

Then('I should see the default values section', async ({ page }) => {
	await expect(page.getByRole('heading', { name: /Standardwerte/ })).toBeVisible({ timeout: 10000 });
});

Then('I should be on the categories page', async ({ page }) => {
	expect(page.url()).toContain('/config/categories');
});

Then('I should be on the distribution keys page', async ({ page }) => {
	expect(page.url()).toContain('/config/distribution-keys');
});

Then('the heating profile dropdown should have options', async ({ page }) => {
	const select = page.locator('#heatingProfile');
	await expect(select).toBeVisible({ timeout: 10000 });
	const options = await select.locator('option').count();
	expect(options).toBeGreaterThan(1);
});

Then('I should see {string} in the dropdown', async ({ page }, optionText: string) => {
	const select = page.locator('#heatingProfile');
	const optionExists = await select.locator(`option:has-text("${optionText}")`).count();
	expect(optionExists).toBeGreaterThan(0);
});

Then('the {string} option should be enabled', async ({ page }, optionText: string) => {
	const select = page.locator('#heatingProfile');
	const option = select.locator(`option:has-text("${optionText}")`).first();
	const disabled = await option.getAttribute('disabled');
	expect(disabled).toBeNull();
});

Then('the {string} option should be disabled', async ({ page }, optionText: string) => {
	const select = page.locator('#heatingProfile');
	const option = select.locator(`option:has-text("${optionText}")`).first();
	const disabled = await option.getAttribute('disabled');
	expect(disabled).not.toBeNull();
});

Then('the disabled option should show {string}', async ({ page }, text: string) => {
	const select = page.locator('#heatingProfile');
	const disabledOption = select.locator('option[disabled]').first();
	const optionText = await disabledOption.textContent();
	expect(optionText).toContain(text);
});

Then('the heating profile dropdown should show {string} selected', async ({ page }, profileName: string) => {
	const select = page.locator('#heatingProfile');
	const selectedValue = await select.inputValue();
	expect(selectedValue).not.toBe('');
});

Then('the save button should be disabled', async ({ page }) => {
	const saveButton = page.getByRole('button', { name: /Einstellungen speichern/ });
	await expect(saveButton).toBeDisabled({ timeout: 10000 });
});

Then('the save button should be enabled', async ({ page }) => {
	const saveButton = page.getByRole('button', { name: /Einstellungen speichern/ });
	await expect(saveButton).toBeEnabled({ timeout: 10000 });
});

Then('I should see the unsaved changes indicator', async ({ page }) => {
	await expect(page.getByText('Ungespeicherte Änderungen')).toBeVisible({ timeout: 10000 });
});
