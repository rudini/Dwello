import type { Locator, Page } from '@playwright/test';

/** A named description of where something is on the page; interactions and web questions find it */
export type Target = { locate(page: Page): Locator; toString(): string };

export const target = (description: string, locate: (page: Page) => Locator): Target => ({
	locate,
	toString: () => description
});
