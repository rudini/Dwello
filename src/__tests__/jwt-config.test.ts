import { afterEach, describe, it, expect } from 'vitest';
import { env } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { jwtConfig } from '$lib/server/jwt-config';

// #577: .env.example names no JWT_SECRET any more (an installation makes its own); development runs without one,
// with the backend's fallback, production never
const kept = { secret: env.JWT_SECRET, mode: process.env.NODE_ENV };
afterEach(() => {
	env.JWT_SECRET = kept.secret;
	process.env.NODE_ENV = kept.mode;
});

describe('Schlüssel der Sitzungen', () => {
	it('nimmt in der Entwicklung ohne JWT_SECRET den Ersatzschlüssel des Backends', () => {
		env.JWT_SECRET = '';
		process.env.NODE_ENV = 'development';

		expect(jwtConfig.secret).toBe('development-secret-key-change-in-production');
	});

	it('startet in der Produktion nicht ohne JWT_SECRET', () => {
		env.JWT_SECRET = '';
		process.env.NODE_ENV = 'production';

		expect(() => jwtConfig.secret).toThrow('JWT_SECRET');
	});
});
