import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';

const location = vi.hoisted(() => ({ url: new URL('http://localhost/tenants') }));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => (run({ url: location.url }), () => {}) }
}));

import TenantsPage from '../routes/tenants/+page.svelte';

const tenant = (id: string, isActive: boolean, currentApartment: string | null = null) => ({
	id,
	firstName: 'Anna',
	lastName: 'Keller',
	email: 'anna@example.ch',
	phone: '+41 52 123 45 67',
	language: 'de',
	address: null,
	postalCode: null,
	city: null,
	currentApartment,
	currentBuilding: currentApartment ? 'Ahornhof' : null,
	nextContractStart: null as string | null,
	isActive,
	isFuture: false
});

const list = (tenants: ReturnType<typeof tenant>[], url = 'http://localhost/tenants') => {
	location.url = new URL(url);
	const data = { tenants, total: tenants.length, page: 1, pageSize: 12 };
	return render(TenantsPage, { props: { data } as never })
		.body.replace(/<!--[^>]*-->/g, '')
		.replace(/\s+/g, ' ');
};

const row = (body: string, id: string) =>
	body.match(new RegExp(`<li[^>]*data-testid="tenant-card-${id}"[\\s\\S]*?</li>`))![0];

describe('Mieterliste', () => {
	// After a search the focus moves to the count, so it is read out
	it('nennt die Treffer in einer Überschrift, die den Fokus nehmen kann', () => {
		expect(list([tenant('t1', true)])).toMatch(
			/<h2[^>]*tabindex="-1"[^>]*data-results[^>]*> ?1 Mieter ?<\/h2>/
		);
	});
	it('öffnet den Mieter über seinen Namen', () => {
		const body = row(list([tenant('t1', true, 'Wohnung 2.01')]), 't1');

		expect(body).toMatch(/<a[^>]*href="\/tenants\/t1"[^>]*>\s*Anna Keller\s*<\/a>/);
	});

	it('nennt die aktuelle Wohnung und kennzeichnet aktive Mieter, ohne Live-Region', () => {
		const body = row(list([tenant('t1', true, 'Wohnung 2.01')]), 't1');

		expect(body).toContain('Wohnung 2.01 - Ahornhof');
		expect(body).toMatch(/data-testid="tenant-status"[^>]*>[^]*Aktiv/);
		expect(body).not.toContain('role="status"');
	});

	// F-4 (#58): wer erst einzieht, ist «Künftig», nicht «Aktiv»
	it('nennt bei einem künftigen Mieter den künftigen Mietvertrag und kennzeichnet ihn als künftig', () => {
		const body = row(
			list([{ ...tenant('t1', false), isFuture: true, nextContractStart: '2026-11-01' }]),
			't1'
		);

		expect(body).toContain('Mietvertrag ab 01.11.2026');
		expect(body).not.toContain('Keine laufende Miete');
		expect(body).toMatch(/data-testid="tenant-status"[^>]*>[^]*Künftig/);
		expect(body).not.toContain('Aktiv');
	});

	it('zeigt bei ehemaligen Mietern weder Wohnung noch Aktiv', () => {
		const body = row(list([tenant('t1', false)]), 't1');

		expect(body).toContain('Keine laufende Miete');
		expect(body).not.toContain('tenant-status');
	});

	// F-4 (#58): aktive, künftige und ehemalige Mieter
	it('filtert nach aktiven, künftigen und ehemaligen Mietern', () => {
		const options = [...list([]).matchAll(/<option value="(\w+)"[^>]*>([^<]*)</g)].map((o) => [
			o[1],
			o[2].trim()
		]);

		expect(options).toEqual([
			['active', 'Aktive Mieter'],
			['future', 'Künftige Mieter'],
			['inactive', 'Ehemalige Mieter']
		]);
	});

	it('schlägt ohne Mieter vor, den ersten zu erfassen', () => {
		const body = list([]);

		expect(body).toMatch(/data-testid="tenants-empty"[^]*Noch keine Mieter/);
		expect(body).toMatch(/href="\/tenants\/new"[^>]*>\s*Mieter erfassen/);
	});

	it('bietet bei einer Suche ohne Treffer an, die Filter zurückzusetzen', () => {
		const body = list([], 'http://localhost/tenants?search=niemand&status=inactive');

		expect(body).toMatch(/data-testid="tenants-empty"[^]*Keine Mieter gefunden/);
		expect(body).toMatch(/href="\/tenants"[^>]*>\s*Filter zurücksetzen/);
		expect(body).toMatch(/<input[^>]*name="search"[^>]*value="niemand"/);
		expect(body).toMatch(/<option value="inactive" selected/);
	});
});
