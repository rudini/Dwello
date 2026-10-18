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

	// WebKit zeigt ein Bild sonst an, statt es zu speichern (#424); ein gewöhnlicher Link speichert nichts
	it('lässt die Datei eines Links auf Wunsch speichern statt anzeigen', () => {
		show(Button, {
			children: label,
			href: '/documents/d1/pdf',
			download: true,
			testid: 'save-file'
		});
		expect(byTestId('save-file')!.hasAttribute('download')).toBe(true);
		show(Button, { children: label, href: '/tenants/new', testid: 'go' });
		expect(byTestId('go')!.hasAttribute('download')).toBe(false);
	});

	it('öffnet einen Link auf Wunsch in einem neuen Tab und sagt es', () => {
		show(Button, {
			children: label,
			href: '/statements/s1/pdf?ansehen',
			target: '_blank',
			testid: 'go'
		});
		const link = byTestId('go')!;
		expect(link.getAttribute('target')).toBe('_blank');
		expect(link.getAttribute('rel')).toBe('noopener');
		expect(link.textContent).toContain('(öffnet in neuem Tab)');
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
