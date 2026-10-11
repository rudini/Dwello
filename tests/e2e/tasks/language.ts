import type { Actor } from '../fixtures/actor';
import { languageButton, languageOption } from '../interactions/language';

// The page reloads in the new language; wait until it is hydrated again
export const chooseLanguage = (language: string) => async (actor: Actor) => {
	await languageButton(actor.page).click();
	await Promise.all([actor.page.waitForEvent('load'), languageOption(actor.page, language).click()]);
	await actor.page.locator('body[data-hydrated]').waitFor({ state: 'attached' });
};
