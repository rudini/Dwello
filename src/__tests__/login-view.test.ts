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

	// #82: the privacy statement next to the terms, as information, not as something to accept
	it('verweist auf die Datenschutzerklärung', () => {
		const body = page({});
		expect(body).toMatch(/href="\/privacy"[^>]*data-testid="login-privacy-link"/);
		expect(body).toContain('Wie Dwello Ihre Daten bearbeitet, steht in der');
	});

	// #458 (#347): a landlord who runs Dwello himself has no contract partner, so nothing to accept
	it('verweist auf die Nutzungsbedingungen, ohne eine Zustimmung zu verlangen', () => {
		const body = page({});
		expect(body).toMatch(/data-testid="login-legal"/);
		expect(body).toContain('Was Dwello leistet und wofür Sie verantwortlich sind, steht in den');
		expect(body).not.toContain('akzeptieren');
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
