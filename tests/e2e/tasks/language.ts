import type { Activity } from '../screenplay/actor';
import { Browser, Click } from '../screenplay/interactions';
import { Visibility } from '../screenplay/questions';
import { mobileMenuButton } from '../targets/accessibility';
import { languageButton, languageOption } from '../targets/language';

// below 768 px the language choice stands in the menu (#657)
export const openLanguageChoiceInMenu: Activity = (actor) => actor.attemptsTo(Click.on(mobileMenuButton), Click.on(languageButton));
export const openLanguageChoice: Activity = async (actor) =>
	(await actor.answer(Visibility.of(languageButton))) ? actor.attemptsTo(Click.on(languageButton)) : actor.attemptsTo(openLanguageChoiceInMenu);

// The page reloads in the new language
export const chooseLanguage = (language: string): Activity => (actor) =>
	actor.attemptsTo(openLanguageChoice, Click.toReload(languageOption(language)));
export const chooseLanguageInMenu = (language: string): Activity => (actor) =>
	actor.attemptsTo(openLanguageChoiceInMenu, Click.toReload(languageOption(language)));

const acceptLanguage: Record<string, string> = {
	Englisch: 'en-GB,en;q=0.9',
	Französisch: 'fr-CH,fr;q=0.9',
	Spanisch: 'es-ES,es;q=0.9'
};

export const preferInTheBrowser = (language: string): Activity => Browser.preferLanguages(acceptLanguage[language]);
