import type { Activity } from '../screenplay/actor';
import { Browser, Click, FailRequests, Wait } from '../screenplay/interactions';
import { mobileMenuButton, text } from '../targets/accessibility';
import {
	errorPageToOverview,
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
	userMenuSettings
} from '../targets/app-frame';

export const chooseInMainNav = (label: string) => Click.on(mainNavLink(label));
export const chooseInMobileMenu = (label: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(mobileMenuButton), Click.on(mobileNavLink(label)));
export const chooseLogo = Click.on(logo);
export const openSettingsFromUserMenu: Activity = (actor) =>
	actor.attemptsTo(Click.on(userMenuButton), Click.on(userMenuSettings));
export const chooseInFooter = (label: string) => Click.on(footerLink(label));
export const useWindowWidth = (width: number) => Browser.resizeTo({ width, height: 768 });
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
