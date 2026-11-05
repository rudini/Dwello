import { describe, expect, it } from 'vitest';
import ReportsPage from '../routes/reports/+page.svelte';
import ReconciliationPage from '../routes/reports/[buildingId]/+page.svelte';
import { allByTestId, byTestId, show } from './helpers/dom';

// #1126: «Berichte» lists the Kostenabstimmung of each building and period with statements
const text = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim();
const amounts = { buildingCosts: 1200, tenants: 1377.05, landlord: -177.05 };
const reconciliation = {
	positions: [{ label: 'Hauswart', ...amounts }],
	total: amounts,
	managementFee: 0,
	nonAllocable: 500,
	withoutStatement: 2,
	drafts: [{ id: 's3', tenantName: 'Lea Graf' }],
	notUpToDate: [
		{ id: 's1', tenantName: 'Eva Frei' },
		{ id: 's2', tenantName: 'Marc Huber' }
	]
};

describe('Berichte', () => {
	it('führen ohne Abrechnungen zum Erstellen von Abrechnungen', () => {
		show(ReportsPage, { data: { periods: [] } } as never);
		expect(text(byTestId('reports-empty')?.querySelector('h2') ?? null)).toBe(
			'Noch keine Abrechnungen'
		);
		expect(byTestId('reports-empty')?.querySelector('a')?.getAttribute('href')).toBe(
			'/statements/generate'
		);
	});

	it('nennen jede Periode als Link auf ihre Kostenabstimmung', () => {
		const period = {
			key: 'b1-2024-01-01',
			href: '/reports/b1?periodStart=2024-01-01&periodEnd=2024-12-31'
		};
		show(ReportsPage, {
			data: { periods: [{ ...period, name: 'Lindenhof, 01.01.2024 – 31.12.2024' }] }
		} as never);
		const link = byTestId('report-period-b1-2024-01-01')!;
		expect(text(link)).toBe('Lindenhof, 01.01.2024 – 31.12.2024');
		expect(link.getAttribute('href')).toBe(
			'/reports/b1?periodStart=2024-01-01&periodEnd=2024-12-31'
		);
	});
});

describe('Kostenabstimmung der Berichte', () => {
	it('zeigt einen negativen Anteil des Vermieters mit Leerzeichen nach CHF', () => {
		show(ReconciliationPage, {
			data: { title: 'Kostenabstimmung Lindenhof, 01.01.2024 – 31.12.2024', reconciliation }
		} as never);
		const cells = allByTestId('cost-reconciliation-cell').map(text);
		expect(cells.slice(0, 4)).toEqual(['Hauswart', 'CHF 1’200.00', 'CHF 1’377.05', 'CHF -177.05']);
	});

	// persona Sven 1126 P-4: a screen reader names the position with each amount
	it('nennt jede Position als Überschrift ihrer Zeile', () => {
		show(ReconciliationPage, { data: { title: 'Kostenabstimmung', reconciliation } } as never);
		const heads = [...document.querySelectorAll('tbody th[scope="row"]')].map(text);
		expect(heads).toEqual(['Hauswart', 'Total']);
	});

	it('nennt die nicht umlagefähigen Rechnungen und keine Verwaltungspauschale von CHF 0.00', () => {
		show(ReconciliationPage, { data: { title: 'Kostenabstimmung', reconciliation } } as never);
		expect(allByTestId('cost-reconciliation-extra').map(text)).toEqual([
			'Nicht umlagefähige Rechnungen (tragen Sie ganz) CHF 500.00'
		]);
	});

	it('nennt Mietverträge ohne Abrechnung, Entwürfe und nicht aktuelle Abrechnungen mit Links', () => {
		show(ReconciliationPage, { data: { title: 'Kostenabstimmung', reconciliation } } as never);
		const notes = allByTestId('cost-reconciliation-note');
		expect(notes.map(text)).toEqual([
			'2 Mietverträge haben für diese Abrechnungsperiode noch keine Abrechnung. Ihr Anteil ist in «davon tragen Sie» enthalten.',
			'1 Abrechnung ist noch ein Entwurf: Lea Graf. Sie zählt schon mit, ist aber noch nicht versendet.',
			'2 Abrechnungen dieser Abrechnungsperiode sind nicht aktuell: Seit ihrem Erstellen wurden Rechnungen erfasst, geändert oder gelöscht oder der Tankbestand geändert. Öffnen Sie sie, um zu sehen, ob Sie sie neu berechnen oder berichtigen müssen: Eva Frei, Marc Huber.'
		]);
		// PO 05.11.2026 (persona Sven 1126 P-2): the drafts linked as the statements not up to date
		expect(notes[1].querySelector('a')?.getAttribute('href')).toBe('/statements/s3');
		expect([...notes[2].querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual([
			'/statements/s1',
			'/statements/s2'
		]);
	});
});
