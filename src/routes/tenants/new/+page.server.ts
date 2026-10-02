import { saveTenant } from '$lib/server/tenant-form';
import type { Actions } from './$types';

export const actions: Actions = {
	default: ({ request, fetch }) => saveTenant(fetch, request)
};
