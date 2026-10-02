/**
 * Managing cost categories through the API (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { apiRecords, expectRejection, idOf, invoicedBuilding } from './helpers/records';

const token = crypto.randomUUID();
const categories = apiRecords('categories');
let removeBuilding = async () => {};

// German and English name alike, as "Neue Kategorie" creates them
const create = (name: string) =>
	categories.create({ name: `${name} ${token}`, nameDE: `${name} ${token}`, isAllowedUtilityCost: true });

afterAll(async () => {
	await removeBuilding();
	await categories.removeAll();
});

describe('Kostenkategorien', () => {
	it('lehnt einen schon vergebenen Namen verständlich ab', async () => {
		await create('Treppenhaus');

		await expectRejection(await create('Treppenhaus'), 409, `Eine Kategorie mit dem Namen "Treppenhaus ${token}" existiert bereits.`);
	});

	it('lehnt beim Umbenennen einen vergebenen deutschen Namen ab', async () => {
		await create('Dachrinne');
		const id = await idOf(await create('Fassade'));

		const response = await categories.send('PUT', `/${id}`, { nameDE: `Dachrinne ${token}` });

		await expectRejection(response, 409, `Eine Kategorie mit dem Namen "Dachrinne ${token}" existiert bereits.`);
	});

	it('findet Kategorien über den deutschen Namen', async () => {
		await categories.create({ name: `Stairs ${token}`, nameDE: `Treppenlift ${token}`, isAllowedUtilityCost: true });

		const response = await categories.send('GET', `?search=${encodeURIComponent(`Treppenlift ${token}`)}`);
		const { categories: found } = (await response.json()) as { categories: { name: string }[] };

		expect(found.map((c) => c.name)).toEqual([`Stairs ${token}`]);
	});

	it('behält Kategorien, denen Rechnungen zugeordnet sind', async () => {
		const id = await idOf(await create('Hauswart'));
		removeBuilding = await invoicedBuilding(`Kategorienhaus ${token}`, { categoryId: id });

		const category = (await (await categories.send('GET', `/${id}`)).json()) as { invoiceCount: string };
		const response = await categories.send('DELETE', `/${id}`);

		expect(Number(category.invoiceCount)).toBe(1);
		await expectRejection(response, 409, 'Die Kategorie wird von 1 Rechnung verwendet und kann nicht gelöscht werden.');
	});
});
