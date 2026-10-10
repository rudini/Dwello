import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import LoginPage from '../routes/login/+page.svelte';

const providers = [
	{ id: 'google', name: 'Google', href: '/auth/login?provider=google' },
	{ id: 'microsoft', name: 'Microsoft', href: '/auth/login?provider=microsoft' }
];
const page = (data: Record<string, unknown>) =>
	render(LoginPage, { props: { data: { providers, error: null, ...data } } as never }).body;

describe('Anmeldeseite (Ansicht)', () => {
	it('erklärt die Anmeldung und bietet je Anbieter eine Schaltfläche', () => {
		const body = page({});
		expect(body).toMatch(/<h1[^>]*>Anmelden<\/h1>/);
		expect(body).toMatch(/href="\/auth\/login\?provider=google"[^>]*data-testid="login-google"/);
		expect(body).toContain('Mit Google anmelden');
		expect(body).toContain('Mit Microsoft anmelden');
		expect(body).toContain('href="/terms"');
	});

	it('meldet einen Fehler sofort', () => {
		const body = page({ error: 'Die Anmeldung wurde abgebrochen.' });
		expect(body).toMatch(
			/role="alert"[^>]*data-testid="login-error"|data-testid="login-error"[^>]*role="alert"/
		);
		expect(body).toContain('Die Anmeldung wurde abgebrochen.');
	});

	it('sagt, was fehlt, wenn keine Anmeldung eingerichtet ist', () => {
		expect(page({ providers: [] })).toContain('data-testid="login-unavailable"');
	});
});
