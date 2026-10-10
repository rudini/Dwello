import { expect } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../../db/connection';
import { categories, distributionKeys, invoices } from '../../db/schema';
import { createBuilding, deleteBuilding } from '../../services/building.service';
import { callApi, sendJson } from './auth';

/** Records of one API resource (e.g. 'categories') that a test creates and removes again */
export function apiRecords(resource: string) {
	const created: string[] = [];
	const send = (method: string, path: string, body?: object) => sendJson(method, `/api/v1/${resource}${path}`, body);
	return {
		send,
		async create(body: object) {
			const response = await send('POST', '', body);
			const record = (await response.clone().json()) as { id?: string };
			if (record.id) created.push(record.id);
			return response;
		},
		async removeAll() {
			for (const id of created) await send('DELETE', `/${id}`);
		}
	};
}

export const idOf = async (response: Response) => ((await response.json()) as { id: string }).id;

export async function expectRejection(response: Response, status: number, error: string) {
	expect(response.status).toBe(status);
	expect(await response.json()).toEqual({ error });
}

/** The first predefined record of a resource, e.g. a predefined heating profile */
export async function firstPredefined(resource: string) {
	const response = await callApi(`/api/v1/${resource}?type=predefined`);
	return ((await response.json()) as { data: { id: string }[] }).data[0].id;
}

type Invoice = {
	categoryId?: string;
	distributionKeyId?: string;
	description?: string;
	amount?: string;
	invoiceDate?: string;
	isValidUtilityCost?: boolean;
};

/** Invoice of the building, by default caretaker costs distributed by area */
export async function insertInvoice(buildingId: string, invoice: Invoice = {}) {
	const [caretaker] = await db.select().from(categories).where(eq(categories.name, 'Caretaker'));
	const [perArea] = await db.select().from(distributionKeys).where(eq(distributionKeys.name, 'Per Area (m²)'));
	await db.insert(invoices).values({
		buildingId,
		categoryId: caretaker.id,
		distributionKeyId: perArea.id,
		billingEntityName: 'Muster AG',
		description: 'Hauswart 2025',
		amount: '1200.00',
		invoiceDate: '2025-03-31',
		isValidUtilityCost: true,
		...invoice
	});
}

/** A building with one invoice; returns its removal */
export async function invoicedBuilding(name: string, invoice: Invoice) {
	const building = await createBuilding({ name, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' });
	await insertInvoice(building.id, invoice);
	return async () => {
		await db.delete(invoices).where(eq(invoices.buildingId, building.id));
		await deleteBuilding(building.id);
	};
}
