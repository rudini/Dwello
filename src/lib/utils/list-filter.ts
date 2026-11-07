import { goto } from '$app/navigation';
import { listSearchUrl } from '$lib/list-url';

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
	const searched = new URL(location.href).searchParams;
	for (const field of form.querySelectorAll<HTMLInputElement>('input[name]:not([type="hidden"])')) {
		field.value = searched.get(field.name) ?? '';
		field.dispatchEvent(new Event('input', { bubbles: true }));
	}
	const values = Object.fromEntries(
		[...new FormData(form)].map(([key, value]) => [key, String(value)])
	);
	goto(listSearchUrl(new URL(form.action).pathname, values), {
		keepFocus: true,
		noScroll: true,
		replaceState: true
	});
}
