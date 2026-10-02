import type { Actor } from '../fixtures/actor';
import type { Request } from '@playwright/test';
import { loginButton, loginError, userName } from '../interactions/authentication';

export const signInOption = (actor: Actor, provider: string) => loginButton(actor.page, provider);
export const loginHint = (actor: Actor) => loginError(actor.page);
export const shownUserName = (actor: Actor) => userName(actor.page);

// The Google sign-in request, with what Dwello sent along
export async function googleSignInRequest(actor: Actor) {
	const request = await actor.recall<Promise<Request>>('Anmeldung bei Google');
	return new URL(request.url()).searchParams;
}
