import type { Activity } from '../screenplay/actor';
import { Browser, Click } from '../screenplay/interactions';
import { languageButton, languageOption } from '../targets/language';

// The page reloads in the new language
export const chooseLanguage = (language: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(languageButton), Click.toReload(languageOption(language)));

const acceptLanguage: Record<string, string> = {
	Englisch: 'en-GB,en;q=0.9',
	Französisch: 'fr-CH,fr;q=0.9',
	Spanisch: 'es-ES,es;q=0.9'
};

export const preferInTheBrowser = (language: string): Activity => Browser.preferLanguages(acceptLanguage[language]);
