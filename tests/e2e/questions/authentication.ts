import { question } from '../screenplay/actor';
import { Count, FocusedElement, RequestedUrl, Text, Value, Visibility } from '../screenplay/questions';
import { loginButton, loginError, loginLegalNote, passwordInput, passwordSubmitButton, userName } from '../targets/authentication';
import { GOOGLE_SIGN_IN } from '../tasks/authentication';

export const signInOffered = (provider: string) => Visibility.of(loginButton(provider));
export const signInOptions = (provider: string) => Count.of(loginButton(provider));
export const loginHint = Text.of(loginError);
export const passwordSignInOffered = Visibility.of(passwordSubmitButton);
export const shownUserName = Text.of(userName);
export const loginLegalText = Text.of(loginLegalNote);
export const enteredPassword = Value.of(passwordInput);
// once the hint is shown: SvelteKit's focus reset comes first, then the form moves the focus to it
export const focusOnLoginHint = question('whether the sign-in hint has the focus', async (actor) => {
	await actor.answer(loginHint);
	return (await actor.answer(FocusedElement)) === 'login-error';
});

/** A parameter Dwello sent along with the Google sign-in request */
export const googleSignInParameter = (name: string) =>
	question(`the parameter ${name} of the Google sign-in`, async (actor) =>
		(await actor.answer(RequestedUrl(GOOGLE_SIGN_IN)))?.searchParams.get(name) ?? null
	);
