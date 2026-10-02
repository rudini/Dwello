import { waitLocale } from 'svelte-i18n';
import { initI18n } from '$lib/i18n';
import type { LayoutLoad } from './$types';

// Translations load asynchronously; pages render (also on the server) only once they are there
export const load: LayoutLoad = async ({ data }) => {
	initI18n();
	await waitLocale();
	return data;
};
