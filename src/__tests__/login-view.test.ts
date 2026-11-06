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

	// #675: the full demo notice after the h1 and before signing in, read once (Sven P-1, review b162-2 C-11)
	it('zeigt in der Demo den ganzen Hinweis nach der Überschrift und vor den Anmeldeknöpfen', () => {
		const body = page({ demo: true });
		const notice = body.indexOf('data-testid="demo-notice"');
		expect(body.indexOf('</h1>')).toBeLessThan(notice);
		expect(notice).toBeLessThan(body.indexOf('data-testid="login-google"'));
		expect(body).toContain('Probieren Sie alles aus');
		expect(body).not.toContain('aria-label="Öffentliche Demo"');
	});

	// moved from the layout (#675): why only made-up data, also for contact data
	it('begründet in der Demo, warum nur erfundene Daten eingegeben werden dürfen, auch bei Kontaktdaten', () => {
		const body = page({ demo: true });
		expect(body).toContain('Alle Besucher sehen und ändern dieselben Daten');
		expect(body).toContain(
			'Geben Sie deshalb nur erfundene Daten ein, auch bei E-Mail-Adressen und Telefonnummern'
		);
	});

	// #675 (fach review V-3, V-4): an own API key would serve every visitor; uploads are made up too
	it('warnt in der Demo vor einem eigenen API-Schlüssel und vor echten Rechnungen', () => {
		const body = page({ demo: true });
		expect(body).toContain('keinen eigenen API-Schlüssel ein: Alle Besucher würden ihn nutzen.');
		expect(body).toContain('Laden Sie nur erfundene Rechnungen und Dokumente hoch.');
	});

	// #675 F3: one's own installation through the operator of the demo; without a contact the sentence is left out
	it('nennt in der Demo den Betreiber für eine eigene Installation, nur wenn ein Kontakt gesetzt ist', () => {
		expect(page({ demo: true, contact: 'betrieb@muster-hosting.ch' })).toContain(
			'Fragen Sie dafür den Betreiber dieser Demo: betrieb@muster-hosting.ch.'
		);
		expect(page({ demo: true, contact: null })).not.toContain('eigene Installation');
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
	// #577: without an account and a provider the sign-in page leads to the setup; this is left for a backend that does
	// not answer (fach review 577 V-5)
	it('sagt ohne jede Anmeldung, dass Dwello seinen Server nicht erreicht und was zu tun ist', () => {
		expect(page({ providers: [] })).toContain('Dwello erreicht seinen Server gerade nicht. Versuchen Sie es in einigen Minuten erneut');
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
