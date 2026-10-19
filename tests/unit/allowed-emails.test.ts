import { afterEach, describe, expect, it, vi } from 'vitest';
import { isAllowed } from '$lib/server/allowed-emails';

const google = (email: string, emailVerified = true) => ({ email, provider: 'google', emailVerified });

describe('Zugang nach ALLOWED_EMAILS (#51)', () => {
	afterEach(() => vi.unstubAllEnvs());

	it('lässt nur Adressen der Liste zu, ohne Rücksicht auf Leerzeichen und Grossschreibung', () => {
		vi.stubEnv('ALLOWED_EMAILS', ' Verwalter@Example.com , zweite@example.com');

		expect(isAllowed(google('verwalter@example.com '))).toBe(true);
		expect(isAllowed(google('ZWEITE@example.com'))).toBe(true);
		expect(isAllowed(google('fremd@example.com'))).toBe(false);
	});

	it('lässt mit einer Liste weder Microsoft noch eine Adresse zu, die Google nicht bestätigt hat', () => {
		vi.stubEnv('ALLOWED_EMAILS', 'verwalter@example.com');

		expect(isAllowed({ email: 'verwalter@example.com', provider: 'microsoft' })).toBe(false);
		expect(isAllowed(google('verwalter@example.com', false))).toBe(false);
	});

	it('lässt ohne Liste und mit «*» (öffentliche Demo) jedes Konto zu', () => {
		const microsoft = { email: 'jemand@outlook.com', provider: 'microsoft', emailVerified: false };
		vi.stubEnv('ALLOWED_EMAILS', '');
		expect(isAllowed(microsoft)).toBe(true);

		vi.stubEnv('ALLOWED_EMAILS', ' * ');
		expect(isAllowed(microsoft)).toBe(true);
		expect(isAllowed(google('fremd@example.com', false))).toBe(true);
	});
});
