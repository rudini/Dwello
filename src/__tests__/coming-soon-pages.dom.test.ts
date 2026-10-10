import { describe, it, expect } from 'vitest';
import AnalyticsPage from '../routes/analytics/+page.svelte';
import ReportsPage from '../routes/reports/+page.svelte';
import { byTestId, show } from './helpers/dom';

describe.each([
	[AnalyticsPage, 'Analytics kommt in Phase 2'],
	[ReportsPage, 'Berichte kommen in Phase 2']
])('Angekündigte Funktion', (page, announcement) => {
	it(`kündigt «${announcement}» mit Illustration an und führt zurück zur Übersicht`, () => {
		show(page, {});

		const notice = byTestId('coming-soon');
		expect(notice?.querySelector('h2')?.textContent).toBe(announcement);
		expect(notice?.querySelector('svg')).not.toBeNull();
		const back = notice?.querySelector('a');
		expect(back?.getAttribute('href')).toBe('/dashboard');
		expect(back?.textContent).toContain('Zur Übersicht');
	});
});
