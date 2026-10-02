/**
 * Managing cost categories through the API (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { distributionKeys, invoices } from '../db/schema';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { sendJson } from './helpers/auth';

const token = crypto.randomUUID();
const created: string[] = [];
let building: string | undefined;

const send = (method: string, path: string, body?: object) => sendJson(method, `/api/v1/categories${path}`, body);

const create = async (name: string) => {
	const response = await send('POST', '', { name: `${name} ${token}`, nameDE: `${name} ${token}`, isAllowedUtilityCost: true });
	const category = (await response.clone().json()) as { id?: string };
	if (category.id) created.push(category.id);
	return response;
};

afterAll(async () => {
	if (building) {
		await db.delete(invoices).where(eq(invoices.buildingId, building));
		await deleteBuilding(building);
	}
	for (const id of created) await send('DELETE', `/${id}`);
});

describe('Kostenkategorien', () => {
	it('lehnt einen schon vergebenen Namen verständlich ab', async () => {
		await create('Treppenhaus');
		const response = await create('Treppenhaus');

		expect(response.status).toBe(409);
		expect(await response.json()).toEqual({
			error: `Eine Kategorie mit dem Namen "Treppenhaus ${token}" existiert bereits.`
		});
	});

	it('lehnt beim Umbenennen einen vergebenen deutschen Namen ab', async () => {
		await create('Dachrinne');
		const { id } = (await (await create('Fassade')).json()) as { id: string };

		const response = await send('PUT', `/${id}`, { nameDE: `Dachrinne ${token}` });

		expect(response.status).toBe(409);
		expect(await response.json()).toEqual({
			error: `Eine Kategorie mit dem Namen "Dachrinne ${token}" existiert bereits.`
		});
	});

	it('findet Kategorien über den deutschen Namen', async () => {
		await send('POST', '', { name: `Stairs ${token}`, nameDE: `Treppenlift ${token}`, isAllowedUtilityCost: true }).then(
			async (response) => created.push(((await response.json()) as { id: string }).id)
		);

		const response = await send('GET', `?search=${encodeURIComponent(`Treppenlift ${token}`)}`);
		const { categories } = (await response.json()) as { categories: { name: string }[] };

		expect(categories.map((c) => c.name)).toEqual([`Stairs ${token}`]);
	});

	it('behält Kategorien, denen Rechnungen zugeordnet sind', async () => {
		const { id } = (await (await create('Hauswart')).json()) as { id: string };
		building = (
			await createBuilding({ name: `Kategorienhaus ${token}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' })
		).id;
		const [perArea] = await db.select().from(distributionKeys).where(eq(distributionKeys.name, 'Per Area (m²)'));
		await db.insert(invoices).values({
			buildingId: building,
			categoryId: id,
			distributionKeyId: perArea.id,
			billingEntityName: 'Hauswartung AG',
			description: 'Hauswart 2025',
			amount: '1200.00',
			invoiceDate: '2025-03-31',
			isValidUtilityCost: true
		});

		const category = (await (await send('GET', `/${id}`)).json()) as { invoiceCount: string };
		const response = await send('DELETE', `/${id}`);

		expect(Number(category.invoiceCount)).toBe(1);
		expect(response.status).toBe(409);
		expect(await response.json()).toEqual({
			error: 'Die Kategorie wird von 1 Rechnung verwendet und kann nicht gelöscht werden.'
		});
	});
});
