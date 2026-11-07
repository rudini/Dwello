import { goto } from '$app/navigation';
import { listSearchUrl } from '$lib/list-url';

/**
 * A list's filter select applies on change, without «Suchen» (#662): the form as it stands, typed text included,
 * starting at the first page; the focus stays in the select (#677). Text fields still wait for «Suchen» or Enter.
 */
export function applyFilterChoice(event: Event & { currentTarget: HTMLFormElement }) {
	if (!(event.target instanceof HTMLSelectElement)) return;
	const form = event.currentTarget;
	const values = Object.fromEntries(
		[...new FormData(form)].map(([key, value]) => [key, String(value)])
	);
	goto(listSearchUrl(new URL(form.action).pathname, values), { keepFocus: true, noScroll: true });
}
