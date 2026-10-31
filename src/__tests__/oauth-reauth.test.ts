import { describe, it, expect } from 'vitest';
import '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { generateOAuthUrl } from '$lib/server/oauth';

// #718, part 3: a new Wiederherstellungscode needs a new sign-in with Google, not the one the browser still holds
describe('Erneute Anmeldung mit Google', () => {
	it('verlangt bei Google eine neue Anmeldung statt nur die Wahl des Kontos', () => {
		const url = new URL(generateOAuthUrl('google', 'state', { again: true }));
		expect(url.searchParams.get('prompt')).toBe('login');
		expect(url.searchParams.get('max_age')).toBe('0');
	});

	it('lässt die gewöhnliche Anmeldung bei der Wahl des Kontos', () => {
		const url = new URL(generateOAuthUrl('google', 'state'));
		expect(url.searchParams.get('prompt')).toBe('select_account');
		expect(url.searchParams.has('max_age')).toBe(false);
	});
});
