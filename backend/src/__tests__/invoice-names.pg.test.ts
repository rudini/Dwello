/**
 * Invoices name their category and distribution key in German as well (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { callApi } from './helpers/auth';
import { invoicedBuilding } from './helpers/records';

type Named = { name: string; nameDE: string };
type Invoice = { buildingId: string; category: Named; distributionKey: Named };

const token = crypto.randomUUID();
let removeBuilding = async () => {};

beforeAll(async () => {
	removeBuilding = await invoicedBuilding(`Rechnungshaus ${token}`, { description: `Hauswart ${token}` });
});

afterAll(async () => {
	await removeBuilding();
});

describe('Rechnungen', () => {
	it('nennen Kategorie und Verteilschlüssel auch deutsch, in der Liste und im Detail', async () => {
		const { invoices } = (await (await callApi(`/api/v1/invoices?search=${token}`)).json()) as { invoices: (Invoice & { id: string })[] };
		const detail = (await (await callApi(`/api/v1/invoices/${invoices[0].id}`)).json()) as Invoice;

		for (const invoice of [invoices[0], detail]) {
			expect(invoice.category).toMatchObject({ name: 'Caretaker', nameDE: 'Hauswart' });
			expect(invoice.distributionKey).toMatchObject({ name: 'Per Area (m²)', nameDE: 'Pro Fläche (m²)' });
		}
	});
});
