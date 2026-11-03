import { error } from '@sveltejs/kit';
import { UI_GALLERY } from '$app/env/private';

// Every design-system component in every state, for the axe check (tests/a11y); off unless UI_GALLERY=on
export const load = () => {
	if (UI_GALLERY !== 'on') error(404, 'Not found');
};
