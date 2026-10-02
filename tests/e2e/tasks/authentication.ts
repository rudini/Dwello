import type { Actor } from '../fixtures/actor';
import { googleSignIn, loginButton, logoutButton, userMenuButton } from '../interactions/authentication';

export const signInWith = (provider: string) => async (actor: Actor) => {
	actor.remember('Anmeldung bei Google', googleSignIn(actor.page));
	await loginButton(actor.page, provider).click();
};

export const signOut = async (actor: Actor) => {
	await userMenuButton(actor.page).click();
	await logoutButton(actor.page).click();
};
