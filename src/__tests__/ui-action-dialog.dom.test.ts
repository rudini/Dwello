import { describe, expect, it, vi } from 'vitest';

// enhance as SvelteKit wires it: the test plays the server's answer to the submit
const server = vi.hoisted(() => ({
	submit: null as null | ((input: { formData: FormData }) => unknown)
}));
vi.mock('$app/forms', () => ({
	enhance: (_form: unknown, submit: (input: { formData: FormData }) => unknown) => {
		server.submit = submit;
		return { destroy() {} };
	}
}));

import ActionDialog from '$lib/ui/ActionDialog.svelte';
import { byTestId, settle, show } from './helpers/dom';
import { markup } from './helpers/snippet';

async function answer(type: 'success' | 'failure' | 'redirect') {
	const after = server.submit!({ formData: new FormData() }) as (input: unknown) => Promise<void>;
	await after({ update: async () => {}, result: { type } });
	await settle();
}

function open(extra: Record<string, unknown> = {}) {
	const onsuccess = vi.fn();
	show(ActionDialog, {
		open: true,
		action: '?/delete',
		title: 'Mieter löschen?',
		confirmLabel: 'Mieter löschen',
		confirmTestid: 'tenant-delete-confirm',
		onsuccess,
		children: markup('<p>Der Mieter wird endgültig gelöscht.</p>'),
		...extra
	});
	return onsuccess;
}

describe('Bestätigung einer Seitenaktion', () => {
	it('sendet das Formular der Aktion', () => {
		open();
		const submitted = vi.fn((event: Event) => event.preventDefault());
		document.querySelector('form')!.addEventListener('submit', submitted);
		HTMLFormElement.prototype.requestSubmit ??= function (this: HTMLFormElement) {
			this.dispatchEvent(new Event('submit', { cancelable: true }));
		};
		byTestId('tenant-delete-confirm')!.click();
		expect(document.querySelector('form')!.getAttribute('action')).toBe('?/delete');
		expect(submitted).toHaveBeenCalledOnce();
	});

	it('schliesst nach Erfolg', async () => {
		const onsuccess = open();
		await answer('success');
		expect(document.querySelector('[role=dialog]')).toBeNull();
		expect(onsuccess).toHaveBeenCalledOnce();
	});

	// a delete leads to the list: it confirms there
	it('meldet den Erfolg auch, wenn die Aktion zu einer anderen Seite führt', async () => {
		const onsuccess = open();
		await answer('redirect');
		expect(onsuccess).toHaveBeenCalledOnce();
	});

	it('bleibt bei einer Ablehnung offen und nennt den Grund', async () => {
		const onsuccess = open({ error: 'Mieter mit Mietverträgen können nicht gelöscht werden.' });
		await answer('failure');
		expect(document.querySelector('[role=dialog]')).not.toBeNull();
		expect(byTestId('form-error')!.textContent).toContain('Mieter mit Mietverträgen');
		expect(onsuccess).not.toHaveBeenCalled();
	});

	// die Ablehnung steht unten im Dialog: sie bekommt den Fokus, auch in einem niedrigen Fenster
	it('setzt den Fokus auf den Grund einer Ablehnung', async () => {
		open({ error: 'Mieter mit Mietverträgen können nicht gelöscht werden.' });
		await answer('failure');
		expect(document.activeElement).toBe(byTestId('form-error'));
	});

	// Persona Anna K2 M1: in einem niedrigen Fenster lag der Ausweg unter dem sichtbaren Teil des Dialogs
	it('rollt den Ausweg nach einer Ablehnung ins Bild, der Grund bleibt sichtbar', async () => {
		const scrolled: string[] = [];
		// jsdom does not lay out, so it has no scrollIntoView
		Element.prototype.scrollIntoView = function (this: Element) {
			scrolled.push(this.id || this.getAttribute('data-testid')!);
		};
		open({
			error: 'Abgelehnt',
			afterError: markup('<div><button id="way-out">Entwurf löschen</button></div>')
		});
		await answer('failure');
		expect(scrolled).toEqual(['way-out', 'form-error']);
		delete (Element.prototype as Partial<Element>).scrollIntoView;
	});

	it('lässt nicht bestätigen, was nicht möglich ist', () => {
		open({ disabled: true });
		expect(byTestId<HTMLButtonElement>('tenant-delete-confirm')!.disabled).toBe(true);
	});
});
