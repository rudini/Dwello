import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';

const location = vi.hoisted(() => ({ url: new URL('http://localhost/tenants/new') }));
vi.mock('$app/forms', () => ({ enhance: () => ({}) }));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => (run({ url: location.url }), () => {}) }
}));

import NewTenantPage from '../routes/tenants/new/+page.svelte';

const page = () => render(NewTenantPage, { props: { form: null } as never }).body;

describe('Neuer Mieter', () => {
	it('kehrt beim Abbrechen zur Mieterliste zurück', () => {
		location.url = new URL('http://localhost/tenants/new');
		const body = page();
		expect(body).toMatch(/href="\/tenants"[^>]*data-testid="form-cancel"/);
		expect(body).not.toContain('name="for"');
	});

	it('führt aus dem Mietvertrag erfasst zum Mietvertrag zurück', () => {
		location.url = new URL('http://localhost/tenants/new?for=contract');
		const body = page();
		expect(body).toMatch(/<input[^>]*type="hidden"[^>]*name="for"[^>]*value="contract"/);
		expect(body).toMatch(/href="\/contracts\/new"[^>]*data-testid="form-cancel"/);
		expect(body).toContain('Danach geht es mit dem Mietvertrag weiter.');
	});
});
