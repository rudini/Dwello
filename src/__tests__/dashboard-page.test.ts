import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import DashboardPage from '../routes/dashboard/+page.svelte';
import type { DashboardData } from '../routes/dashboard/+page.server';

const data: DashboardData = {
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
	statements: { draft: 4, sent: 2, paid: 7, overdue: 1 },
	recentActivity: [],
	buildingOccupancy: [
		{
			buildingId: 'b1',
			buildingName: 'Seeblick',
			totalApartments: 4,
			occupiedApartments: 3,
			occupancyRate: 75
		}
	]
};

const page = () => render(DashboardPage, { props: { data } as never }).body;

describe('Dashboard', () => {
	it('zeigt die Kennzahlen des Portfolios mit Belegungsrate', () => {
		const body = page();

		const vacant = body.match(/<a[^>]*data-testid="stat-vacant"[\s\S]*?<\/a>/)![0];
		expect(vacant).toMatch(/>2</);
		expect(body).toContain('75.0%');
	});

	it('zeigt Beträge in Franken', () => {
		expect(page()).toMatch(/CHF[\s ]1[’']?250\.50/);
	});

	it('führt jede Abrechnungs-Kachel zur Liste mit ihrem Status', () => {
		const body = page();

		for (const status of ['draft', 'sent', 'paid', 'overdue']) {
			expect(body).toContain(`href="/statements?status=${status}"`);
		}
		expect(body).toMatch(/data-testid="statements-draft-count">4</);
	});

	it('bietet die Schnellaktionen an', () => {
		const body = page();

		for (const href of [
			'/buildings/new',
			'/tenants/new',
			'/invoices/new',
			'/statements/generate'
		]) {
			expect(body).toContain(`href="${href}"`);
		}
	});
});

describe('Erste Schritte', () => {
	const withPortfolio = (
		portfolio: Partial<DashboardData['portfolio']>,
		statements = data.statements
	) =>
		render(DashboardPage, {
			props: {
				data: { ...data, portfolio: { ...data.portfolio, ...portfolio }, statements }
			} as never
		}).body;

	it('führt einen leeren Betrieb zum ersten Gebäude', () => {
		const body = withPortfolio(
			{ totalBuildings: 0, totalApartments: 0, occupiedApartments: 0, reletApartments: 0 },
			{ draft: 0, sent: 0, paid: 0, overdue: 0 }
		);

		const steps = body.match(/data-testid="getting-started-step"[\s\S]*?<\/li>/g)!;
		expect(steps).toHaveLength(4);
		expect(steps[0]).toContain('href="/buildings/new"');
		expect(body).toMatch(/<a href="\/buildings\/new"[^>]*data-testid="getting-started-next"/);
	});

	it('hakt erledigte Schritte ab und zeigt den nächsten', () => {
		const body = withPortfolio(
			{ occupiedApartments: 0, reletApartments: 0 },
			{ draft: 0, sent: 0, paid: 0, overdue: 0 }
		);

		const steps = body.match(/data-testid="getting-started-step"[\s\S]*?<\/li>/g)!;
		expect(steps[0]).toContain('data-done="true"');
		expect(steps[1]).toContain('data-done="true"');
		expect(steps[2]).toContain('data-done="false"');
		expect(body).toMatch(/<a href="\/tenants\/new"[^>]*data-testid="getting-started-next"/);
	});

	it('verschwindet, sobald alle Schritte erledigt sind', () => {
		expect(page()).not.toContain('getting-started');
	});
});
