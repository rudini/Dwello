/**
 * Creating and deleting custom heating profiles through the API (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { getHeatingProfileByName, deleteHeatingProfile } from '../services/heating-profile.service';
import { sendJson } from './helpers/auth';
import { expectRejection, firstPredefined, idOf } from './helpers/records';

const token = crypto.randomUUID();
const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

// 12 monthly shares, the first one adjusted so they sum to `total`
const shares = (total = 100) =>
	Object.fromEntries(months.map((month, i) => [`${month}Pct`, i === 0 ? total - 88 : 8]));

const send = (method: string, path: string, body?: object) => sendJson(method, `/api/v1/heating-profiles${path}`, body);

const create = (name: string, total = 100) => send('POST', '', { name: `${name} ${token}`, ...shares(total) });

// The test sets the default profile; the database keeps the one it had before
let previousDefault: string | null;
beforeAll(async () => {
	previousDefault = await getConfig('default_heating_profile_id');
});

afterAll(async () => {
	if (previousDefault) await setConfig('default_heating_profile_id', previousDefault);
	else await deleteConfig('default_heating_profile_id');
	for (const name of ['Bergtal', 'Hochtal', 'Standard', 'Winterhalbjahr', 'Talboden']) {
		const profile = await getHeatingProfileByName(`${name} ${token}`);
		if (profile) await deleteHeatingProfile(profile.id);
	}
});

describe('Eigene Heizprofile', () => {
	it('lehnt einen schon vergebenen Namen verständlich ab', async () => {
		await create('Bergtal');
		const response = await create('Bergtal');

		expect(response.status).toBe(409);
		expect(await response.json()).toEqual({
			error: `Ein Heizprofil mit dem Namen «Bergtal ${token}» existiert bereits.`,
			code: 'HEATING_PROFILE_NAME_TAKEN',
			params: { name: `Bergtal ${token}` }
		});
	});

	// #655: the form sends the German name as `name`, a predefined profile has it as `nameDE`
	it('lehnt den deutschen Namen eines vordefinierten Heizprofils ab', async () => {
		const response = await send('POST', '', { name: 'Heizung + Warmwasser', ...shares() });

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'HEATING_PROFILE_NAME_TAKEN' });
	});

	it('verlangt, dass die Monatsanteile 100 % ergeben', async () => {
		const response = await create('Halbjahr', 90);

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			error: 'Die Monatsanteile müssen zusammen 100 % ergeben (aktuell 90 %).',
			code: 'HEATING_PROFILE_SHARES_SUM',
			params: { sum: 90 }
		});
	});

	it('löscht ein eigenes Heizprofil', async () => {
		const id = await idOf(await create('Kurzzeit'));

		expect((await send('DELETE', `/${id}`)).status).toBe(204);
	});

	it('behält das Standard-Heizprofil der Einstellungen', async () => {
		const id = await idOf(await create('Standard'));
		await setConfig('default_heating_profile_id', id);

		const response = await send('DELETE', `/${id}`);

		expect(response.status).toBe(409);
		expect(await response.json()).toEqual({
			error: 'Das Heizprofil ist in den Einstellungen als Standard hinterlegt.',
			code: 'HEATING_PROFILE_IS_DEFAULT',
			params: {}
		});
	});

	it('behält vordefinierte Heizprofile', async () => {
		const response = await send('DELETE', `/${await firstPredefined('heating-profiles')}`);

		await expectRejection(response, 400, 'Vordefinierte Heizprofile können nicht gelöscht werden.', 'HEATING_PROFILE_PREDEFINED');
	});
});

describe('Heizprofil bearbeiten', () => {
	it('verlangt auch beim Bearbeiten, dass die Monatsanteile 100 % ergeben', async () => {
		const id = await idOf(await create('Winterhalbjahr'));

		// Januar von 12 auf 2 %, die übrigen elf Monate je 8 %
		const response = await send('PUT', `/${id}`, { januaryPct: 2 });

		await expectRejection(response, 400, 'Die Monatsanteile müssen zusammen 100 % ergeben (aktuell 90 %).', 'HEATING_PROFILE_SHARES_SUM', {
			sum: 90
		});
	});

	// #655: also when an own profile is renamed to a predefined profile's German name
	it('lehnt beim Umbenennen den deutschen Namen eines vordefinierten Heizprofils ab', async () => {
		const id = await idOf(await create('Talboden'));
		const response = await send('PUT', `/${id}`, { name: 'Heizung + Warmwasser' });

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'HEATING_PROFILE_NAME_TAKEN' });
	});

	// #461: das Formular schickt einen leeren Namen in einer anderen Sprache als null; dann gilt der deutsche Name
	it('entfernt einen Namen in einer anderen Sprache, den das Formular leer schickt', async () => {
		const created = await send('POST', '', { name: `Hochtal ${token}`, nameIT: 'Valle', nameFR: null, ...shares() });
		expect(created.status).toBe(201);

		const response = await send('PUT', `/${await idOf(created)}`, { nameIT: null });

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ nameIT: null, nameFR: null });
	});

	// Die Oberfläche bietet das Bearbeiten nicht an; die API lehnt es verständlich ab
	it('behält die Monatsanteile vordefinierter Heizprofile', async () => {
		const response = await send('PUT', `/${await firstPredefined('heating-profiles')}`, shares());

		await expectRejection(response, 400, 'Die Monatsanteile vordefinierter Heizprofile können nicht geändert werden.', 'HEATING_PROFILE_SHARES_FIXED');
	});
});
