import type { Actor } from '../fixtures/actor';
import {
	footerLink,
	logo,
	mainNavLink,
	userMenuButton,
	userMenuSettings
} from '../interactions/app-frame';

export const chooseInMainNav = (label: string) => async (actor: Actor) => {
	await mainNavLink(actor.page, label).click();
};

export const chooseLogo = async (actor: Actor) => {
	await logo(actor.page).click();
};

export const openSettingsFromUserMenu = async (actor: Actor) => {
	await userMenuButton(actor.page).click();
	await userMenuSettings(actor.page).click();
};

export const chooseInFooter = (label: string) => async (actor: Actor) => {
	await footerLink(actor.page, label).click();
};
