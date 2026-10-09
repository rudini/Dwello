import { describe, expect, it, vi } from 'vitest';
import Button from '$lib/ui/Button.svelte';
import { byTestId, click, show } from './helpers/dom';
import { markup } from './helpers/snippet';

const label = markup('<span>Speichern</span>');

describe('Button', () => {
	it('ist ein Knopf vom Typ button, der beim Klicken handelt', () => {
		const onclick = vi.fn();
		show(Button, { children: label, onclick, testid: 'save' });
		const button = byTestId('save')!;
		expect(button.tagName).toBe('BUTTON');
		expect(button.getAttribute('type')).toBe('button');
		click(button);
		expect(onclick).toHaveBeenCalledOnce();
	});

	it('wird mit href zum Link', () => {
		show(Button, { children: label, href: '/tenants/new', testid: 'go' });
		expect(byTestId('go')!.getAttribute('href')).toBe('/tenants/new');
	});

	it('sagt während des Speicherns, dass es arbeitet, und lässt sich nicht erneut auslösen', () => {
		const onclick = vi.fn();
		show(Button, {
			children: label,
			busy: true,
			busyLabel: 'Wird gespeichert …',
			onclick,
			testid: 'save'
		});
		const button = byTestId<HTMLButtonElement>('save')!;
		expect(button.textContent).toContain('Wird gespeichert …');
		expect(button.getAttribute('aria-busy')).toBe('true');
		expect(button.disabled).toBe(true);
	});

	it('zeigt ein Symbol vor der Beschriftung, ohne es vorzulesen', () => {
		show(Button, { children: label, icon: 'check', testid: 'save' });
		expect(byTestId('save')!.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
	});

	it('ist als deaktivierter Link kein Link mehr', () => {
		show(Button, { children: label, href: '/x', disabled: true, testid: 'go' });
		expect(byTestId('go')!.tagName).toBe('BUTTON');
	});
});
