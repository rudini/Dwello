import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import { env } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { setSessionCookie } from '$lib/server/auth';

// S2 (#917, migration-mva.md): a script in the browser cannot read the session; only the BFF sees the JWT
const kept = env.COOKIE_SECURE;
afterEach(() => {
	env.COOKIE_SECURE = kept;
});

const optionsOfSession = () => {
	const set: { name: string; options: Record<string, unknown> }[] = [];
	setSessionCookie(
		{
			set: (name: string, _value: string, options: Record<string, unknown>) =>
				set.push({ name, options })
		} as unknown as Cookies,
		'jwt'
	);
	return set.find((cookie) => cookie.name === 'dwello_session')!.options;
};

describe('Sitzungs-Cookie', () => {
	it('ist für Skripte im Browser nicht lesbar und wird nicht an fremde Seiten mitgeschickt', () => {
		expect(optionsOfSession()).toMatchObject({ httpOnly: true, sameSite: 'lax' });
	});

	it('geht nur über HTTPS, wenn COOKIE_SECURE gesetzt ist, und die Produktion setzt es', () => {
		env.COOKIE_SECURE = 'true';

		expect(optionsOfSession()).toMatchObject({ secure: true });
		expect(readFileSync('docker-compose.prod.yml', 'utf8')).toContain(
			'COOKIE_SECURE=${COOKIE_SECURE:-true}'
		);
	});
});
