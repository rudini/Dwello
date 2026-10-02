import { describe, it, expect } from 'vitest';
import { env } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { load } from '../routes/login/+page.server';

const open = (query = '') => load({ url: new URL(`http://localhost:3000/login${query}`) } as never) as Record<string, unknown>;

describe('Anmeldeseite', () => {
	it('bietet die eingerichteten Anbieter an und führt danach zur verlangten Seite', () => {
		expect(open('?redirectTo=%2Fbuildings')).toEqual({
			providers: [
				{ id: 'google', name: 'Google', href: '/auth/login?provider=google&redirectTo=%2Fbuildings' },
				{ id: 'microsoft', name: 'Microsoft', href: '/auth/login?provider=microsoft&redirectTo=%2Fbuildings' }
			],
			error: null
		});
	});

	it('lässt nicht eingerichtete Anbieter weg', () => {
		const clientId = env.OAUTH_MICROSOFT_CLIENT_ID;
		env.OAUTH_MICROSOFT_CLIENT_ID = '';
		try {
			expect((open().providers as { id: string }[]).map((p) => p.id)).toEqual(['google']);
		} finally {
			env.OAUTH_MICROSOFT_CLIENT_ID = clientId;
		}
	});

	it.each([
		['cancelled', 'Die Anmeldung wurde abgebrochen.'],
		['failed', 'Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.'],
		['unknown', null],
		['constructor', null]
	])('zeigt den Hinweis zu %s', (error, message) => {
		expect(open(`?error=${error}`).error).toBe(message);
	});
});
