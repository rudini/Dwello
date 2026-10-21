import { sessionCookies } from '../fixtures/session';
import type { Activity } from '../screenplay/actor';
import { Click, Cookies, Enter, FailRequests, NoticeRequest, Navigate, Wait } from '../screenplay/interactions';
import { userMenuButton } from '../targets/app-frame';
import { loginButton, loginError, logoutButton, passwordEmailInput, passwordInput, passwordSubmitButton } from '../targets/authentication';

export const GOOGLE_SIGN_IN = 'Anmeldung bei Google';

// Google itself is outside the test: only the request Dwello sends the browser to counts
export const signInWith = (provider: string): Activity => (actor) =>
	actor.attemptsTo(NoticeRequest(/^https:\/\/accounts\.google\.com\//, GOOGLE_SIGN_IN), Click.on(loginButton(provider)));

// ends on the sign-in page: a step after it would otherwise race the sign-out's redirect (WebKit, #424)
export const signOut: Activity = (actor) =>
	actor.attemptsTo(Click.on(userMenuButton), Click.on(logoutButton), Wait.until(loginButton('Google')));

/** The session cookies of a session that ended a minute ago */
export const expireSession = (baseURL: string): Activity => async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(baseURL, Math.floor(Date.now() / 1000) - 60)));

/** A valid session of a Google account that is not in ALLOWED_EMAILS (#51) */
export const holdSessionWithoutAccess = (baseURL: string): Activity => async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(baseURL, undefined, 'fremd@example.com')));

// the session cookies are gone, the page in the browser stays as it is
export const loseSession = Cookies.clear;

export const signInAgain = (baseURL: string): Activity => async (actor) =>
	actor.attemptsTo(Cookies.add(await sessionCookies(baseURL)), Navigate.to('/dashboard'));

export const signInWithPassword = (email: string, password: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(email).into(passwordEmailInput), Enter.theValue(password).into(passwordInput), Click.on(passwordSubmitButton));

/** Wrong passwords one after the other, each refused before the next (the sign-in page answers each with its hint) */
export const failSignIns = (email: string, times: number): Activity => async (actor) => {
	for (let attempt = 1; attempt <= times; attempt++) {
		await actor.attemptsTo(Navigate.to('/login'), signInWithPassword(email, `falsch-${attempt}`), Wait.until(loginError));
	}
};

// the form action of the sign-in page answers 500, as when the backend cannot check the password
export const failPasswordCheck = FailRequests.to('/login', { '/password': '' });
