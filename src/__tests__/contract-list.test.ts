import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';

const location = vi.hoisted(() => ({ url: new URL('http://localhost/contracts') }));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => (run({ url: location.url }), () => {}) }
}));

import ContractsPage from '../routes/contracts/+page.svelte';

const contract = (id: string, tenantName: string, startDate: string, endDate: string | null) => ({
	id,
	apartmentId: `a-${id}`,
	tenantId: `t-${id}`,
	startDate,
	endDate,
	baseRent: '950.00',
	additionalRent: null,
	monthlyAdvancePayment: '150.00',
	tenantName,
	tenantFirstName: '',
	tenantLastName: '',
	apartmentNumber: '2.01',
	buildingName: 'Ahornhof',
	buildingAddress: 'Ahornweg 1',
	totalRent: 1100
});

const list = (
	contracts: (ReturnType<typeof contract> & { missingStatement?: boolean })[],
	url = 'http://localhost/contracts',
	today = '2026-10-10'
) => {
	location.url = new URL(url);
	const data = {
		today,
		contracts,
		total: contracts.length,
		page: 1,
		pageSize: 12,
		buildings: [{ id: 'b1', name: 'Ahornhof', address: 'Ahornweg 1' }],
		apartments: []
	};
	return render(ContractsPage, { props: { data } as never }).body.replace(/\s+/g, ' ');
};

// The empty state with its one next step
const empty = (body: string) =>
	body.match(/data-testid="contracts-empty"[\s\S]*?<\/a>/)![0].replace(/<!--[^>]*-->/g, '');

describe('Treffer der Suche', () => {
	// After a search the focus moves to the count, so it is read out
	it('nennt die Treffer in einer Überschrift, die den Fokus nehmen kann', () => {
		const body = list([contract('c1', 'Anna Keller', '2024-01-01', null)]);
		expect(body).toMatch(/<h2[^>]*tabindex="-1"[^>]*data-results[^>]*>\s*1 Mietvertrag\s*<\/h2>/);
	});
});

const row = (body: string, id: string) =>
	body.match(new RegExp(`<li[^>]*data-testid="contract-row-${id}"[\\s\\S]*?</li>`))![0];

describe('Mietvertragsliste', () => {
	it('zeigt einen künftigen Mietvertrag ab seinem Vertragsbeginn, nicht als laufend bis heute', () => {
		const body = row(list([contract('c1', 'Anna Keller', '2099-11-01', null)]), 'c1');

		expect(body).toContain('Künftig');
		expect(body).toContain('ab 01.11.2099, unbefristet');
		expect(body).not.toMatch(/heute|AKTIV|Laufend/);
	});

	it('bestimmt den Vertragsstatus mit dem Tag des Servers', () => {
		const body = row(
			list([contract('c1', 'Anna Keller', '2099-11-01', null)], undefined, '2099-11-01'),
			'c1'
		);

		expect(body).toContain('Laufend');
	});

	it('filtert auch nach künftigen Mietverträgen', () => {
		const body = list([], 'http://localhost/contracts?status=future');

		expect(body).toMatch(/<option value="future" selected[^>]*>Künftige Mietverträge/);
	});

	it('zeigt einen laufenden Mietvertrag als laufend', () => {
		const body = row(list([contract('c1', 'Anna Keller', '2024-04-01', null)]), 'c1');

		expect(body).toContain('Laufend');
		expect(body).toContain('seit 01.04.2024, unbefristet');
	});

	it('nennt die Nettomiete und getrennt davon das monatliche Total', () => {
		const body = row(list([contract('c1', 'Anna Keller', '2024-04-01', null)]), 'c1');

		expect(body).toMatch(/Nettomiete[^]*CHF 950\.00/);
		expect(body).toMatch(/Monatlich total[^]*CHF 1’100\.00/);
	});

	it('öffnet den Mietvertrag über den Namen des Mieters', () => {
		const body = row(list([contract('c1', 'Anna Keller', '2024-04-01', null)]), 'c1');

		expect(body).toMatch(
			/<a[^>]*href="\/contracts\/c1"[^>]*data-testid="contract-view-button"[^>]*>Anna Keller<\/a>/
		);
		expect(body).toMatch(/aria-label="Mietvertrag von Anna Keller bearbeiten"/);
	});

	// #211: a missing statement shows in the list, not only on the contract page; in words, not colour alone
	it('kennzeichnet einen Mietvertrag mit fehlender Abrechnung', () => {
		const body = list([
			{ ...contract('c1', 'Anna Keller', '2024-04-01', null), missingStatement: true },
			contract('c2', 'Ben Meier', '2024-04-01', null)
		]);

		expect(row(body, 'c1')).toMatch(
			/data-testid="contract-missing-statement-badge"[\s\S]*?Abrechnung fehlt/
		);
		expect(row(body, 'c2')).not.toContain('contract-missing-statement-badge');
		// after the Vertragsdauer: «Abrechnung fehlt seit 01.04.2024» would read as one sentence (persona Helga)
		expect(row(body, 'c1')).toMatch(/seit 01\.04\.2024[\s\S]*contract-missing-statement-badge/);
	});

	it('meldet den Status nicht als Live-Region', () => {
		expect(list([contract('c1', 'Anna Keller', '2024-04-01', null)])).not.toContain(
			'role="status"'
		);
	});

	it('schlägt ohne Mietverträge den ersten Mietvertrag vor', () => {
		const body = empty(list([]));

		expect(body).toContain('Noch keine Mietverträge');
		expect(body).toMatch(/href="\/contracts\/new"[^>]*>\s*Mietvertrag erfassen/);
	});

	it('bietet bei einer Suche ohne Treffer an, die Filter zurückzusetzen', () => {
		const body = empty(list([], 'http://localhost/contracts?search=niemand'));

		expect(body).toContain('Keine Mietverträge gefunden');
		expect(body).toMatch(/href="\/contracts"[^>]*>\s*Filter zurücksetzen/);
	});

	it('behält Suchbegriff und Filter aus der Adresse', () => {
		const body = list([], 'http://localhost/contracts?search=Anna&building=b1&status=ended');

		expect(body).toMatch(/<input[^>]*name="search"[^>]*value="Anna"/);
		expect(body).toMatch(/<option value="b1" selected/);
		expect(body).toMatch(/<option value="ended" selected/);
	});
});
