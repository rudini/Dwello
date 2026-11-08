import { afterNavigate, goto } from '$app/navigation';
import { listSearchUrl } from '$lib/list-url';
import { onMount } from 'svelte';
import { on } from 'svelte/events';

// The text fields show the search of the address again; bound state follows through the input event
function showSearched(form: HTMLFormElement) {
	const searched = new URL(location.href).searchParams;
	for (const field of form.querySelectorAll<HTMLInputElement>('input[name]:not([type="hidden"])')) {
		field.value = searched.get(field.name) ?? '';
		field.dispatchEvent(new Event('input', { bubbles: true }));
	}
}

/**
 * The filter form shows exactly the filter the list applies (product owner, #680): after every navigation, also to
 * the same address, and when the browser shows the page again (from its cache, or a reload by back or forward that
 * restores typed text), a text typed but not searched is dropped. Called while the form's component starts.
 */
export function showAppliedFilter(form: () => HTMLFormElement | undefined) {
	const reset = () => {
		const shown = form();
		if (shown) showSearched(shown);
	};
	const backOrForward = () =>
		(performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
			?.type === 'back_forward';
	// the first view keeps a text typed before the app reacted (#754), unless the browser restored it
	afterNavigate((navigation) => {
		if (navigation.type !== 'enter' || backOrForward()) reset();
	});
	onMount(() => on(window, 'pageshow', (event) => event.persisted && reset()));
}

/**
 * A list's filter select applies on change, without «Suchen» (#662): with the other choices and the search already
 * made; a text typed but not searched is not sent and gives way to that search (product owner after persona Helga
 * H-1, #680). It starts at the first page; the focus stays in the select (#677). It replaces the address, so the
 * arrow keys add no entries to the history (persona Sven S-2). Text fields still wait for «Suchen» or Enter.
 */
export function applyFilterChoice(event: Event & { currentTarget: HTMLFormElement }) {
	if (!(event.target instanceof HTMLSelectElement)) return;
	// the focus stays here also after a choice that did not focus the select (persona Helga H-2): the layout then
	// moves it to the result, and the page jumped away from the filters
	event.target.focus({ preventScroll: true });
	const form = event.currentTarget;
	showSearched(form);
	const values = Object.fromEntries(
		[...new FormData(form)].map(([key, value]) => [key, String(value)])
	);
	goto(listSearchUrl(new URL(form.action).pathname, values), {
		keepFocus: true,
		noScroll: true,
		replaceState: true
	});
}
