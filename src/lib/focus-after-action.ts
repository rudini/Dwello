// #1096: where the focus goes when an action removed the control that had it. The page stays where the
// landlord was: the next row of the same list, without one the list's heading; a control drawn anew keeps it.
// Only after a new page does the focus go to the page title.

type Place = {
	path: string;
	part: Element;
	row: Element | null;
	next: Element | null;
	index: number;
	list: Element | null;
	section: Element | null;
};
let before: Place | null = null;

/** Notes where the focus is, from a `focusin` on the window */
export function noteFocus(part: Element): void {
	// the page itself (after SvelteKit loaded it again), a dialog that works or the confirmation: no place of their own
	if (part === document.body || part.closest('[role="dialog"], [data-toast-region]')) return;
	const row = part.closest('li, tr');
	before = {
		path: location.pathname,
		part,
		row,
		next: row?.nextElementSibling ?? null,
		index: row?.parentElement ? [...row.parentElement.children].indexOf(row) : -1,
		list: row?.parentElement ?? null,
		section: part.closest('section')
	};
}

const focusable = 'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea';

function headingOf(part: Element | null): HTMLElement | null {
	const heading = part?.isConnected
		? part.closest('section')?.querySelector<HTMLElement>('h2, h3')
		: null;
	if (heading && !heading.hasAttribute('tabindex')) heading.tabIndex = -1;
	return heading ?? null;
}

/** Moves the focus on when the action left it on nothing */
export function refocus(): void {
	if (document.activeElement !== document.body) return;
	const title = document.querySelector<HTMLElement>('h1[tabindex="-1"]');
	const at = before;
	if (!at || at.path !== location.pathname) return title?.focus();
	const testid = at.part.getAttribute('data-testid');
	// #1123: the next row may have gone in the same reload; then the row now in the removed one's place
	const next = at.next?.isConnected
		? at.next
		: at.list?.isConnected
			? at.list.children[at.index]
			: null;
	const target =
		at.row && !at.row.isConnected
			? next?.querySelector<HTMLElement>(focusable) || headingOf(at.list)
			: (testid && document.querySelector<HTMLElement>(`[data-testid="${CSS.escape(testid)}"]`)) ||
				headingOf(at.section);
	(target || title)?.focus({ preventScroll: true });
}

/** #1124: after a save that returned to a list, the focus goes to the saved record's row, the one linking to its form */
export function focusRowLinkingTo(path: string): void {
	[...document.querySelectorAll<HTMLElement>(`a[href="${CSS.escape(path)}"]`)]
		.find((link) => link.closest('li, tr'))
		?.focus();
}
