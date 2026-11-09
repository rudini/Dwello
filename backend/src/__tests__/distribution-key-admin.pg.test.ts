/**
 * Managing distribution keys through the API (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import { generateStatement } from '../services/statement-generation.service';
import { deleteStatement } from '../services/statement.service';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { apiRecords, expectRejection, firstPredefined, idOf, insertInvoice, invoicedBuilding } from './helpers/records';
import { createRental } from './helpers/rental';

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

	// #1305: % and _ in a name are characters, not wildcards of the name check
	it('nimmt einen Namen mit % an, wenn nur ein ähnlicher Name vergeben ist', async () => {
		await create('70 Prozent Fläche');

		const response = await create('70% Fläche');

		expect(response.status).toBe(201);
	});

	it('nimmt einen Namen mit _ an, wenn nur ein ähnlicher Name vergeben ist', async () => {
		await create('Haus A');

		const response = await create('Haus_A');

		expect(response.status).toBe(201);
	});

	it('nimmt einen Namen mit \\ an, wenn nur ein ähnlicher Name vergeben ist', async () => {
		await create('Ost West');

		const response = await create('Ost\\ West');

		expect(response.status).toBe(201);
	});

	it('lehnt beim Umbenennen einen vergebenen deutschen Namen ab', async () => {
		await keys.create({ name: `Stairs ${token}`, nameDE: `Treppenhaus ${token}`, formula: '{units}' });
		const id = await idOf(await create('Lift'));

		const response = await keys.send('PUT', `/${id}`, { nameDE: `Treppenhaus ${token}` });

		await expectRejection(response, 409, `Ein Verteilschlüssel mit dem Namen «Treppenhaus ${token}» existiert bereits.`, 'DISTRIBUTION_KEY_NAME_TAKEN', {
			name: `Treppenhaus ${token}`
		});
	});

	// #1200: the name refusal no longer hides the formula error of the same save
	it('nennt beim vergebenen Namen auch den Fehler der Formel', async () => {
		await create('Treppe');

		await expectRejection(
			await create('Treppe', '({area}'),
			409,
			`Ein Verteilschlüssel mit dem Namen «Treppe ${token}» existiert bereits.`,
			'DISTRIBUTION_KEY_NAME_TAKEN',
			{ name: `Treppe ${token}` },
			[{ code: 'FORMULA_UNCLOSED_PARENTHESIS', params: { part: '({area}' } }]
		);
	});

	it('nennt beim Umbenennen auf einen vergebenen Namen auch den Fehler der Formel', async () => {
		await create('Keller');
		const id = await idOf(await create('Estrich'));

		await expectRejection(
			await keys.send('PUT', `/${id}`, { nameDE: `Keller ${token}`, formula: '{area} *' }),
			409,
			`Ein Verteilschlüssel mit dem Namen «Keller ${token}» existiert bereits.`,
			'DISTRIBUTION_KEY_NAME_TAKEN',
			{ name: `Keller ${token}` },
			[{ code: 'FORMULA_MISSING_OPERAND', params: { part: '{area} *' } }]
		);
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

	// #1316: % and _ in the search are characters, not wildcards
	it('findet mit _ oder % keinen Verteilschlüssel, dessen Name dort ein anderes Zeichen hat', async () => {
		await keys.create({ name: `Split C ${token}`, formula: '{area}' });

		for (const term of [`Split_C ${token}`, `Split%${token}`]) {
			const response = await keys.send('GET', `?search=${encodeURIComponent(term)}`);
			expect(((await response.json()) as { data: unknown[] }).data).toEqual([]);
		}
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

	// #1255: eine versendete Abrechnung bleibt, wie der Mieter sie erhalten hat, mit dem Verteilschlüssel jeder Position
	it('behält Verteilschlüssel, die in einer Abrechnung stehen, auch ohne Rechnung', async () => {
		const id = await idOf(await create('Waschküche'));
		const rental = await createRental(`${token}-1255`, { startDate: '2024-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(rental.building, { distributionKeyId: id });
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31' });
		await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
		try {
			const response = await keys.send('DELETE', `/${id}`);

			await expectRejection(response, 409, 'Der Verteilschlüssel steht in einer Abrechnung und kann nicht gelöscht werden. Eine versendete Abrechnung bleibt, wie der Mieter sie erhalten hat, mit ihren Verteilschlüsseln. Steht der Verteilschlüssel nur in Entwürfen, berechnen Sie diese mit «Neu berechnen» auf ihrer Seite neu oder löschen Sie sie. Danach lässt sich der Verteilschlüssel löschen.', 'DISTRIBUTION_KEY_IN_STATEMENT');
		} finally {
			await deleteStatement(statement.id);
			await rental.remove();
		}
	});

	// #1255 (Fachreview V-2): a draft's Tankbestand position takes the default key; recalculating it would put the key back,
	// so the default is named before the statement
	it('nennt bei einem Standard-Verteilschlüssel in einer Abrechnung zuerst den Standard', async () => {
		const id = await idOf(await create('Heizraum'));
		const rental = await createRental(`${token}-1255-default`, { startDate: '2024-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(rental.building, { distributionKeyId: id });
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31' });
		await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
		await setConfig('default_distribution_key_id', id);
		try {
			const response = await keys.send('DELETE', `/${id}`);

			await expectRejection(response, 409, 'Der Verteilschlüssel ist in den Einstellungen als Standard hinterlegt.', 'DISTRIBUTION_KEY_IS_DEFAULT');
		} finally {
			if (previousDefault) await setConfig('default_distribution_key_id', previousDefault);
			else await deleteConfig('default_distribution_key_id');
			await deleteStatement(statement.id);
			await rental.remove();
		}
	});

	// #1255: the refusal of a statement sends the landlord to the drafts; that holds only while invoices are named first
	it('nennt bei einem Verteilschlüssel mit Rechnung und Abrechnung zuerst die Rechnung', async () => {
		const id = await idOf(await create('Dachrinne'));
		const rental = await createRental(`${token}-1255-in-use`, { startDate: '2024-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(rental.building, { distributionKeyId: id });
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31' });
		try {
			const response = await keys.send('DELETE', `/${id}`);

			await expectRejection(response, 409, 'Nach dem Verteilschlüssel wird 1 Rechnung verteilt, er kann nicht gelöscht werden.', 'DISTRIBUTION_KEY_IN_USE_ONE', { count: 1 });
		} finally {
			await deleteStatement(statement.id);
			await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
			await rental.remove();
		}
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
