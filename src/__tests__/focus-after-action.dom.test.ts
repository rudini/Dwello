import { describe, it, expect, beforeEach } from 'vitest';
import { noteFocus, refocus } from '$lib/ui/focus-after-action';

// #1096: the focus after an action that removed its control
describe('Fokus nach einer Aktion', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<h1 tabindex="-1">Kategorien</h1>
			<section><h2>Liste</h2><ul>
				<li><a href="/a">Abwasser</a><button data-testid="delete">Löschen</button></li>
				<li><a href="/b">Beleuchtung</a><button data-testid="delete">Löschen</button></li>
			</ul></section>
			<button data-testid="recalculate">Neu berechnen</button>`;
	});
	const focusOn = (part: HTMLElement) => {
		part.focus();
		noteFocus(part);
	};

	it('setzt den Fokus auf die nächste Zeile, wenn die Zeile gelöscht ist', () => {
		const [first] = document.querySelectorAll('li');
		focusOn(first.querySelector('button')!);
		first.remove();

		refocus();

		expect(document.activeElement!.textContent).toBe('Beleuchtung');
	});

	// SvelteKit puts the focus on the page itself after loading it again
	it('merkt sich die Zeile, auch wenn danach die Seite selbst den Fokus bekommt', () => {
		const [first] = document.querySelectorAll('li');
		focusOn(first.querySelector('button')!);
		noteFocus(document.body);
		first.remove();

		refocus();

		expect(document.activeElement!.textContent).toBe('Beleuchtung');
	});

	it('setzt den Fokus auf die Überschrift der Liste, wenn keine Zeile folgt', () => {
		const rows = document.querySelectorAll('li');
		focusOn(rows[1].querySelector('button')!);
		rows[1].remove();

		refocus();

		expect(document.activeElement!.textContent).toBe('Liste');
	});

	it('setzt den Fokus wieder auf ein Bedienelement, das neu gezeichnet wurde', () => {
		const old = document.querySelector<HTMLElement>('[data-testid="recalculate"]')!;
		focusOn(old);
		old.replaceWith(old.cloneNode(true));

		refocus();

		expect(document.activeElement!.getAttribute('data-testid')).toBe('recalculate');
	});
});
