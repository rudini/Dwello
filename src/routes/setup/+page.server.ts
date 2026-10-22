import { redirect } from '@sveltejs/kit';
import { setupState, setUpDwello } from '$lib/server/password-login';
import type { Actions, PageServerLoad } from './$types';

// The setup on the first visit (#577); once there is an account or a provider, the sign-in page instead
export const load: PageServerLoad = async ({ fetch }) => {
	const { needed, kiChoice } = await setupState(fetch);
	if (!needed) redirect(303, '/login');
	return { kiChoice };
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) =>
		setUpDwello(fetch, cookies, await request.formData())
};
