import type { Page } from '@playwright/test';

export const settingField = (page: Page, name: string) => page.getByTestId(`setting-${name}`);
export const saveSettingsButton = (page: Page) => page.getByTestId('settings-submit');
export const savedNotice = (page: Page) => page.getByTestId('settings-saved');
export const masterDataLink = (page: Page, label: string) =>
	page.getByTestId('quick-links').getByRole('link').filter({ hasText: label });
