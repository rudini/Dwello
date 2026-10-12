import { describe, it, expect, vi } from 'vitest';
import { handle } from '../hooks.server';

// Runs the server hook without a session; `resolve` stands for rendering the page
async function visitSignedOut(path: string) {
	const url = new URL(`http://localhost:3000${path}`);
	const event = {
		url,
		request: new Request(url),
		cookies: { get: () => undefined },
		locals: {} as App.Locals
	};
	const resolve = vi.fn(async () => new Response('Seite'));
	return (await handle({ event, resolve } as never)).text();
}

describe('Hilfe und Rechtliches ohne Anmeldung', () => {
	it.each(['/help', '/privacy', '/terms'])('zeigt %s auch ohne Anmeldung', async (path) => {
		expect(await visitSignedOut(path)).toBe('Seite');
	});

	it.each(['/helpdesk', '/help/x', '/privacy-foo', '/terms/', '/dashboard'])(
		'schützt %s weiterhin',
		async (path) => {
			expect(await visitSignedOut(path)).toBe('');
		}
	);
});
