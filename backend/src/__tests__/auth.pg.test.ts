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

	it.each(endpoints)('verweigert %s mit Token eines anderen Ausstellers', async (path) => {
		expect(await status(path, `Bearer ${await token(undefined, undefined, 'anderer-aussteller')}`)).toBe(401);
	});

	it.each(endpoints)('erlaubt %s mit gültigem Token', async (path) => {
		expect(await status(path, `Bearer ${await token()}`)).toBe(200);
	});

	// S1 (#936): every route the app registers, taken from the app itself, answers 401 without a session, also before
	// it checks a body or query; only these answer without one, each for its reason
	const PUBLIC: Record<string, string> = {
		'GET /health': 'the health check of Docker and the web app',
		'GET /swagger': 'the API description, no data',
		'GET /swagger/json': 'the API description, no data',
		'GET /api/v1/invoices/llm-recipient': 'the privacy statement, which is public, names the KI',
		'GET /api/v1/mail-transport': 'the privacy statement, which is public, names the mail provider',
		'GET /api/v1/auth/password/': 'the sign-in page asks whether a Konto mit Passwort exists',
		'POST /api/v1/auth/password/': 'the sign-in with a Konto mit Passwort, before there is a session',
		'GET /api/v1/setup/': 'the setup page asks whether Dwello is set up',
		'POST /api/v1/setup/': 'the setup with the Einrichtungscode, before there is a session',
		'OPTIONS /': 'the CORS preflight',
		'OPTIONS /*': 'the CORS preflight'
	};
	const guarded = app.routes.filter((route) => !(`${route.method} ${route.path}` in PUBLIC));

	it.each(guarded.map((route) => [`${route.method} ${route.path}`, route] as const))(
		'verweigert %s ohne Token, auch mit leerem Body',
		async (_name, { method, path }) => {
			const response = await app.handle(
				new Request(`http://localhost${path.replace(/:[^/]+/g, '00000000-0000-0000-0000-000000000000')}`, {
					method,
					headers: { 'content-type': 'application/json' },
					body: ['GET', 'HEAD'].includes(method) ? undefined : '{}'
				})
			);
			expect(response.status).toBe(401);
		}
	);

	it('kennt jede öffentliche Route der Ausnahmeliste noch', () => {
		const registered = new Set(app.routes.map((route) => `${route.method} ${route.path}`));
		expect(Object.keys(PUBLIC).filter((route) => !registered.has(route))).toEqual([]);
	});
});
