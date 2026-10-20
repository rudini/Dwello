import { question } from '../screenplay/actor';
import { Count, RequestedUrl, Text, Visibility } from '../screenplay/questions';
import { loginButton, loginError, loginLegalNote, userName } from '../targets/authentication';
import { GOOGLE_SIGN_IN } from '../tasks/authentication';

export const signInOffered = (provider: string) => Visibility.of(loginButton(provider));
export const signInOptions = (provider: string) => Count.of(loginButton(provider));
export const loginHint = Text.of(loginError);
export const shownUserName = Text.of(userName);
export const loginLegalText = Text.of(loginLegalNote);

/** A parameter Dwello sent along with the Google sign-in request */
export const googleSignInParameter = (name: string) =>
	question(`the parameter ${name} of the Google sign-in`, async (actor) =>
		(await actor.answer(RequestedUrl(GOOGLE_SIGN_IN)))?.searchParams.get(name) ?? null
	);
