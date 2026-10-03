import type { Locator } from '@playwright/test';
import type { Actor } from '../fixtures/actor';

// Clicks a link that downloads a file and keeps the download for a later question
export const downloadFrom = (link: Locator) => async (actor: Actor) => {
	const download = actor.page.waitForEvent('download');
	await link.click();
	actor.remember('download', await download);
};
