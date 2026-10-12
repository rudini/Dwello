import { afterEach, describe, expect, it, vi } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { apiCall } from '$lib/api';
import { backendMessage } from '$lib/backend-error';
import { MONTHS } from '$lib/heating-profile';
import { localName } from '$lib/names';
import {
	createDistributionKey,
	testFormula,
	toDistributionKey
} from '$lib/server/distribution-key';
import { toHeatingProfile } from '$lib/server/heating-profile';
import { saveSettings } from '$lib/server/settings';

afterEach(() => {
	overwriteGetLocale(() => baseLocale);
	vi.unstubAllGlobals();
});

const french = () => overwriteGetLocale(() => 'fr');

const form = (fields: Record<string, string>) => {
	const body = new FormData();
	for (const [key, value] of Object.entries(fields)) body.set(key, value);
	return new Request('http://localhost/', { method: 'POST', body });
};

describe('Einstellungen und Stammdaten in der gewählten Sprache', () => {
	it('nennt die Monate des Heizprofils auf Französisch', () => {
		french();
		expect(MONTHS.slice(0, 3).map(({ label }) => label)).toEqual(['Janvier', 'Février', 'Mars']);
	});

	it('nennt die Monate auf Deutsch wie bisher', () => {
		expect(MONTHS.slice(0, 3).map(({ label }) => label)).toEqual(['Januar', 'Februar', 'März']);
	});

	it('nennt den Monat eines negativen Anteils in der gewählten Sprache', () => {
		const body = {
			error: 'Der Anteil für january darf nicht negativ sein.',
			code: 'HEATING_PROFILE_SHARE_NEGATIVE',
			params: { month: 'january' }
		};
		expect(backendMessage(body, '')).toBe('Der Anteil für Januar darf nicht negativ sein.');
		french();
		expect(backendMessage(body, '')).toBe('La part de janvier ne peut pas être négative.');
	});

	it('zeigt Heizprofile und Verteilschlüssel mit ihrem französischen Namen', () => {
		french();
		const names = {
			nameDE: 'Gleichmässig',
			nameFR: 'Uniforme',
			nameIT: 'Uniforme',
			nameEN: 'Even'
		};
		expect(localName(toHeatingProfile({ id: 'hp1', name: 'Even', ...names }))).toBe('Uniforme');
		expect(localName(toDistributionKey({ id: 'k1', name: 'Even', ...names }))).toBe('Uniforme');
	});

	it('meldet eine falsche PLZ auf Französisch', async () => {
		french();
		const result = await saveSettings(fetch, form({ companyPostalCode: '80' }));
		expect(result).toMatchObject({
			data: { errors: { companyPostalCode: 'Le NPA doit comporter 4 chiffres' } }
		});
	});

	it('meldet einen fehlenden Namen des Verteilschlüssels auf Französisch', async () => {
		french();
		const result = await createDistributionKey(fetch, form({ name: '', formula: '{area}' }));
		expect(result).toMatchObject({ data: { errors: { name: 'Le nom est obligatoire' } } });
	});

	it('beschreibt die Beispielwohnungen des Formeltests auf Französisch', async () => {
		french();
		const backend = (async () =>
			Response.json({
				results: [{ apartment: { area: 50, rooms: 2 }, share: '25.00 %' }]
			})) as unknown as typeof fetch;
		const { test } = await testFormula(backend, form({ formula: '{area}' }));
		expect(test.results[0].apartment).toBe('50 m², 2 pièces');
	});

	it('meldet eine abgelaufene Anmeldung auf Französisch', async () => {
		french();
		vi.stubGlobal('fetch', async () => new Response(null, { status: 401 }));
		const { error } = await apiCall('/buildings');
		expect(error?.message).toBe('Votre session a expiré. Veuillez vous reconnecter.');
	});

	it('meldet einen nicht erreichbaren Server auf Französisch', () => {
		french();
		const body = { code: 'SERVICE_UNAVAILABLE', message: 'Backend service unavailable' };
		expect(backendMessage(body, '')).toBe(
			'Le serveur ne répond pas. Veuillez réessayer dans un instant.'
		);
	});
});
