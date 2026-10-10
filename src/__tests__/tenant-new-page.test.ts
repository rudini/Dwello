import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'svelte/server';
import { get } from 'svelte/store';

const location = vi.hoisted(() => ({ url: new URL('http://localhost/tenants/new') }));
vi.mock('$app/forms', () => ({ enhance: () => ({}) }));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => (run({ url: location.url }), () => {}) }
}));

import NewTenantPage from '../routes/tenants/new/+page.svelte';
import EditTenantPage from '../routes/tenants/[id]/edit/+page.svelte';
import { confirmSaved } from '$lib/tenant';
import { toasts } from '$lib/stores';

const page = (url = 'http://localhost/tenants/new') => {
	location.url = new URL(url);
	return render(NewTenantPage, { props: { form: null } as never })
		.body.replace(/<!--[^>]*-->/g, '')
		.replace(/\s+/g, ' ');
};

describe('Neuer Mieter', () => {
	it('kehrt beim Abbrechen zur Mieterliste zurück', () => {
		const body = page();
		expect(body).toMatch(/href="\/tenants"[^>]*data-testid="form-cancel"/);
		expect(body).not.toContain('name="for"');
	});

	it('führt aus dem Mietvertrag erfasst zum Mietvertrag zurück', () => {
		const body = page('http://localhost/tenants/new?for=contract');
		expect(body).toMatch(/<input[^>]*type="hidden"[^>]*name="for"[^>]*value="contract"/);
		expect(body).toMatch(/href="\/contracts\/new"[^>]*data-testid="form-cancel"/);
		expect(body).toContain('Danach geht es mit dem Mietvertrag weiter.');
	});

	it('erfasst den Mieter mit dem Verb «erfassen»', () => {
		const body = page();
		expect(body).toMatch(/data-testid="tenant-submit"[^>]*>[^]*?Mieter erfassen/);
		expect(body).not.toMatch(/erstellen/i);
	});

	it('zeigt Beispiele als Hilfetext, nicht als Platzhalter, der ausgefüllt aussieht', () => {
		const body = page();
		expect(body).not.toContain('placeholder=');
		expect(body).toMatch(/id="firstName-help"[^>]*>[^<]*<span[^>]*>Beispiel: Anna/);
	});

	it('schlägt den Brief als Korrespondenzkanal vor, wie im Glossar', () => {
		expect(page()).toMatch(/<option value="letter" selected/);
	});
});

describe('Mieter bearbeiten', () => {
	it('füllt die Felder mit den Daten des Mieters und speichert die Änderungen', () => {
		const tenant = {
			id: 't1',
			firstName: 'Anna',
			lastName: 'Keller',
			email: 'anna@example.ch',
			language: 'fr',
			correspondenceChannel: 'email'
		};
		const body = render(EditTenantPage, { props: { data: { tenant }, form: null } as never })
			.body.replace(/<!--[^>]*-->/g, '')
			.replace(/\s+/g, ' ');
		expect(body).toMatch(/<input[^>]*name="lastName"[^>]*value="Keller"/);
		expect(body).toMatch(/<option value="email" selected/);
		expect(body).toMatch(/<option value="fr" selected/);
		expect(body).toMatch(/href="\/tenants\/t1"[^>]*data-testid="form-cancel"/);
		expect(body).toMatch(/data-testid="tenant-submit"[^>]*>[^]*?Änderungen speichern/);
	});
});

describe('Bestätigung nach dem Speichern', () => {
	beforeEach(() => toasts.set([]));

	const saved = async (fields: Record<string, string>, type = 'redirect') => {
		const formData = new FormData();
		for (const [name, value] of Object.entries(fields)) formData.append(name, value);
		const update = vi.fn();
		await confirmSaved(formData)({ result: { type } as never, update });
		return update;
	};

	it('nennt den gespeicherten Mieter', async () => {
		const update = await saved({ firstName: ' Anna ', lastName: 'Keller' });
		expect(get(toasts).map((t) => t.message)).toEqual(['Anna Keller gespeichert']);
		expect(update).toHaveBeenCalledOnce();
	});

	it('meldet nichts, solange das Formular Fehler hat', async () => {
		await saved({ firstName: 'Anna', lastName: '' }, 'failure');
		expect(get(toasts)).toEqual([]);
	});

	it('überlässt die Bestätigung dem Mietvertrag, wenn der Mieter dort erfasst wird', async () => {
		await saved({ firstName: 'Anna', lastName: 'Keller', for: 'contract' });
		expect(get(toasts)).toEqual([]);
	});
});
