import { flushSync } from 'svelte';
import { describe, expect, it } from 'vitest';
import AnalyticsPage from '../routes/analytics/+page.svelte';
import { byTestId, show } from './helpers/dom';

// #1409: the Jahresbericht on «Auswertungen»
const frame = { user: null, demo: false };
const data = (year: number, currentYear: number) => ({
	...frame,
	buildings: [
		{ value: 'b1', label: 'Seeblick', address: 'Seeblick, Seestrasse 12, 8002 Zürich' },
		{ value: 'b2', label: 'Talhof', address: 'Talhof, Talweg 1, 8400 Winterthur' }
	],
	buildingAddress: 'Seeblick, Seestrasse 12, 8002 Zürich',
	buildingId: 'b1',
	buildingName: 'Seeblick',
	years: ['2026', '2025', '2024'],
	currentYear,
	report: {
		year,
		sections: [
			{
				key: 'income' as const,
				heading: 'Mietertrag',
				help: 'Hilfe',
				notes: [],
				rows: [{ label: 'Nettomiete', amount: 1500 }]
			}
		]
	}
});

describe('Jahresbericht auf «Auswertungen»', () => {
	it('sagt beim laufenden Jahr, dass es noch nicht vorbei ist', () => {
		show(AnalyticsPage, { data: data(2026, 2026) });
		expect(byTestId('annual-report-current-year')?.textContent).toContain(
			'Das Jahr 2026 ist noch nicht vorbei'
		);
	});

	it('sagt bei einem vergangenen Jahr nichts dazu', () => {
		show(AnalyticsPage, { data: data(2025, 2026) });
		expect(byTestId('annual-report-income')).not.toBeNull();
		expect(byTestId('annual-report-current-year')).toBeNull();
	});

	it('führt ohne Gebäude zum Erfassen eines Gebäudes', () => {
		show(AnalyticsPage, { data: { ...frame, buildings: [], report: null } });
		expect(byTestId('analytics-empty')?.querySelector('a')?.getAttribute('href')).toBe(
			'/buildings/new'
		);
	});

	// personas Helga P-1, Sven P-3, Marco P-5 (1409-2): a download of the report shown, while another building or year
	// is chosen, would hand on the wrong building
	it('bietet die Downloads erst wieder an, wenn der gewählte Bericht angezeigt ist', () => {
		show(AnalyticsPage, { data: data(2025, 2026) });
		expect(byTestId('annual-report-csv')).not.toBeNull();
		const building = byTestId<HTMLSelectElement>('annual-report-building')!;
		building.value = 'b2';
		building.dispatchEvent(new Event('change'));
		flushSync();
		expect([byTestId('annual-report-csv'), byTestId('annual-report-pdf')]).toEqual([null, null]);
	});
});
