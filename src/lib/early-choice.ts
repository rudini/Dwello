import type { Action } from 'svelte/action';

/**
 * Svelte resets a `<select value>` (also `bind:value`) to the server value when it hydrates, so a choice made
 * before the page was live is lost. Render the value as `selected` options instead, which hydration leaves alone,
 * and use this action: it hands the choice shown by the select on once the page is live.
 */
export const keepEarlyChoice: Action<HTMLSelectElement, (value: string) => void> = (
	select,
	choose
) => {
	choose(select.value);
};
