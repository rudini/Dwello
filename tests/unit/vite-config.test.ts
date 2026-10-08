/**
 * The dev server gives the BFF its .env like the production server gets its environment
 */
import { describe, it, expect } from 'vitest';
import { rmSync, writeFileSync } from 'node:fs';
import { resolveConfig } from 'vite';

const envFile = '.env.envcheck.local';

describe('Dev-Server', () => {
	// Die Seiten lesen BACKEND_URL aus process.env; Vite lädt die .env sonst nur für $env/dynamic/private
	it('übernimmt BACKEND_URL aus der .env', async () => {
		writeFileSync(envFile, 'BACKEND_URL=http://backend-aus-env:3001\n');
		try {
			await resolveConfig({ configFile: 'vite.config.ts', mode: 'envcheck' }, 'serve');

			expect(process.env.BACKEND_URL).toBe('http://backend-aus-env:3001');
		} finally {
			rmSync(envFile);
			delete process.env.BACKEND_URL;
		}
	});
});
