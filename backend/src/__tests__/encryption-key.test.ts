/**
 * The key the stored KI API key is encrypted with, refused at start when it is too short to derive a safe key from,
 * as JWT_SECRET is (config/jwt.ts, #1437)
 */

import { describe, expect, it } from 'bun:test';
import { checkEncryptionKey } from '../services/ki-settings.service';

describe('Schlüssel für gespeicherte Geheimnisse beim Start', () => {
	it('verweigert den Start mit einem ENCRYPTION_KEY unter 32 Zeichen', () => {
		expect(() => checkEncryptionKey({ ENCRYPTION_KEY: 'x'.repeat(31) })).toThrow(
			'ENCRYPTION_KEY must be at least 32 characters long'
		);
	});

	it('lässt den Start mit einem ENCRYPTION_KEY ab 32 Zeichen zu', () => {
		expect(() => checkEncryptionKey({ ENCRYPTION_KEY: 'x'.repeat(32) })).not.toThrow();
	});

	it('lässt den Start ohne ENCRYPTION_KEY zu', () => {
		expect(() => checkEncryptionKey({})).not.toThrow();
	});

	it('bricht den Start des Backends mit einem zu kurzen ENCRYPTION_KEY ab', () => {
		const run = Bun.spawnSync(['bun', 'src/index.ts'], {
			cwd: `${import.meta.dir}/../..`,
			env: { ...process.env, ENCRYPTION_KEY: 'zu-kurz', PORT: '0' },
			timeout: 15000
		});
		expect(run.stderr.toString()).toContain('ENCRYPTION_KEY must be at least 32 characters long');
		expect(run.exitCode).not.toBe(0);
	}, 20000);
});
