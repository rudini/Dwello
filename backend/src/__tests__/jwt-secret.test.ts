/**
 * The secret the backend checks session JWTs with, refused at start as the BFF refuses it
 * (src/lib/server/jwt-config.ts, #1376)
 */

import { describe, expect, it } from 'bun:test';
import { checkJwtSecret } from '../config/jwt';

describe('JWT-Geheimnis beim Start', () => {
	it('verweigert den Start im Betrieb ohne JWT_SECRET', () => {
		expect(() => checkJwtSecret({ NODE_ENV: 'production' })).toThrow(
			'JWT_SECRET environment variable is required'
		);
	});

	it('verweigert den Start mit einem JWT_SECRET unter 32 Zeichen', () => {
		expect(() => checkJwtSecret({ JWT_SECRET: 'x'.repeat(31) })).toThrow(
			'JWT_SECRET must be at least 32 characters long'
		);
	});

	it('lässt den Start im Betrieb mit einem JWT_SECRET ab 32 Zeichen zu', () => {
		expect(() =>
			checkJwtSecret({ NODE_ENV: 'production', JWT_SECRET: 'x'.repeat(32) })
		).not.toThrow();
	});

	it('lässt den Start in der Entwicklung ohne JWT_SECRET zu', () => {
		expect(() => checkJwtSecret({})).not.toThrow();
	});

	it('bricht den Start des Backends im Betrieb ohne JWT_SECRET ab', () => {
		const run = Bun.spawnSync(['bun', 'src/index.ts'], {
			cwd: `${import.meta.dir}/../..`,
			// empty, not removed: Bun would fill a missing one from a developer's backend/.env
			env: { ...process.env, NODE_ENV: 'production', JWT_SECRET: '', PORT: '0' },
			timeout: 15000
		});
		expect(run.stderr.toString()).toContain('JWT_SECRET environment variable is required');
		expect(run.exitCode).not.toBe(0);
	}, 20000);
});
