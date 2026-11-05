// Arrow keys, Home and End move between the items of a menu in the header (#656)
const moves: Record<string, (at: number, last: number) => number> = {
	ArrowDown: (at, last) => (at < last ? at + 1 : 0),
	ArrowUp: (at, last) => (at > 0 ? at - 1 : last),
	Home: () => 0,
	End: (_, last) => last
};

export const isMenuKey = (event: KeyboardEvent) => event.key in moves;

/** Moves the focus to the item the key leads to; from outside the items Down goes to the first, Up to the last */
export function moveInMenu(event: KeyboardEvent, items: HTMLElement[]) {
	items[
		moves[event.key](items.indexOf(document.activeElement as HTMLElement), items.length - 1)
	]?.focus();
}
