import { describe, expect, it } from 'vitest';
import Illustration from '$lib/ui/Illustration.svelte';
import { illustrations } from '$lib/ui/illustrations';
import { show } from './helpers/dom';

const motifs = Object.keys(illustrations) as (keyof typeof illustrations)[];

describe('Illustrationen', () => {
	it('zeigen mindestens acht Motive aus der Verwaltung', () => {
		expect(motifs.length).toBeGreaterThanOrEqual(8);
	});

	it.each(motifs)('%s ist ohne Titel Dekoration und für Screenreader versteckt', (name) => {
		show(Illustration, { name });
		const svg = document.querySelector('svg')!;
		expect(svg.getAttribute('aria-hidden')).toBe('true');
		expect(
			svg.querySelectorAll('path, rect, circle, line, polyline, polygon').length
		).toBeGreaterThan(2);
	});

	it.each(motifs)('%s zeichnet nur in den Farben der Tokens', (name) => {
		show(Illustration, { name });
		const painted = [...document.querySelectorAll('svg *')].flatMap((shape) =>
			['fill', 'stroke'].map((attribute) => shape.getAttribute(attribute)).filter(Boolean)
		);
		expect(painted.filter((colour) => colour !== 'none' && !colour!.startsWith('var(--'))).toEqual(
			[]
		);
	});

	it('wird mit Titel als Bild mit Namen angesagt', () => {
		show(Illustration, { name: 'building', title: 'Noch kein Gebäude erfasst' });
		const svg = document.querySelector('svg')!;
		expect(svg.getAttribute('role')).toBe('img');
		expect(document.getElementById(svg.getAttribute('aria-labelledby')!)!.textContent).toBe(
			'Noch kein Gebäude erfasst'
		);
	});
});
