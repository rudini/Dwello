import { describe, expect, it } from 'vitest';
import Icon from '$lib/ui/Icon.svelte';
import { show } from './helpers/dom';

describe('Icon', () => {
	it('ist dekorativ und für Screenreader versteckt, solange es keine Beschriftung hat', () => {
		show(Icon, { name: 'building' });
		const svg = document.querySelector('svg')!;
		expect(svg.getAttribute('aria-hidden')).toBe('true');
		expect(svg.getAttribute('stroke-width')).toBe('1.75');
	});

	it('wird mit Beschriftung als Bild mit Namen angesagt', () => {
		show(Icon, { name: 'warning', label: 'Achtung' });
		const svg = document.querySelector('svg')!;
		expect(svg.getAttribute('role')).toBe('img');
		expect(svg.getAttribute('aria-label')).toBe('Achtung');
		expect(svg.hasAttribute('aria-hidden')).toBe(false);
	});

	it('hat die gewünschte Grösse', () => {
		show(Icon, { name: 'close', size: 16 });
		expect(document.querySelector('svg')!.getAttribute('width')).toBe('16');
	});
});
