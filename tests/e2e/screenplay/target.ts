import type { Locator, Page } from '@playwright/test';

/** A named description of where something is on the page; interactions and web questions find it */
export type Target = { locate(page: Page): Locator; toString(): string };

export const target = (description: string, locate: (page: Page) => Locator): Target => ({
	locate,
	toString: () => description
});

// The page once its client JS has taken over: SSR pages only react to input after hydration
export const hydratedPage = target('die geladene Seite', (page) => page.locator('body[data-hydrated]'));
