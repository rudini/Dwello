import { sessionCookies } from '../fixtures/session';
import type { Activity } from '../screenplay/actor';
import { Click, Cookies, NoticeRequest, Navigate } from '../screenplay/interactions';
import { userMenuButton } from '../targets/app-frame';
import { loginButton, logoutButton } from '../targets/authentication';

export const GOOGLE_SIGN_IN = 'Anmeldung bei Google';

// Google itself is outside the test: only the request Dwello sends the browser to counts
export const signInWith = (provider: string): Activity => (actor) =>
	actor.attemptsTo(NoticeRequest(/^https:\/\/accounts\.google\.com\//, GOOGLE_SIGN_IN), Click.on(loginButton(provider)));

export const signOut: Activity = (actor) => actor.attemptsTo(Click.on(userMenuButton), Click.on(logoutButton));

/** The session cookies of a session that ended a minute ago */
export const expireSession = (baseURL: string): Activity => async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(baseURL, Math.floor(Date.now() / 1000) - 60)));

// the session cookies are gone, the page in the browser stays as it is
export const loseSession = Cookies.clear;

export const signInAgain = (baseURL: string): Activity => async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(baseURL)), Navigate.to('/dashboard'));
