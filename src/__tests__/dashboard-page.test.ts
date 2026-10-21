import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import DashboardPage from '../routes/dashboard/+page.svelte';
import type { Deadline, Task } from '$lib/overview';

const task = (id: string, title: string, href: string): Task => ({
	id,
	title,
	text: `${title} – Erklärung`,
	href,
	action: `${title} öffnen`,
	icon: 'statement'
});
const deadline: Deadline = {
	id: 's1',
	kind: 'Zahlungsfrist',
	name: 'Anna Keller',
	date: '2026-10-05',
	days: -5,
	when: 'seit 5 Tagen abgelaufen',
	href: '/statements/s1'
};
const data = {
	portfolio: {
		totalBuildings: 2,
		totalApartments: 8,
		occupiedApartments: 5,
		reletApartments: 1,
		vacantApartments: 2,
		reservedApartments: 0,
		occupancyRate: 75
	},
	financial: {
		outstandingStatements: 3,
		totalPending: 1250.5,
		overdueAmount: 400,
		paidThisMonth: 900
	},
	statements: { draft: 4, sent: 2, paid: 7, settled: 3, overdue: 1 },
	recentActivity: [],
	buildingOccupancy: [
		{
			buildingId: 'b1',
			buildingName: 'Seeblick',
			totalApartments: 4,
			occupiedApartments: 3
		}
	],
	tasks: [
		task('overdue', 'Überfällige Abrechnungen prüfen', '/statements?status=overdue'),
		task('drafts', 'Abrechnungen prüfen und versenden', '/statements?status=draft')
	],
	deadlines: [deadline],
	kiModel: { state: 'ready' }
};

const page = (overrides = {}) =>
	render(DashboardPage, { props: { data: { ...data, ...overrides } } as never }).body;
const tasksOf = (body: string) => body.match(/data-testid="overview-task"[\s\S]*?<\/li>/g) ?? [];

// #577: the local KI's model downloads in the background after the first start
describe('Übersicht während das KI-Modell lädt', () => {
	const hint = (body: string) => body.match(/data-testid="ki-model-loading"[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? '';

	it('zeigt, wie weit das KI-Modell geladen ist, und dass Rechnungen bis dahin von Hand gehen', () => {
		const text = hint(page({ kiModel: { state: 'loading', percent: 40 } }));

		expect(text).toContain('Das KI-Modell wird geladen: 40 %.');
		expect(text).toContain('Bis es geladen ist, erfassen Sie Rechnungen von Hand.');
	});

	it('sagt, wenn das KI-Modell nicht geladen werden konnte', () => {
		const text = hint(page({ kiModel: { state: 'failed' } }));

		expect(text).toContain('Das KI-Modell konnte nicht geladen werden.');
		// fach review 577 V-7: on a server that runs on, the next start is the operator's
		expect(text).toContain('Dwello versucht es erneut, wenn der Betreiber Dwello neu startet');
	});

	it('zeigt nichts, wenn das Modell bereit ist oder die KI ausserhalb des Servers läuft', () => {
		expect(page({ kiModel: { state: 'ready' } })).not.toContain('ki-model-loading');
		expect(page({ kiModel: { state: 'unknown' } })).not.toContain('ki-model-loading');
	});
});

describe('Übersicht', () => {
	it('heisst Übersicht und beginnt mit dem, was jetzt zu tun ist', () => {
		const body = page();
		expect(body).toMatch(/<h1[^>]*>Übersicht<\/h1>/);
		expect(body.indexOf('>Als Nächstes zu tun<')).toBeLessThan(body.indexOf('>Fristen<'));
	});

	it('zeigt jede Aufgabe mit Erklärung und einem Weg dorthin; die erste ist die Hauptaktion', () => {
		const [first, second] = tasksOf(page());
		expect(first).toContain('Überfällige Abrechnungen prüfen');
		expect(first).toContain('Erklärung');
		expect(first).toContain('href="/statements?status=overdue"');
		const primary = /(?<![\w:-])bg-accent(?![\w-])/; // the primary button's fill
		expect(first).toMatch(primary);
		expect(second).not.toMatch(primary);
	});

	it('zeigt den zweiten Weg einer Aufgabe als Link neben der einen Aktion', () => {
		const withLink = {
			...task('missing-period', 'Nebenkostenabrechnungen erstellen', '/statements/generate'),
			link: { href: '/invoices?year=2025', label: 'Rechnungen 2025 ansehen' }
		};
		const [card] = tasksOf(page({ tasks: [withLink] }));
		expect(card).toMatch(/href="\/invoices\?year=2025"[^>]*>Rechnungen 2025 ansehen/);
	});

	it('begrüsst neue Liegenschaftsverwalter mit einem Bild zum ersten Schritt', () => {
		const first = {
			...task('first-building', 'Erstes Gebäude erfassen', '/buildings/new'),
			illustration: 'building'
		};
		const [card] = tasksOf(page({ tasks: [first] }));
		expect(card).toContain('href="/buildings/new"');
		expect(card).toMatch(/<svg[^>]*viewBox="0 0 160 120"[^>]*aria-hidden="true"/);
	});

	it('meldet, wenn nichts zu tun ist', () => {
		const body = page({ tasks: [] });
		expect(tasksOf(body)).toHaveLength(0);
		expect(body).toContain('Alles erledigt');
	});

	it('nennt Fristen mit Datum, Art, Name und Abstand', () => {
		const row = page().match(/data-testid="overview-deadline"[\s\S]*?<\/li>/)![0];
		expect(row).toContain('05.10.2026');
		expect(row).toContain('Zahlungsfrist');
		expect(row).toContain('Anna Keller');
		expect(row).toContain('seit 5 Tagen abgelaufen');
		expect(row).toContain('href="/statements/s1"');
	});

	it('sagt, wenn keine Fristen anstehen', () => {
		expect(page({ deadlines: [] })).toContain('In den nächsten Wochen stehen keine Fristen an.');
	});

	it('führt Kennzahlen und Abrechnungsstatus zu den gefilterten Listen', () => {
		const body = page();
		expect(body).toMatch(/<a[^>]*href="\/apartments\?status=vacant"[^>]*data-testid="stat-vacant"/);
		expect(body.match(/data-testid="stat-buildings"/g)).toHaveLength(1);
		expect(body).toMatch(
			/<a[^>]*href="\/statements\?status=overdue"[^>]*data-testid="stat-overdue-amount"[\s\S]*?Überfällige Beträge/
		);
		for (const status of ['draft', 'sent', 'paid', 'settled', 'overdue']) {
			expect(body).toContain(`href="/statements?status=${status}"`);
		}
		expect(body).toMatch(/data-testid="statements-draft-count"[^>]*>4</);
		expect(body).toMatch(/data-testid="statements-settled-count"[^>]*>3</); // «Erledigt» (#448)
	});

	// F-1 (#55): nur «x/y vermietet», ohne Anteil in Prozent
	it('zeigt die Belegung pro Gebäude', () => {
		const row = page().match(/data-testid="occupancy-row"[\s\S]*?<\/li>/)![0];
		expect(row).toContain('href="/buildings/b1"');
		expect(row).not.toContain('%');
		expect(row).toMatch(/data-testid="occupancy-count"[^>]*>3\/4</);
	});

	// as the building cards count them, with the start of their future contracts
	// F-4 (#58): «vermietet ab», wie auf den Gebäudekarten
	it('nennt die künftig vermieteten Wohnungen mit ihrem Vertragsbeginn', () => {
		const building = {
			...data.buildingOccupancy[0],
			reletStarts: ['2026-11-01', '2026-11-01', '2026-12-01']
		};
		const row = page({ buildingOccupancy: [building] }).match(
			/data-testid="occupancy-row"[\s\S]*?<\/li>/
		)![0];
		expect(row.replace(/<[^>]*>/g, '')).toContain(
			'3/4 vermietet, 2 vermietet ab 01.11.2026, 1 vermietet ab 01.12.2026'
		);
	});

	// P-18 (#145): seit wann leer, und wer die Nebenkosten trägt
	it('nennt die leeren Wohnungen mit dem Tag, seit dem sie leer sind', () => {
		const building = {
			...data.buildingOccupancy[0],
			vacant: [
				{ number: '1.01', lastContractEnd: null },
				{ number: '1.02', lastContractEnd: '2024-03-31' }
			]
		};
		const body = page({ buildingOccupancy: [building] });
		const row = body.match(/data-testid="occupancy-row"[\s\S]*?<\/li>/)![0];
		expect(row.replace(/<[^>]*>/g, '')).toContain(
			'3/4 vermietet, Wohnung 1.01 leer, Wohnung 1.02 leer seit 01.04.2024'
		);
		expect(body).toMatch(
			/data-testid="occupancy-vacancy-help"[^>]*>Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.</
		);
	});

	// review C-9: auch eine nie vermietete leere Wohnung trägt der Vermieter
	it('erklärt die Nebenkosten auch, wenn die leere Wohnung nie vermietet war', () => {
		const building = {
			...data.buildingOccupancy[0],
			vacant: [{ number: '1.01', lastContractEnd: null }]
		};
		expect(page({ buildingOccupancy: [building] })).toContain('occupancy-vacancy-help');
	});

	it('erklärt die Nebenkosten leerer Wohnungen nur, wenn es eine gibt', () => {
		expect(page()).not.toContain('occupancy-vacancy-help');
	});

	it('bietet die häufigen Arbeiten direkt an', () => {
		const body = page();
		for (const href of [
			'/tenants/new',
			'/contracts/new',
			'/invoices/new',
			'/invoices?upload',
			'/statements/generate'
		]) {
			expect(body).toMatch(
				new RegExp(`href="${href.replace(/[/?]/g, '\\$&')}"[^>]*data-testid="quick-action"`)
			);
		}
	});
});
