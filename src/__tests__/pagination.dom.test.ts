import { describe, it, expect } from 'vitest';
import Pagination from '$lib/components/Pagination.svelte';
import { click, show } from './helpers/dom';

// Paging of the lists not yet on the new design (Gebäude, Mieter, Mietverträge)
describe('Blättern', () => {
	const pages = () =>
		[...document.querySelectorAll('nav > button, nav > span')].map((el) =>
			(el.getAttribute('aria-label') ?? el.textContent)!.trim()
		);

	it('zeigt die Einträge der Seite und kürzt lange Seitenfolgen ab', () => {
		show(Pagination, { page: 5, pageSize: 10, total: 95 } as never);

		expect(document.body.textContent!.replace(/\s+/g, ' ')).toContain('Zeige 41 bis 50 von 95');
		expect(pages()).toEqual([
			'Vorherige Seite',
			'1',
			'...',
			'4',
			'5',
			'6',
			'...',
			'10',
			'Nächste Seite'
		]);
	});

	it('zeigt wenige Seiten alle und meldet die gewählte', () => {
		const chosen: number[] = [];
		show(Pagination, {
			page: 1,
			pageSize: 10,
			total: 25,
			onchange: (page: number) => chosen.push(page)
		} as never);

		expect(pages()).toEqual(['Vorherige Seite', '1', '2', '3', 'Nächste Seite']);
		click(document.querySelector<HTMLElement>('[aria-label="Nächste Seite"]')!);
		click(document.querySelector<HTMLElement>('[aria-label="Vorherige Seite"]')!);

		expect(chosen).toEqual([2, 1]);
	});
});
