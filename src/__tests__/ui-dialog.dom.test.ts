import { describe, expect, it, vi } from 'vitest';
import { flushSync } from 'svelte';
import Dialog from '$lib/ui/Dialog.svelte';
import { byTestId, click, show } from './helpers/dom';
import { markup } from './helpers/snippet';

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

	it('macht die Seite dahinter unerreichbar, solange er offen ist', () => {
		const { opener } = openDialog();
		const dialog = document.querySelector('[role=dialog]')!;
		expect(opener.hasAttribute('inert')).toBe(true);
		expect(dialog.closest('[inert]')).toBeNull();

		press('Escape');
		expect(document.querySelector('[inert]')).toBeNull();
		expect(document.activeElement).toBe(opener);
	});

	it('setzt den Fokus auf "Abbrechen", damit nichts aus Versehen bestätigt wird', () => {
		openDialog();
		expect(document.activeElement).toBe(byTestId('dialog-cancel'));
	});

	it('hält den Fokus mit Tab im Dialog', () => {
		openDialog();
		byTestId('dialog-confirm')!.focus();
		press('Tab');
		expect(document.activeElement).toBe(byTestId('dialog-cancel'));
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

	it('lässt sich während der Arbeit nicht schliessen und behält den Fokus', () => {
		const { onclose } = openDialog({ busy: true, busyLabel: 'Wird versendet …' });
		const panel = document.querySelector<HTMLElement>('[role=dialog]')!;
		expect(document.activeElement).toBe(panel);
		press('Tab');
		expect(document.activeElement).toBe(panel);
		press('Escape');
		expect(onclose).not.toHaveBeenCalled();
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

	it('zeigt nichts, solange er geschlossen ist', () => {
		openDialog({ open: false });
		expect(document.querySelector('[role=dialog]')).toBeNull();
	});
});
