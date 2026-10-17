/**
 * Managing cost categories through the API (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { callApi } from './helpers/auth';
import { apiRecords, expectRejection, idOf, invoicedBuilding } from './helpers/records';

const token = crypto.randomUUID();
const categories = apiRecords('categories');
let removeBuilding = async () => {};
let removeRepairedBuilding = async () => {};

// German and English name alike, as "Neue Kategorie" creates them
const create = (name: string) =>
	categories.create({ name: `${name} ${token}`, nameDE: `${name} ${token}`, isAllowedUtilityCost: true });

afterAll(async () => {
	await removeBuilding();
	await removeRepairedBuilding();
	await categories.removeAll();
});

describe('Kostenkategorien', () => {
	it('lehnt einen schon vergebenen Namen verständlich ab', async () => {
		await create('Treppenhaus');

		await expectRejection(await create('Treppenhaus'), 409, `Eine Kategorie mit dem Namen «Treppenhaus ${token}» existiert bereits.`, 'CATEGORY_NAME_TAKEN', {
			name: `Treppenhaus ${token}`
		});
	});

	it('lehnt beim Umbenennen einen vergebenen deutschen Namen ab', async () => {
		await create('Dachrinne');
		const id = await idOf(await create('Fassade'));

		const response = await categories.send('PUT', `/${id}`, { nameDE: `Dachrinne ${token}` });

		await expectRejection(response, 409, `Eine Kategorie mit dem Namen «Dachrinne ${token}» existiert bereits.`, 'CATEGORY_NAME_TAKEN', {
			name: `Dachrinne ${token}`
		});
	});

	// Pellets, Gas, Fernwärme: eigene Heizkosten folgen beim Mieterwechsel dem Heizprofil
	it('legt eine eigene Kategorie als Heiz- und Warmwasserkosten an', async () => {
		const id = await idOf(
			await categories.create({ name: `Pellets ${token}`, nameDE: `Pellets ${token}`, isAllowedUtilityCost: true, isHeatingCost: true })
		);

		const category = (await (await callApi(`/api/v1/categories/${id}`)).json()) as { isHeatingCost: boolean };
		expect(category.isHeatingCost).toBe(true);
	});

	// #100: nur die Heizung bringt Dwello als Brennstoff mit; eine eigene Kategorie ist es erst, wenn der
	// Liegenschaftsverwalter sie so markiert
	it('kennzeichnet die Heizung als Brennstoff, eigene Kategorien erst auf Wunsch', async () => {
		const id = await idOf(
			await categories.create({ name: `Stückholz ${token}`, nameDE: `Stückholz ${token}`, isAllowedUtilityCost: true, isHeatingCost: true })
		);
		const fuel = async () => {
			const { categories: all } = (await (await callApi('/api/v1/categories?limit=100')).json()) as {
				categories: { id: string; name: string; isFuel: boolean }[];
			};
			return Object.fromEntries(all.filter((c) => ['Heating', 'Chimney Sweep'].includes(c.name) || c.id === id).map((c) => [c.name, c.isFuel]));
		};
		expect(await fuel()).toEqual({ Heating: true, 'Chimney Sweep': false, [`Stückholz ${token}`]: false });

		await categories.send('PUT', `/${id}`, { isFuel: true });

		expect((await fuel())[`Stückholz ${token}`]).toBe(true);
	});

	// #100 (Code-Review C-12): Brennstoff ist ein Merkmal von Heizkosten
	it('speichert «Brennstoff» nur zusammen mit Heizkosten', async () => {
		const withoutHeating = await idOf(
			await categories.create({ name: `Gas ${token}`, nameDE: `Gas ${token}`, isAllowedUtilityCost: true, isFuel: true })
		);
		const unticked = await idOf(
			await categories.create({ name: `Pellets B ${token}`, nameDE: `Pellets B ${token}`, isAllowedUtilityCost: true, isHeatingCost: true, isFuel: true })
		);
		await categories.send('PUT', `/${unticked}`, { isHeatingCost: false });

		for (const id of [withoutHeating, unticked]) {
			expect(((await (await callApi(`/api/v1/categories/${id}`)).json()) as { isFuel: boolean }).isFuel).toBe(false);
		}
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
		await expectRejection(response, 409, 'Die Kategorie wird von 1 Rechnung verwendet und kann nicht gelöscht werden.', 'CATEGORY_IN_USE_ONE', {
			count: 1
		});
	});
});

describe('Kategorie wird nicht umlagefähig', () => {
	// Sonst kämen ihre Rechnungen weiter in die Nebenkostenabrechnung (OR 257a)
	it('nimmt ihre Rechnungen aus den umlagefähigen Kosten', async () => {
		const id = await idOf(await create('Unterhalt'));
		removeRepairedBuilding = await invoicedBuilding(`Unterhaltshaus ${token}`, { categoryId: id, description: `Unterhalt ${token}` });

		await categories.send('PUT', `/${id}`, { isAllowedUtilityCost: false });

		const response = await callApi(`/api/v1/invoices?search=${encodeURIComponent(`Unterhalt ${token}`)}`);
		const { invoices } = (await response.json()) as { invoices: { isValidUtilityCost: boolean }[] };
		expect(invoices.map((invoice) => invoice.isValidUtilityCost)).toEqual([false]);
	});
});
