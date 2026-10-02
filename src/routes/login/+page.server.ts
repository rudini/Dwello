import { getConfiguredProviders } from '$lib/server/oauth';
import { LOGIN_ERRORS } from '$lib/server/login-flow';
import type { PageServerLoad } from './$types';

const NAMES = { google: 'Google', microsoft: 'Microsoft' };

// Signed-in users never get here (hooks.server.ts sends them to the dashboard)
export const load: PageServerLoad = ({ url }) => {
	const redirectTo = url.searchParams.get('redirectTo');
	const error = url.searchParams.get('error');
	return {
		providers: getConfiguredProviders().map((id) => ({
			id,
			name: NAMES[id],
			href: `/auth/login?provider=${id}${redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ''}`
		})),
		error: error && Object.hasOwn(LOGIN_ERRORS, error) ? LOGIN_ERRORS[error as keyof typeof LOGIN_ERRORS] : null
	};
};
