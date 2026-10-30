import { describe, it, expect } from 'vitest';
import '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { load } from '../routes/config/backup/+page.server';

import pending from '../../tests/contracts/backup-new-code.json';
import setup from '../../tests/contracts/backup-setup.json';
import stale from '../../tests/contracts/health-backup-stale.json';

// «Neuer Wiederherstellungscode» (#718, part 3): what the page offers, by how the landlord signed in
const now = Math.floor(Date.now() / 1000);
const open = (answer: object, user: { provider: string; signedInAt: number }) =>
	load({
		fetch: async () => Response.json(answer),
		url: new URL('http://localhost:3000/config/backup'),
		locals: { user: { sub: 's', email: 'e@dwello.test', name: 'e', ...user } }
	} as never) as Promise<Record<string, unknown>>;

describe('Neuer Wiederherstellungscode', () => {
	it('verlangt mit einem Konto mit Passwort das Passwort', async () => {
		expect(
			await open(
				{ backup: 'ok', since: stale.since },
				{ provider: 'local', signedInAt: now - 3600 }
			)
		).toMatchObject({
			step: 'password'
		});
	});

	it('führt mit Google nach mehr als 10 Minuten zu einer neuen Anmeldung bei Google', async () => {
		expect(
			await open(
				{ backup: 'ok', since: stale.since },
				{ provider: 'google', signedInAt: now - 11 * 60 }
			)
		).toMatchObject({
			step: 'again',
			provider: 'Google',
			signIn: '/auth/login?provider=google&reauth=1&redirectTo=%2Fconfig%2Fbackup'
		});
	});

	it('erstellt mit Google nach einer Anmeldung der letzten Minuten den Code ohne weitere Angabe', async () => {
		expect(
			await open({ backup: 'ok', since: stale.since }, { provider: 'google', signedInAt: now - 60 })
		).toMatchObject({
			step: 'create'
		});
	});

	it('zeigt den neuen Code, solange er auf die Bestätigung wartet', async () => {
		expect(await open(pending, { provider: 'local', signedInAt: now })).toMatchObject({
			code: pending.code
		});
	});

	it('führt ohne bestätigten Code zu «Sicherung einrichten»', async () => {
		await expect(open(setup, { provider: 'local', signedInAt: now })).rejects.toMatchObject({
			location: '/backup'
		});
	});

	it('führt ohne Ordner für die Sicherung zu den Einstellungen', async () => {
		await expect(
			open({ backup: 'off' }, { provider: 'local', signedInAt: now })
		).rejects.toMatchObject({ location: '/config' });
	});
});
