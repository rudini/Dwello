import type { Page } from '@playwright/test';

export const comingSoonNotice = (page: Page) =>
	page.getByTestId('coming-soon').getByRole('heading', { level: 2 });
