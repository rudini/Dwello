import type { Activity } from '../screenplay/actor';
import { Browser, Click } from '../screenplay/interactions';
import { languageButton, languageOption } from '../targets/language';

// The page reloads in the new language
export const chooseLanguage = (language: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(languageButton), Click.toReload(languageOption(language)));

export const preferEnglishInTheBrowser = Browser.preferLanguages('en-GB,en;q=0.9');
