import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import LoginPage from '../routes/login/+page.svelte';

const providers = [
	{ id: 'google', name: 'Google', href: '/auth/login?provider=google' },
	{ id: 'microsoft', name: 'Microsoft', href: '/auth/login?provider=microsoft' }
];
const page = (data: Record<string, unknown>, form: Record<string, unknown> | null = null) =>
	render(LoginPage, {
		props: { data: { providers, error: null, password: false, insecure: false, redirectTo: null, ...data }, form } as never
	}).body;

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

	// #576: the unavailable hint sends a self-hoster to the Konto mit Passwort (fach review 576 V-2)
	it('erklärt ohne jede Anmeldung, wie ein Konto mit Passwort entsteht', () => {
		expect(page({ providers: [] })).toContain('Legen Sie ein Konto mit E-Mail-Adresse und Passwort an, wie in der Installationsanleitung beschrieben.');
		expect(page({ providers: [], password: true })).not.toContain('data-testid="login-unavailable"');
	});
});

describe('Anmeldeseite mit Konto mit Passwort (#576)', () => {
	it('bietet E-Mail-Adresse und Passwort neben Google an', () => {
		const body = page({ password: true, redirectTo: '/buildings' });
		expect(body).toContain('Melden Sie sich mit der E-Mail-Adresse und dem Passwort an, die bei der Einrichtung festgelegt wurden.');
		expect(body).toMatch(/<form[^>]*method="POST"[^>]*action="\?\/password"/);
		expect(body).toMatch(/type="email"[^>]*autocomplete="username"|autocomplete="username"[^>]*type="email"/);
		expect(body).toMatch(/type="password"[^>]*autocomplete="current-password"|autocomplete="current-password"[^>]*type="password"/);
		expect(body).toContain('data-testid="login-password-submit"');
		expect(body).toMatch(/name="redirectTo"[^>]*value="\/buildings"|value="\/buildings"[^>]*name="redirectTo"/);
		expect(body).toContain('Passwort vergessen? Der Betreiber Ihrer Dwello-Installation setzt es mit einem Befehl zurück.');
		expect(body).toContain('data-testid="login-google"');
	});

	it('zeigt das Formular nicht, wenn es kein Konto mit Passwort gibt', () => {
		expect(page({})).not.toContain('data-testid="login-password-submit"');
		expect(page({})).toContain('Melden Sie sich mit Ihrem bestehenden Konto an.');
	});

	it('meldet ein falsches Passwort und behält die E-Mail-Adresse', () => {
		const body = page({ password: true }, { email: 'helga@example.ch', error: 'E-Mail-Adresse oder Passwort stimmen nicht.' });
		expect(body).toMatch(/data-testid="login-error"/);
		expect(body).toContain('E-Mail-Adresse oder Passwort stimmen nicht.');
		expect(body).toContain('value="helga@example.ch"');
	});

	// fach review 576 R-1: on plain http the password and every page cross the network unencrypted
	it('warnt bei einer unverschlüsselten Verbindung', () => {
		const body = page({ password: true, insecure: true });
		expect(body).toContain('data-testid="login-insecure"');
		expect(body).toContain('Diese Verbindung ist nicht verschlüsselt');
		expect(body).toContain('Ihr Passwort und alle Daten, auch die Ihrer Mieter, gehen ungeschützt durchs Netz.');
		expect(page({ password: true })).not.toContain('data-testid="login-insecure"');
	});
});
