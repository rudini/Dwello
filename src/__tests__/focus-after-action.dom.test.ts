import { describe, it, expect, beforeEach } from 'vitest';
import { focusSavedRow, noteFocus, refocus } from '$lib/focus-after-action';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';

// #1096: the focus after an action that removed its control
describe('Fokus nach einer Aktion', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<h1 tabindex="-1">Kategorien</h1>
			<section><h2>Liste</h2><ul>
				<li><a href="/a">Abwasser</a><button data-testid="delete">Löschen</button></li>
				<li><a href="/b">Beleuchtung</a><button data-testid="delete">Löschen</button></li>
			</ul></section>
			<section><h2>Zahlung</h2><button data-testid="settle">Übertrag ausgleichen</button></section>
			<button data-testid="recalculate">Neu berechnen</button>
			<div role="dialog"><button>Abbrechen</button></div>
			<div data-toast-region><button>Meldung schliessen</button></div>`;
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

	// #1123: the next row went away in the same reload; the row now in its place takes the focus, not the page title
	it('setzt den Fokus auf die Zeile, die jetzt an der Stelle steht, wenn auch die nächste Zeile weg ist', () => {
		const list = document.querySelector('ul')!;
		list.insertAdjacentHTML('beforeend', '<li><a href="/c">Cheminée</a></li>');
		const [first, second] = document.querySelectorAll('li');
		focusOn(first.querySelector('button')!);
		first.remove();
		second.remove();

		refocus();

		expect(document.activeElement!.textContent).toBe('Cheminée');
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

	// code review 1096 C-1: the dialog takes the focus while it works, and the action removes its opener
	it('merkt sich die Stelle vor einem Dialog und vor der Meldung, nicht in ihnen', () => {
		const [first] = document.querySelectorAll('li');
		focusOn(first.querySelector('button')!);
		focusOn(document.querySelector<HTMLElement>('[role="dialog"] button')!);
		focusOn(document.querySelector<HTMLElement>('[data-toast-region] button')!);
		first.remove();
		(document.activeElement as HTMLElement).blur();

		refocus();

		expect(document.activeElement!.textContent).toBe('Beleuchtung');
	});

	// code review 1096 C-2
	it('setzt den Fokus auf die Überschrift des Abschnitts, wenn sein Knopf verschwunden ist', () => {
		const settle = document.querySelector<HTMLElement>('[data-testid="settle"]')!;
		focusOn(settle);
		settle.remove();

		refocus();

		expect(document.activeElement!.textContent).toBe('Zahlung');
	});

	// #1124: back on the list after saving, the saved record's row has the focus, not the page title
	it('setzt den Fokus nach dem Speichern auf die Zeile des gespeicherten Eintrags in der Liste', () => {
		document.body.insertAdjacentHTML('afterbegin', '<a href="/b">Zurück zu Beleuchtung</a>');

		focusSavedRow('/b', { name: 'Abwasser' });

		expect(document.activeElement!.textContent).toBe('Beleuchtung');
	});

	// #1128: a new record's form links nowhere yet; its row is the one named as it was entered
	it('setzt den Fokus nach dem Erfassen auf die Zeile, die den neuen Namen trägt', () => {
		focusSavedRow('/neu', { name: ' Beleuchtung ' });

		expect(document.activeElement!.getAttribute('href')).toBe('/b');
	});

	// code review 1128 C-2, fallback review #1131: in fr/it/en the row shows the name in that language
	it('setzt den Fokus nach dem Erfassen in einer anderen Sprache auf die Zeile mit dem Namen in dieser Sprache', () => {
		overwriteGetLocale(() => 'fr');
		try {
			focusSavedRow('/neu', { name: 'Beleuchtung DE', nameFR: 'Beleuchtung' });
		} finally {
			overwriteGetLocale(() => baseLocale);
		}

		expect(document.activeElement!.getAttribute('href')).toBe('/b');
	});

	// code review 1128 C-1: the main menu and the breadcrumb are lists of links too, and they come first
	it('setzt den Fokus nach dem Erfassen nicht auf einen gleich benannten Link im Menü', () => {
		document.body.insertAdjacentHTML(
			'afterbegin',
			'<nav><ul><li><a href="/hilfe">Beleuchtung</a></li></ul></nav>'
		);

		focusSavedRow('/neu', { name: 'Beleuchtung' });

		expect(document.activeElement!.getAttribute('href')).toBe('/b');
	});

	it('setzt den Fokus nach einer neuen Seite auf den Seitentitel', () => {
		const [first] = document.querySelectorAll('li');
		focusOn(first.querySelector('button')!);
		history.pushState({}, '', '/andere-seite');
		first.remove();

		refocus();

		expect(document.activeElement!.textContent).toBe('Kategorien');
	});
});
