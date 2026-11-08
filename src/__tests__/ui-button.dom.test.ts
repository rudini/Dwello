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
		expect(link.getAttribute('rel')).toBe('noopener noreferrer');
		expect(link.textContent).toContain('(öffnet in neuem Tab)');
	});

	// #677 (persona Sven P-3): a disabled button loses the focus to <body>; aria-disabled keeps it on the button
	it('sagt während des Speicherns, dass es arbeitet, behält den Fokus und lässt sich nicht erneut auslösen', () => {
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
		expect(button.getAttribute('aria-disabled')).toBe('true');
		expect(button.disabled).toBe(false);
		button.focus();
		expect(document.activeElement).toBe(button);
		click(button);
		expect(onclick).not.toHaveBeenCalled();
	});

	// #1182 (persona Helga P-11): opacity made «Bitte warten …» hard to read at 150 % zoom; the grey of a disabled field
	// (ink-muted on sunken, ≥ 7:1 in tokens.test.ts) keeps it readable and still looks unavailable
	it.each(['primary', 'secondary', 'ghost', 'danger', 'danger-ghost'] as const)(
		'ist während des Arbeitens als %s grau wie ein gesperrtes Feld, ohne Transparenz und ohne Hover',
		(variant) => {
			show(Button, { children: label, variant, busy: true, testid: 'save' });
			const classes = byTestId('save')!.className.split(/\s+/);
			expect(classes).toEqual(
				expect.arrayContaining([
					'bg-sunken',
					'text-ink-muted',
					'border-line-strong',
					'cursor-progress'
				])
			);
			// disabled: does not apply, a busy button is not disabled (above)
			expect(
				classes.filter(
					(name) =>
						!name.startsWith('disabled:') && (name.includes('opacity') || name.startsWith('hover:'))
				)
			).toEqual([]);
		}
	);

	// #1209 (persona Helga P-1): the label alone did not show it is locked; the sign is decorative, the status speaks
	it('zeigt während des Arbeitens vor der Beschriftung ein Fortschrittszeichen, das sich nur ohne reduzierte Bewegung dreht', () => {
		show(Button, { children: label, busy: true, busyLabel: 'Wird gespeichert …', testid: 'save' });
		const button = byTestId('save')!;
		const sign = byTestId('save-busy-indicator')!;
		expect(button.firstElementChild).toBe(sign);
		expect(sign.nextSibling?.textContent?.trim()).toBe('Wird gespeichert …');
		expect(sign.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
		expect(sign.className.split(/\s+/)).toContain('motion-safe:animate-spin');
	});

	// #677: the form is not sent a second time while the first sending runs
	it('sendet sein Formular nicht ein zweites Mal, solange es arbeitet', () => {
		const form = document.body.appendChild(document.createElement('form'));
		const sent = vi.fn((event: Event) => event.preventDefault());
		form.addEventListener('submit', sent);
		show(Button, { children: label, type: 'submit', busy: true, testid: 'save' }, form);
		click('save');
		expect(sent).not.toHaveBeenCalled();
	});

	// #677 (persona Sven P-3): the sending is announced, not only shown on the button
	it('kündigt das Arbeiten in einer Statusmeldung an, die schon vorher da ist', () => {
		show(Button, { children: label, busyLabel: 'Wird gespeichert …', testid: 'idle' });
		const status = byTestId('idle')!.parentElement!.querySelector('[role="status"]');
		expect(status?.textContent?.trim()).toBe('');
		show(Button, { children: label, busy: true, busyLabel: 'Wird gespeichert …', testid: 'save' });
		expect(byTestId('save')!.nextElementSibling?.getAttribute('role')).toBe('status');
		expect(byTestId('save')!.nextElementSibling!.textContent!.trim()).toBe('Wird gespeichert …');
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
