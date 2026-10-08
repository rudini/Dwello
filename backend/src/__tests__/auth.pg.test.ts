/**
 * Every API endpoint except /health requires a valid JWT (real PostgreSQL database for the authorised calls)
 */

import { describe, expect, it } from 'bun:test';
import { app } from '../app';
import { signToken as token } from './helpers/auth';

const endpoints = [
	'/api/v1/dashboard',
	'/api/v1/buildings',
	'/api/v1/apartments',
	'/api/v1/tenants',
	'/api/v1/contracts',
	'/api/v1/categories',
	'/api/v1/invoices',
	'/api/v1/distribution-keys',
	'/api/v1/heating-profiles',
	'/api/v1/config',
	'/api/v1/statements'
];

const status = async (path: string, authorization?: string) =>
	(await app.handle(new Request(`http://localhost${path}`, { headers: authorization ? { authorization } : {} })))
		.status;

describe('API-Zugriff', () => {
	it('lässt den Health-Check ohne Anmeldung zu', async () => {
		expect(await status('/health')).toBe(200);
	});

	it.each(endpoints)('verweigert %s ohne Token', async (path) => {
		expect(await status(path)).toBe(401);
	});

	it.each(endpoints)('verweigert %s mit fremd signiertem Token', async (path) => {
		const forged = await token(new TextEncoder().encode('another-secret-another-secret-123'));
		expect(await status(path, `Bearer ${forged}`)).toBe(401);
	});

	// Mit demselben Schlüssel signiert, aber für eine andere Anwendung ausgestellt
	it.each(endpoints)('verweigert %s mit Token für eine andere Anwendung', async (path) => {
		expect(await status(path, `Bearer ${await token(undefined, 'andere-app')}`)).toBe(401);
	});

	it.each(endpoints)('erlaubt %s mit gültigem Token', async (path) => {
		expect(await status(path, `Bearer ${await token()}`)).toBe(200);
	});
});
