/**
 * The secret the backend checks session JWTs with, as the BFF requires it (src/lib/server/jwt-config.ts, #1376)
 */

import { describe, expect, it } from 'bun:test';
import { jwtSecret } from '../config/jwt';

describe('JWT-Geheimnis beim Start', () => {
	it('verweigert den Start im Betrieb ohne JWT_SECRET', () => {
		expect(() => jwtSecret({ NODE_ENV: 'production' })).toThrow(
			'JWT_SECRET environment variable is required'
		);
	});

	it('verweigert den Start im Betrieb mit einem JWT_SECRET unter 32 Zeichen', () => {
		expect(() => jwtSecret({ NODE_ENV: 'production', JWT_SECRET: 'x'.repeat(31) })).toThrow(
			'JWT_SECRET must be at least 32 characters long'
		);
	});

	it('nimmt im Betrieb ein JWT_SECRET ab 32 Zeichen', () => {
		expect(jwtSecret({ NODE_ENV: 'production', JWT_SECRET: 'x'.repeat(32) })).toBe('x'.repeat(32));
	});

	it('nimmt in der Entwicklung ohne JWT_SECRET das Entwicklungsgeheimnis des BFF', () => {
		expect(jwtSecret({})).toBe('development-secret-key-change-in-production');
	});

	it('bricht das Laden der Anmeldeprüfung im Betrieb ohne JWT_SECRET ab', () => {
		const { JWT_SECRET: _, ...env } = process.env;
		const run = Bun.spawnSync(['bun', '-e', "await import('./src/middleware/auth')"], {
			cwd: `${import.meta.dir}/../..`,
			env: { ...env, NODE_ENV: 'production' }
		});
		expect(run.exitCode).not.toBe(0);
		expect(run.stderr.toString()).toContain('JWT_SECRET environment variable is required');
	});
});
