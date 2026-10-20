/**
 * Managing distribution keys through the API (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { apiRecords, expectRejection, firstPredefined, idOf, invoicedBuilding } from './helpers/records';

const token = crypto.randomUUID();
const keys = apiRecords('distribution-keys');
let removeBuilding = async () => {};

// German and English name alike, as "Neuer Verteilschlüssel" creates them
const create = (name: string, formula = '{area}') =>
	keys.create({ name: `${name} ${token}`, nameDE: `${name} ${token}`, formula });

// The test sets the default key; the database keeps the one it had before
let previousDefault: string | null;
beforeAll(async () => {
	previousDefault = await getConfig('default_distribution_key_id');
});

afterAll(async () => {
	if (previousDefault) await setConfig('default_distribution_key_id', previousDefault);
	else await deleteConfig('default_distribution_key_id');
	await removeBuilding();
	await keys.removeAll();
});

describe('Eigene Verteilschlüssel', () => {
	it('lehnt einen schon vergebenen Namen verständlich ab', async () => {
		await create('Fläche und Zimmer');

		const response = await create('Fläche und Zimmer');

		await expectRejection(response, 409, `Ein Verteilschlüssel mit dem Namen «Fläche und Zimmer ${token}» existiert bereits.`, 'DISTRIBUTION_KEY_NAME_TAKEN', {
			name: `Fläche und Zimmer ${token}`
		});
	});

	it('lehnt beim Umbenennen einen vergebenen deutschen Namen ab', async () => {
		await keys.create({ name: `Stairs ${token}`, nameDE: `Treppenhaus ${token}`, formula: '{units}' });
		const id = await idOf(await create('Lift'));

		const response = await keys.send('PUT', `/${id}`, { nameDE: `Treppenhaus ${token}` });

		await expectRejection(response, 409, `Ein Verteilschlüssel mit dem Namen «Treppenhaus ${token}» existiert bereits.`, 'DISTRIBUTION_KEY_NAME_TAKEN', {
			name: `Treppenhaus ${token}`
		});
	});

	it('erklärt, warum eine Formel ungültig ist', async () => {
		await expectRejection(
			await create('Personen', '{persons} * 2'),
			400,
			'Die Formel ist ungültig: Unbekannte Variable {persons}. Erlaubt sind {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}.',
			'FORMULA_INVALID',
			{},
			[{ code: 'FORMULA_UNKNOWN_VARIABLE', params: { variable: 'persons' } }]
		);
	});

	it('findet Verteilschlüssel über den deutschen Namen', async () => {
		await keys.create({ name: `Mixed ${token}`, nameDE: `Gemischt ${token}`, formula: '{area} + {rooms}' });

		const response = await keys.send('GET', `?search=${encodeURIComponent(`Gemischt ${token}`)}`);
		const { data } = (await response.json()) as { data: { name: string }[] };

		expect(data.map((k) => k.name)).toEqual([`Mixed ${token}`]);
	});

	it('behält Verteilschlüssel, nach denen Rechnungen verteilt werden', async () => {
		const id = await idOf(await create('Hauswart'));
		removeBuilding = await invoicedBuilding(`Schlüsselhaus ${token}`, { distributionKeyId: id });

		const key = (await (await keys.send('GET', `/${id}`)).json()) as { invoiceCount: string };
		const response = await keys.send('DELETE', `/${id}`);

		expect(Number(key.invoiceCount)).toBe(1);
		await expectRejection(response, 409, 'Nach dem Verteilschlüssel wird 1 Rechnung verteilt, er kann nicht gelöscht werden.', 'DISTRIBUTION_KEY_IN_USE_ONE', {
			count: 1
		});
	});

	it('behält den Standard-Verteilschlüssel der Einstellungen', async () => {
		const id = await idOf(await create('Standard'));
		await setConfig('default_distribution_key_id', id);

		const response = await keys.send('DELETE', `/${id}`);

		await expectRejection(response, 409, 'Der Verteilschlüssel ist in den Einstellungen als Standard hinterlegt.', 'DISTRIBUTION_KEY_IS_DEFAULT');
	});

	it('behält vordefinierte Verteilschlüssel', async () => {
		const response = await keys.send('DELETE', `/${await firstPredefined('distribution-keys')}`);

		await expectRejection(response, 400, 'Vordefinierte Verteilschlüssel können nicht gelöscht werden.', 'DISTRIBUTION_KEY_PREDEFINED');
	});

	// #461: the form sends an empty name in another language as null; then the German name stands
	it('entfernt einen Namen in einer anderen Sprache, den das Formular leer schickt', async () => {
		const created = await keys.create({ name: `Volumen ${token}`, nameDE: `Volumen ${token}`, nameFR: 'Volume', nameIT: null, formula: '{volume}' });
		expect(created.status).toBe(201);

		const response = await keys.send('PUT', `/${await idOf(created)}`, { nameFR: null });

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ nameFR: null, nameIT: null });
	});

	// #461: the migrations seed them; the second seed list with other names is gone (#345)
	it('legt vordefinierte Verteilschlüssel nur mit den Stammdaten-Migrationen an', async () => {
		const response = await keys.send('POST', '/initialize');

		expect(response.status).toBe(404);
	});
});
