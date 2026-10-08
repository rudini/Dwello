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
	for (const name of ['Bergtal', 'Standard', 'Winterhalbjahr']) {
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
			error: `Ein Heizprofil mit dem Namen "Bergtal ${token}" existiert bereits.`
		});
	});

	it('verlangt, dass die Monatsanteile 100 % ergeben', async () => {
		const response = await create('Halbjahr', 90);

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			error: 'Die Monatsanteile müssen zusammen 100 % ergeben (aktuell 90 %).'
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
			error: 'Das Heizprofil ist in den Einstellungen als Standard hinterlegt.'
		});
	});

	it('behält vordefinierte Heizprofile', async () => {
		const response = await send('DELETE', `/${await firstPredefined('heating-profiles')}`);

		await expectRejection(response, 400, 'Vordefinierte Heizprofile können nicht gelöscht werden.');
	});
});

describe('Heizprofil bearbeiten', () => {
	it('verlangt auch beim Bearbeiten, dass die Monatsanteile 100 % ergeben', async () => {
		const id = await idOf(await create('Winterhalbjahr'));

		const response = await send('PUT', `/${id}`, { januaryPct: 2 });

		await expectRejection(response, 400, 'Die Monatsanteile müssen zusammen 100 % ergeben (aktuell 90 %).');
	});

	// Die Fehlermeldung erscheint im Formular
	it('behält die Monatsanteile vordefinierter Heizprofile', async () => {
		const response = await send('PUT', `/${await firstPredefined('heating-profiles')}`, shares());

		await expectRejection(response, 400, 'Die Monatsanteile vordefinierter Heizprofile können nicht geändert werden.');
	});
});
