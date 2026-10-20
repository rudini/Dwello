import type { Activity } from '../screenplay/actor';
import { Browser, Click } from '../screenplay/interactions';
import {
	footerLink,
	helpContentsLink,
	logo,
	mainNavLink,
	privacyLinkOnLogin,
	publicHelpLink,
	publicLoginLink,
	privacySectionLinkInTerms,
	termsLinkOnLogin,
	userMenuButton,
	userMenuSettings
} from '../targets/app-frame';

export const chooseInMainNav = (label: string) => Click.on(mainNavLink(label));
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
