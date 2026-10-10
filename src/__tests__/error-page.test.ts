import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';
import { readable } from 'svelte/store';

let current = { status: 404, error: { message: 'Not found' } };
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (v: unknown) => void) => readable(current).subscribe(run) }
}));

const page = async (status: number, message = '') => {
	current = { status, error: { message } };
	const { default: ErrorPage } = await import('../routes/+error.svelte');
	return render(ErrorPage).body;
};

describe('Fehlerseite', () => {
	it('sagt in Worten, was passiert ist, und führt zur Übersicht', async () => {
		const body = await page(404);
		expect(body).toMatch(/<h1[^>]*>Diese Seite gibt es nicht\.<\/h1>/);
		expect(body).toContain('href="/dashboard"');
		expect(body).toMatch(/<svg[^>]*viewBox="0 0 160 120"/);
	});

	it('zeigt die Meldung des Servers bei anderen Fehlern und rät zum späteren Versuch', async () => {
		const body = await page(500, 'Übersicht konnte nicht geladen werden');
		expect(body).toContain('Übersicht konnte nicht geladen werden');
		expect(body).toContain('Versuchen Sie es später erneut.');
		expect(body).not.toContain('Prüfen Sie die Adresse');
	});

	it('verspricht nichts, was die Seite nicht weiss', async () => {
		expect(await page(404)).not.toContain('nicht betroffen');
	});
});
