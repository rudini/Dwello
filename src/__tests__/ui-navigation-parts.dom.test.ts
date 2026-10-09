import { describe, expect, it, vi } from 'vitest';
import { flushSync } from 'svelte';
import Stepper from '$lib/ui/Stepper.svelte';
import Tabs from '$lib/ui/Tabs.svelte';
import { click, show } from './helpers/dom';
import { markup } from './helpers/snippet';

const steps = ['Mieter', 'Wohnung', 'Vertragsdauer', 'Miete', 'Prüfen'];

describe('Schrittanzeige', () => {
	it('zeigt alle Schritte und markiert den aktuellen', () => {
		show(Stepper, { steps, current: 2, onselect: vi.fn() });
		const items = [...document.querySelectorAll('ol > li')];
		expect(items.map((item) => item.textContent)).toEqual([
			expect.stringContaining('Mieter'),
			expect.stringContaining('Wohnung'),
			expect.stringContaining('Vertragsdauer'),
			expect.stringContaining('Miete'),
			expect.stringContaining('Prüfen')
		]);
		expect(items[1].querySelector('[aria-current="step"]')).not.toBeNull();
		expect(document.body.textContent).toContain('Schritt 2 von 5');
	});

	it('führt zu erledigten Schritten zurück, nicht zu künftigen', () => {
		const onselect = vi.fn();
		show(Stepper, { steps, current: 3, onselect });
		const items = [...document.querySelectorAll('ol > li')];
		click(items[0].querySelector('button')!);
		expect(onselect).toHaveBeenCalledWith(1);
		expect(items[0].textContent).toContain('erledigt');
		expect(items[3].querySelector('button')).toBeNull();
	});
});

describe('Registerkarten', () => {
	const tabs = [
		{ id: 'current', label: 'Laufend' },
		{ id: 'ended', label: 'Beendet' }
	];
	const press = (key: string) => {
		document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
		flushSync();
	};

	it('verbindet Reiter und Inhalt und wählt mit den Pfeiltasten', () => {
		let selected = 'current';
		show(Tabs, {
			label: 'Mietverträge',
			tabs,
			get selected() {
				return selected;
			},
			set selected(next: string) {
				selected = next;
			},
			children: markup('<p>Inhalt</p>')
		});
		const [first, second] = [...document.querySelectorAll<HTMLElement>('[role=tab]')];
		expect(document.querySelector('[role=tablist]')!.getAttribute('aria-label')).toBe(
			'Mietverträge'
		);
		expect(first.getAttribute('aria-selected')).toBe('true');
		expect(second.tabIndex).toBe(-1);
		const panel = document.getElementById(first.getAttribute('aria-controls')!)!;
		expect(second.hasAttribute('aria-controls')).toBe(false);
		expect(panel.getAttribute('role')).toBe('tabpanel');
		first.focus();
		press('ArrowRight');
		expect(selected).toBe('ended');
		expect(document.activeElement).toBe(second);
		press('ArrowRight');
		expect(document.activeElement).toBe(first);
		press('End');
		expect(document.activeElement).toBe(second);
		press('Home');
		expect(selected).toBe('current');
	});
});
