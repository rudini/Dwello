import type { Activity } from '../screenplay/actor';
import { Browser, Click, FailRequests, Navigate, Press, Wait } from '../screenplay/interactions';
import { Text } from '../screenplay/questions';
import { mobileMenuButton, text } from '../targets/accessibility';
import {
	errorPageToOverview,
	focusedUserMenuItem,
	footerLink,
	helpContentsLink,
	logo,
	mainNavLink,
	mobileNavLink,
	privacyLinkOnLogin,
	publicHelpLink,
	publicLoginLink,
	privacySectionLinkInTerms,
	termsLinkOnLogin,
	userMenuButton,
	userMenuSettings,
	glossaryExplanation
} from '../targets/app-frame';

export const chooseInMainNav = (label: string) => Click.on(mainNavLink(label));
export const chooseInMobileMenu = (label: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(mobileMenuButton), Click.on(mobileNavLink(label)));
export const chooseLogo = Click.on(logo);
export const openSettingsFromUserMenu: Activity = (actor) =>
	actor.attemptsTo(Click.on(userMenuButton), Click.on(userMenuSettings));
// #656: arrow keys, Home and End in the user menu
export const openUserMenuByKey = (key: string) => Press.theKey(key).on(userMenuButton);
export const pressInUserMenu = (key: string) => Press.theKey(key).on(focusedUserMenuItem);
export const chooseInFooter = (label: string) => Click.on(footerLink(label));
export const useWindowWidth = (width: number) => Browser.resizeTo({ width, height: 768 });
// #1182: «hell» or «dunkel», as the system setting asks the page
export const useAppearance = (appearance: string) => Browser.useColorScheme(appearance === 'dunkel' ? 'dark' : 'light');
export const openMobileMenu = Click.on(mobileMenuButton);
export const openTermsFromLogin = Click.on(termsLinkOnLogin);
export const openPrivacySectionFromTerms = (heading: string) => Click.on(privacySectionLinkInTerms(heading));
export const openPrivacyFromLogin = Click.on(privacyLinkOnLogin);
export const openLoginFromPublicPage = Click.on(publicLoginLink);
export const openHelpFromPublicPage = Click.on(publicHelpLink);
export const chooseInHelpContents = (label: string) => Click.on(helpContentsLink(label));

// From the error page to the overview while only the overview's data request fails (#519; as the axe state
// `server-error`, tasks/accessibility.ts)
export const goToOverviewWhileItFails: Activity = (actor) =>
	actor.attemptsTo(
		FailRequests.to('/dashboard/__data.json', { 'x-sveltekit-invalidated': '11' }),
		Click.on(errorPageToOverview),
		// the error page of the failed load, not the 404 page it came from
		Wait.until(text('Versuchen Sie es später erneut.'))
	);
export const goBackInBrowser = Browser.back;
// typed into the address bar: a full page load, so going back loads the page again or restores it (#680)
export const openOtherPageByAddress = Navigate.to('/');

/** #698: what the help's glossary says about a term, for a later comparison with a field's help */
export const GLOSSARY = 'glossary';
export const readInGlossary = (term: string): Activity => async (actor) => {
	await Navigate.to('/help')(actor);
	actor.remember(GLOSSARY, await actor.answer(Text.of(glossaryExplanation(term))));
};
