import type { Page } from '@playwright/test';

// The link text also holds the icon name, so match the label element exactly
export const mainNavLink = (page: Page, label: string) =>
	page.getByTestId('main-nav-link').filter({ has: page.getByText(label, { exact: true }) });
export const logo = (page: Page) => page.getByTestId('header-logo');
export const userMenuButton = (page: Page) => page.getByTestId('user-menu-button');
export const userMenuSettings = (page: Page) => page.getByTestId('user-menu-settings');
export const footerLink = (page: Page, label: string) =>
	page.getByTestId('footer-link').filter({ hasText: label });
export const pageSection = (page: Page, heading: string) =>
	page
		.getByTestId('page-section')
		.filter({ has: page.getByRole('heading', { name: heading, exact: true }) });
export const pageTitle = (page: Page) => page.getByRole('heading', { level: 1 });
/** How much wider the page is than the window: more than 0 means it scrolls sideways */
export const sidewaysOverflow = (page: Page) =>
	page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
