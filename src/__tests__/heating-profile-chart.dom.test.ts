import { describe, it, expect } from 'vitest';
import HeatingProfileChart from '$lib/components/HeatingProfileChart.svelte';
import { MONTHS } from '$lib/heating-profile';
import { byTestId, show } from './helpers/dom';

const shares = Object.fromEntries(MONTHS.map(({ key }, i) => [key, i === 0 ? 16.4 : 7.6]));

describe('Monatliche Verteilung eines Heizprofils', () => {
	it('nennt jeden Monat mit seinem Anteil, ohne Maus und für Screenreader', () => {
		show(HeatingProfileChart, { shares });

		const items = [...byTestId('heating-profile-chart')!.querySelectorAll('li')];
		expect(items.map((item) => item.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
			'Jan Januar 16.4 %',
			...MONTHS.slice(1).map(({ label }) => `${label.slice(0, 3)} ${label} 7.6 %`)
		]);
		expect(byTestId('heating-profile-share-january')!.textContent).toBe('16.4 %');
	});

	it('zeigt die Balken nur als Bild, die Zahlen stehen daneben', () => {
		show(HeatingProfileChart, { shares });

		expect(byTestId('chart-bar-january')!.closest('[aria-hidden="true"]')).not.toBeNull();
		expect(byTestId('chart-bar-january')!.style.height).toBe('100%');
	});
});
