/**
 * Managing cost categories through the API (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { generateStatement } from '../services/statement-generation.service';
import { deleteStatement } from '../services/statement.service';
import { callApi } from './helpers/auth';
import { apiRecords, expectRejection, idOf, insertInvoice, invoicedBuilding } from './helpers/records';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
const categories = apiRecords('categories');
let removeBuilding = async () => {};
let removeRepairedBuilding = async () => {};
let removeGardenBuilding = async () => {};

// German and English name alike, as "Neue Kategorie" creates them
const create = (name: string) =>
	categories.create({ name: `${name} ${token}`, nameDE: `${name} ${token}`, isAllowedUtilityCost: true });

afterAll(async () => {
	await removeBuilding();
	await removeRepairedBuilding();
	await removeGardenBuilding();
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

	// #1316: % and _ are characters, not wildcards of the name check or the search
	it('nimmt einen Namen mit % oder _ an, wenn nur ein ähnlicher Name vergeben ist', async () => {
		await create('70 Prozent Lift');
		await categories.create({ name: `Garden ${token}`, nameDE: `Garten A ${token}`, isAllowedUtilityCost: true });

		expect((await create('70% Lift')).status).toBe(201);
		expect((await create('Garten_A')).status).toBe(201); // like the German name of another
		expect((await create('70% lift')).status).toBe(409); // the same name still counts as taken
	});

	it('findet mit _ oder % keine Kategorie, deren Name dort ein anderes Zeichen hat', async () => {
		await create('Kehricht B');

		for (const term of [`Kehricht_B ${token}`, `Kehricht%${token}`]) {
			const response = await categories.send('GET', `?search=${encodeURIComponent(term)}`);
			expect(((await response.json()) as { categories: unknown[] }).categories).toEqual([]);
		}
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

	// #1160: eine Abrechnung geht an den Mieter; ohne ihre Kategorie stünde ein Posten anders da als versendet
	it('behält Kategorien, die in einer Abrechnung stehen, auch ohne Rechnung', async () => {
		const id = await idOf(await create('Treppenhausreinigung'));
		const rental = await createRental(`${token}-1160`, { startDate: '2024-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(rental.building, { categoryId: id });
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31' });
		await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
		try {
			const response = await categories.send('DELETE', `/${id}`);

			await expectRejection(response, 409, 'Die Kategorie steht in einer Abrechnung und kann nicht gelöscht werden. Eine versendete Abrechnung bleibt, wie der Mieter sie erhalten hat, mit ihren Kategorien. Steht die Kategorie nur in Entwürfen, berechnen Sie diese mit «Neu berechnen» auf ihrer Seite neu oder löschen Sie sie. Danach lässt sich die Kategorie löschen.', 'CATEGORY_IN_STATEMENT');
		} finally {
			await deleteStatement(statement.id);
			await rental.remove();
		}
	});

	// #1160 (Fachreview V-1): the refusal of a statement says the category goes once the drafts are recalculated; that
	// holds only while invoices are named first
	it('nennt bei einer Kategorie mit Rechnung und Abrechnung zuerst die Rechnung', async () => {
		const id = await idOf(await create('Dachreinigung'));
		const rental = await createRental(`${token}-1160-in-use`, { startDate: '2024-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(rental.building, { categoryId: id });
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31' });
		try {
			const response = await categories.send('DELETE', `/${id}`);

			await expectRejection(response, 409, 'Die Kategorie wird von 1 Rechnung verwendet und kann nicht gelöscht werden.', 'CATEGORY_IN_USE_ONE', { count: 1 });
		} finally {
			await deleteStatement(statement.id);
			await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
			await rental.remove();
		}
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

	// #452 point 2 (#309): the question before saving names the invoices the save takes out
	it('nennt, wie viele umlagefähige Rechnungen das Speichern ausnehmen würde', async () => {
		const id = await idOf(await create('Gartenpflege'));
		const building = await createBuilding({ name: `Gartenhaus ${token}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' });
		removeGardenBuilding = async () => {
			await db.delete(invoices).where(eq(invoices.buildingId, building.id));
			await deleteBuilding(building.id);
		};
		await insertInvoice(building.id, { categoryId: id });
		await insertInvoice(building.id, { categoryId: id });
		await insertInvoice(building.id, { categoryId: id, isValidUtilityCost: false });

		const category = (await (await categories.send('GET', `/${id}`)).json()) as { allocableInvoiceCount: number };

		expect(category.allocableInvoiceCount).toBe(2);
	});
});
