import type { Page } from '@playwright/test';

export const loginButton = (page: Page, provider: string) => page.getByTestId(`login-${provider.toLowerCase()}`);
export const loginError = (page: Page) => page.getByTestId('login-error');
export const userName = (page: Page) => page.getByTestId('user-name');
export const userMenuButton = (page: Page) => page.getByTestId('user-menu-button');
export const logoutButton = (page: Page) => page.getByTestId('logout-button');

// Google itself is outside the test: only the request Dwello sends the browser to counts
export const googleSignIn = (page: Page) => page.waitForRequest(/^https:\/\/accounts\.google\.com\//);
