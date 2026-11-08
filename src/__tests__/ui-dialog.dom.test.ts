import { describe, expect, it, vi } from 'vitest';
import { flushSync } from 'svelte';
import Dialog from '$lib/ui/Dialog.svelte';
import { byTestId, click, show } from './helpers/dom';
import { markup } from './helpers/snippet';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import it_ from '../../messages/it.json';

const consequence = markup('<p>Die Abrechnung wird als versendet markiert.</p>');
const press = (key: string, shiftKey = false) => {
	document.activeElement!.dispatchEvent(
		new KeyboardEvent('keydown', { key, shiftKey, bubbles: true })
	);
	flushSync();
};

function openDialog(extra: Record<string, unknown> = {}) {
	const opener = document.createElement('button');
	document.body.append(opener);
	opener.focus();
	const onconfirm = vi.fn();
	const onclose = vi.fn();
	show(Dialog, {
		open: true,
		title: 'Abrechnung versenden?',
		confirmLabel: 'Als versendet markieren',
		children: consequence,
		onconfirm,
		onclose,
		...extra
	});
	return { opener, onconfirm, onclose };
}

describe('Dialog', () => {
	it('ist ein modaler Dialog mit Titel und Folgen als Beschreibung', () => {
		openDialog();
		const dialog = document.querySelector('[role=dialog]')!;
		expect(dialog.getAttribute('aria-modal')).toBe('true');
		expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)!.textContent).toBe(
			'Abrechnung versenden?'
		);
		expect(
			document.getElementById(dialog.getAttribute('aria-describedby')!)!.textContent
		).toContain('als versendet markiert');
	});

	// #653: a screen reader read the whole content, warnings and lists included, as the description
	it('beschreibt sich mit dem ersten Absatz, nicht mit dem ganzen Inhalt', () => {
		openDialog({
			children: markup(
				'<div><p>Die Rechnung wird gelöscht.</p><div role="alert"><p>Schon abgerechnet.</p><ul><li>NK-1</li></ul></div></div>'
			)
		});
		const dialog = document.querySelector('[role=dialog]')!;
		const description = (dialog.getAttribute('aria-describedby') ?? '')
			.split(' ')
			.map((id) => document.getElementById(id)?.textContent)
			.join(' ');
		expect(description).toBe('Die Rechnung wird gelöscht.');
	});

	// Code-Review 653-1 C-4: the help of a field at the start is the field's description, not the dialog's
	it('nimmt den Hilfetext eines Felds nicht als Beschreibung', () => {
		openDialog({
			children: markup(
				'<div><label for="d">Datum</label><input id="d" aria-describedby="d-help" /><p id="d-help">Format TT.MM.JJJJ</p><p>Der Vertrag endet.</p></div>'
			)
		});
		const dialog = document.querySelector('[role=dialog]')!;
		expect(document.getElementById(dialog.getAttribute('aria-describedby')!)!.textContent).toBe(
			'Der Vertrag endet.'
		);
	});

	// Persona Sven 653 P-1: the date's words are a status that fills while typing, not the dialog's description
	it('nimmt eine Statuszeile eines Felds nicht als Beschreibung', () => {
		openDialog({
			children: markup(
				'<div><input id="d" /><p id="d-words" aria-live="polite"></p><p>Die Frist beachten.</p></div>'
			)
		});
		const dialog = document.querySelector('[role=dialog]')!;
		expect(document.getElementById(dialog.getAttribute('aria-describedby')!)!.textContent).toBe(
			'Die Frist beachten.'
		);
	});

	// Code-Review 653-1 C-3: Enter in a prefilled field would confirm an irreversible action at once
	it('beginnt einen gefährlichen Dialog mit Feldern auf dem Dialog selbst, Tab führt ins Feld', () => {
		openDialog({
			danger: true,
			children: markup(
				'<div><p>Die Abrechnung wird ersetzt.</p><input id="amount" value="10.00" /></div>'
			)
		});
		expect(document.activeElement!.getAttribute('role')).toBe('dialog');
		press('Tab');
		expect(document.activeElement!.id).toBe('amount');
	});

	it('hat ohne Absatz keine Beschreibung', () => {
		openDialog({ children: markup('<div><label>Datum <input /></label></div>') });
		expect(document.querySelector('[role=dialog]')!.hasAttribute('aria-describedby')).toBe(false);
	});

	it('macht die Seite dahinter unerreichbar, solange er offen ist', () => {
		const { opener } = openDialog();
		const dialog = document.querySelector('[role=dialog]')!;
		expect(opener.hasAttribute('inert')).toBe(true);
		expect(dialog.closest('[inert]')).toBeNull();

		press('Escape');
		expect(document.querySelector('[inert]')).toBeNull();
		expect(document.activeElement).toBe(opener);
	});

	// A toast raised while the dialog is open is still read out and can be closed
	it('lässt die Meldungen erreichbar', () => {
		const toastRegion = document.createElement('div');
		toastRegion.setAttribute('data-toast-region', '');
		document.body.append(toastRegion);
		openDialog();
		expect(toastRegion.hasAttribute('inert')).toBe(false);
	});

	// #669 (Sven P-4): the toasts stand inside the page frame, before the footer; the rest of the frame goes inert
	it('lässt die Meldungen im Seitenrahmen erreichbar und macht den Rest davon unerreichbar', () => {
		const frame = document.createElement('div');
		frame.innerHTML = '<main></main><div data-toast-region></div><footer></footer>';
		document.body.append(frame);
		openDialog();
		expect(frame.querySelector('[data-toast-region]')!.closest('[inert]')).toBeNull();
		expect(
			[...frame.querySelectorAll('main, footer')].map((part) => part.hasAttribute('inert'))
		).toEqual([true, true]);
	});

	it('setzt den Fokus auf "Abbrechen", damit nichts aus Versehen bestätigt wird', () => {
		openDialog();
		expect(document.activeElement).toBe(byTestId('dialog-cancel'));
	});

	// #653: with the focus on «Abbrechen», Tab reached the confirm button before the fields
	it('setzt den Fokus in das erste Feld, wenn der Dialog Felder hat', () => {
		openDialog({
			children: markup(
				'<div><input type="hidden" name="id" value="1" /><input id="disabled" disabled /><label>Vertragsende <input id="end" /></label><select id="kind"></select></div>'
			)
		});
		expect(document.activeElement!.id).toBe('end');
	});

	// #653 (R7-F2): pressing a button left the field, its error grew the dialog and the release missed the button
	it('lässt beim Drücken eines Knopfs den Fokus im Feld, damit kein Fehler den Knopf verschiebt', () => {
		openDialog();
		const pressed = ['dialog-confirm', 'dialog-cancel'].map((testid) => {
			const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
			byTestId(testid)!.dispatchEvent(press);
			return press.defaultPrevented;
		});
		expect(pressed).toEqual([true, true]);
	});

	// Code-Review 653-1 C-1: a field takes a two-digit year when it is left; the click must leave it before confirming
	it('verlässt das Feld beim Klick auf die Bestätigung, bevor sie ausgeführt wird', () => {
		const { onconfirm } = openDialog({ children: markup('<div><input id="end" /></div>') });
		let focusedAtConfirm: Element | null = null;
		onconfirm.mockImplementation(() => (focusedAtConfirm = document.activeElement));
		const confirm = byTestId('dialog-confirm')!;
		confirm.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
		click('dialog-confirm');
		expect(focusedAtConfirm).toBe(confirm);
	});

	it('hält den Fokus mit Tab im Dialog', () => {
		openDialog();
		byTestId('dialog-confirm')!.focus();
		press('Tab');
		expect(document.activeElement).toBe(byTestId('dialog-cancel'));
		press('Tab', true);
		expect(document.activeElement).toBe(byTestId('dialog-confirm'));
	});

	// #751 (persona Sven 743 P-2): «Mehr dazu» at «Leistungszeitraum» in «Rechnungen hochladen» was skipped by Tab
	it('führt mit Tab auch zur Zusammenfassung eines Bereichs zum Aufklappen', () => {
		openDialog({
			children: markup(
				'<div><button id="before">Kalender</button><details><summary id="more">Mehr dazu</summary><p>Text</p></details></div>'
			)
		});
		document.getElementById('before')!.focus();
		press('Tab');
		expect(document.activeElement!.id).toBe('more');
		press('Tab', true);
		expect(document.activeElement!.id).toBe('before');
	});

	// Persona Sven K2 B1: eine Ablehnung mit Link und Formular, die erst nach dem Öffnen erscheint
	it('führt mit Tab von einer Meldung weiter und überspringt verborgene Felder', () => {
		openDialog({
			children: markup(
				'<div><div role="alert" tabindex="-1" id="alert">Abgelehnt</div><a href="/s/1" id="link">Entwurf</a>' +
					'<form><input type="hidden" name="id" value="1" /><button id="delete">Löschen</button></form></div>'
			)
		});
		document.getElementById('alert')!.focus();
		press('Tab');
		expect(document.activeElement!.id).toBe('link');
		press('Tab');
		expect(document.activeElement!.id).toBe('delete');
		document.getElementById('alert')!.focus();
		press('Tab', true);
		expect(document.activeElement).toBe(byTestId('dialog-confirm'));
	});

	it('holt den Fokus mit Tab in den Dialog zurück, wenn er draussen liegt', () => {
		const { opener } = openDialog();
		opener.focus();
		press('Tab');
		expect(document.activeElement).toBe(byTestId('dialog-cancel'));
	});

	it('schliesst mit Escape und gibt den Fokus zurück', () => {
		const { opener, onclose } = openDialog();
		press('Escape');
		expect(onclose).toHaveBeenCalledOnce();
		expect(document.activeElement).toBe(opener);
	});

	it('bestätigt mit dem Verb der Aktion', () => {
		const { onconfirm } = openDialog();
		expect(byTestId('dialog-confirm')!.textContent).toContain('Als versendet markieren');
		click('dialog-confirm');
		expect(onconfirm).toHaveBeenCalledOnce();
	});

	// #677 (decision 10): the focus stays on the confirm button, which says what is being done
	it('lässt sich während der Arbeit nicht schliessen und behält den Fokus auf dem Bestätigen', () => {
		const { onclose } = openDialog({ busy: true, busyLabel: 'Wird versendet …' });
		const confirm = byTestId('dialog-confirm');
		expect(document.activeElement).toBe(confirm);
		press('Tab');
		expect(document.activeElement).toBe(confirm);
		press('Escape');
		expect(onclose).not.toHaveBeenCalled();
	});

	// #1209 (persona Helga P-2): a disabled cancel faded beside the busy confirm and made that one look pressable
	it('lässt «Abbrechen» während der Arbeit aussehen wie sonst, ein Klick darauf tut nichts', () => {
		const { onclose } = openDialog({ busy: true, busyLabel: 'Wird versendet …' });
		const cancel = byTestId<HTMLButtonElement>('dialog-cancel')!;
		expect(cancel.disabled).toBe(false);
		click(cancel);
		expect(onclose).not.toHaveBeenCalled();
		expect(document.activeElement).toBe(byTestId('dialog-confirm'));
	});

	// #1261 (Helga P-1, Sven P-1): a sentence says why «Abbrechen» does nothing; a screen reader hears it unavailable
	it('sagt während der Arbeit, warum «Abbrechen» nichts tut, und meldet es einem Screenreader als nicht verfügbar', () => {
		openDialog({ busy: true, busyLabel: 'Wird versendet …' });
		const cancel = byTestId('dialog-cancel')!;
		const note = byTestId('dialog-busy-note')!;
		expect(cancel.getAttribute('aria-disabled')).toBe('true');
		expect(cancel.getAttribute('aria-describedby')).toBe(note.id);
		expect(note.textContent?.trim()).toBe(
			'Dwello führt die Aktion gerade aus. Abbrechen ist nicht mehr möglich.'
		);
	});

	// #1261: the wording of fach-review docs/reviews/1261-fachreview-1.md, in every language
	it('sagt den Satz zur laufenden Aktion in jeder Sprache im Wortlaut der Fachprüfung', () => {
		expect([fr, it_, en].map((messages) => messages.ui_dialog_busy_note)).toEqual([
			'Dwello est en train d’exécuter l’action. Il n’est plus possible d’annuler.',
			'Dwello sta eseguendo l’azione. Non è più possibile annullare.',
			'Dwello is carrying out the action. Cancelling is no longer possible.'
		]);
	});

	it('zeigt ohne Arbeit keinen Satz dazu und meldet «Abbrechen» als verfügbar', () => {
		openDialog();
		expect(byTestId('dialog-cancel')!.getAttribute('aria-disabled')).toBeNull();
		expect(byTestId('dialog-busy-note')).toBeNull();
	});

	it('schliesst mit Escape auch, wenn der Fokus nicht im Dialog liegt', () => {
		const { onclose } = openDialog();
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		flushSync();
		expect(onclose).toHaveBeenCalledOnce();
	});

	it('lässt nicht bestätigen, was nicht möglich ist, aber abbrechen', () => {
		const { onconfirm, onclose } = openDialog({ confirmDisabled: true });
		expect(byTestId<HTMLButtonElement>('dialog-confirm')!.disabled).toBe(true);
		click('dialog-cancel');
		expect(onconfirm).not.toHaveBeenCalled();
		expect(onclose).toHaveBeenCalledOnce();
	});

	// #1167: a refused action shows no faded button, which a beginner reads as «not yet»
	it('bietet nur «Schliessen» an, wenn die Aktion nicht möglich ist', () => {
		const { onconfirm, onclose } = openDialog({ impossible: true, children: markup('<input id="x" />') });
		expect(byTestId('dialog-confirm')).toBeNull();
		expect(byTestId('dialog-cancel')!.textContent!.trim()).toBe('Schliessen');
		document.getElementById('x')!.focus();
		press('Enter');
		expect(onconfirm).not.toHaveBeenCalled();
		click('dialog-cancel');
		expect(onclose).toHaveBeenCalledOnce();
	});

	it('zeigt nichts, solange er geschlossen ist', () => {
		openDialog({ open: false });
		expect(document.querySelector('[role=dialog]')).toBeNull();
	});

	// Enter in einem Feld bestätigt, aber nicht, wenn die Aktion gesperrt ist
	it('bestätigt mit Enter in einem Feld nur, wenn die Aktion möglich ist', () => {
		for (const confirmDisabled of [false, true]) {
			document.body.innerHTML = '';
			const { onconfirm } = openDialog({ confirmDisabled, children: markup('<input id="x" />') });
			document.getElementById('x')!.focus();
			press('Enter');
			expect(onconfirm, String(confirmDisabled)).toHaveBeenCalledTimes(confirmDisabled ? 0 : 1);
		}
	});

	it('fragt vor dem Schliessen nach, wenn der Inhalt verloren ginge', () => {
		const onrequestclose = vi.fn();
		openDialog({ onrequestclose });
		click('dialog-cancel');
		press('Escape');
		expect(onrequestclose).toHaveBeenCalledTimes(2);
		expect(document.querySelector('[role=dialog]')).not.toBeNull();
	});

	it('bestätigt mit Enter in einem Feld nicht, wenn der Dialog viele Einträge hält', () => {
		const { onconfirm } = openDialog({ enterConfirms: false, children: markup('<input data-testid="feld" />') });
		byTestId('feld')!.focus();
		press('Enter');
		expect(onconfirm).not.toHaveBeenCalled();
	});

	it('überlässt die Tasten einem Dialog, der darüber geöffnet ist', () => {
		const { onclose } = openDialog();
		document.querySelector('[role=dialog]')!.parentElement!.setAttribute('inert', '');
		press('Escape');
		expect(onclose).not.toHaveBeenCalled();
	});

	it('springt mit Tab über gesperrte Felder hinweg an den Anfang zurück', () => {
		openDialog({ children: markup('<select data-testid="erstes"></select><input disabled data-testid="gesperrt" />') });
		byTestId('dialog-confirm')!.focus();
		press('Tab');
		expect(document.activeElement).toBe(byTestId('erstes'));
		press('Tab');
		expect(document.activeElement).toBe(byTestId('dialog-cancel'));
	});

	it('beschreibt einen breiten Dialog mit vielen Einträgen nicht mit seinem ganzen Inhalt', () => {
		openDialog({ wide: true });
		expect(document.querySelector('[role=dialog]')!.hasAttribute('aria-describedby')).toBe(false);
	});
});

