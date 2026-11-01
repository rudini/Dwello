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

	// #519: SvelteKit's own message of an unexpected failure is English in every language
	it.each(['Internal Error', 'Unknown Error', 'Error: 502'])('nennt «%s» von SvelteKit in der Sprache der Seite', async (message) => {
		const body = await page(500, message);
		expect(body).toMatch(/<h1[^>]*>Ein unerwarteter Fehler ist aufgetreten\.<\/h1>/);
		expect(body).not.toContain(message);
	});

	// #847: SvelteKit refuses a body over BODY_SIZE_LIMIT with its own English words; without JavaScript a file over 10 MB gets here
	it('sagt bei einer zu grossen Datei, dass sie zu gross ist und was zu tun ist, statt «Payload Too Large»', async () => {
		const body = await page(413, 'Payload Too Large');
		expect(body).toMatch(/<h1[^>]*>Die Datei ist zu gross\.<\/h1>/);
		expect(body).toContain('Die Datei ist grösser als 10 MB. Wählen Sie eine kleinere Datei oder verkleinern Sie den Scan.');
		expect(body).not.toContain('Payload Too Large');
		expect(body).not.toContain('Versuchen Sie es später erneut.');
	});

	it('verspricht nichts, was die Seite nicht weiss', async () => {
		expect(await page(404)).not.toContain('nicht betroffen');
	});
});
