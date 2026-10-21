import { getConfiguredProviders, PROVIDER_NAMES } from '$lib/server/oauth';
import { LOGIN_ERRORS } from '$lib/server/login-flow';
import { redirect } from '@sveltejs/kit';
import { insecureConnection, passwordAvailable, setupNeeded, signInWithPassword } from '$lib/server/password-login';
import type { Actions, PageServerLoad } from './$types';

// Signed-in users never get here (hooks.server.ts sends them to the dashboard)
export const load: PageServerLoad = async ({ url, fetch }) => {
	// a fresh installation is set up first (#577)
	if (await setupNeeded(fetch)) redirect(303, '/setup');
	const redirectTo = url.searchParams.get('redirectTo');
	const error = url.searchParams.get('error');
	return {
		password: await passwordAvailable(fetch),
		insecure: insecureConnection(url),
		redirectTo,
		providers: getConfiguredProviders().map((id) => ({
			id,
			name: PROVIDER_NAMES[id],
			href: `/auth/login?provider=${id}${redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ''}`
		})),
		error:
			error && Object.hasOwn(LOGIN_ERRORS, error)
				? LOGIN_ERRORS[error as keyof typeof LOGIN_ERRORS]
				: null
	};
};

export const actions: Actions = {
	password: async ({ request, cookies, fetch }) => signInWithPassword(fetch, cookies, await request.formData())
};
