/**
 * Every invoice has a Verteilschlüssel (#452 point 7, #379), proposed from the latest invoice of its category in the
 * building (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, distributionKeys, invoices } from '../db/schema';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, insertInvoice } from './helpers/records';

const REQUIRED = ['An invoice needs a distribution key', 'INVOICE_KEY_REQUIRED'] as const;
let buildingId: string;
let caretaker: string;
const key = async (name: string) => (await db.select().from(distributionKeys).where(eq(distributionKeys.name, name)))[0].id;

beforeAll(async () => {
	buildingId = (await createBuilding({ name: `Schlüsselhaus ${crypto.randomUUID()}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' })).id;
	caretaker = (await db.select().from(categories).where(eq(categories.name, 'Caretaker')))[0].id;
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, buildingId));
	await deleteBuilding(buildingId);
});

const invoice = { billingEntityName: 'Muster AG', description: 'Hauswart', amount: '100.00', invoiceDate: '2025-03-31', isValidUtilityCost: true };

describe('Verteilschlüssel einer Rechnung', () => {
	it('ist beim Erfassen Pflicht', async () => {
		const response = await sendJson('POST', '/api/v1/invoices?skipLlm=true', { buildingId, categoryId: caretaker, ...invoice });

		await expectRejection(response, 400, ...REQUIRED);
	});

	it('lässt sich beim Bearbeiten nicht entfernen', async () => {
		const created = await sendJson('POST', '/api/v1/invoices?skipLlm=true', { buildingId, categoryId: caretaker, distributionKeyId: await key('Per Unit'), ...invoice });
		const { id } = (await created.json()) as { id: string };

		await expectRejection(await sendJson('PUT', `/api/v1/invoices/${id}`, { distributionKeyId: null }), 400, ...REQUIRED);
	});

	// recorded before the key was required: other changes still save
	it('lässt eine alte Rechnung ohne Verteilschlüssel andere Angaben ändern', async () => {
		await insertInvoice(buildingId, { distributionKeyId: undefined, description: 'Alt ohne Schlüssel' });
		await db.update(invoices).set({ distributionKeyId: null }).where(eq(invoices.description, 'Alt ohne Schlüssel'));
		const [old] = await db.select().from(invoices).where(eq(invoices.description, 'Alt ohne Schlüssel'));

		const response = await sendJson('PUT', `/api/v1/invoices/${old.id}`, { amount: '90.00' });

		expect(response.status).toBe(200);
	});
});

describe('Vorschlag des Verteilschlüssels', () => {
	it('nennt je Gebäude und Kategorie den Verteilschlüssel der letzten Rechnung mit einem', async () => {
		const [rooms, units] = [await key('Per Rooms'), await key('Per Unit')];
		const [water] = await db.select().from(categories).where(eq(categories.name, 'Cold Water'));
		await insertInvoice(buildingId, { distributionKeyId: units, invoiceDate: '2026-03-31' });
		await insertInvoice(buildingId, { distributionKeyId: rooms, invoiceDate: '2026-12-31' });
		await insertInvoice(buildingId, { categoryId: water.id, distributionKeyId: units, invoiceDate: '2026-06-30' });

		const response = await callApi('/api/v1/invoices/latest-keys');
		const latest = (await response.json()) as { buildingId: string; categoryId: string; distributionKeyId: string }[];

		expect(latest.filter((row) => row.buildingId === buildingId)).toEqual(
			expect.arrayContaining([
				{ buildingId, categoryId: caretaker, distributionKeyId: rooms },
				{ buildingId, categoryId: water.id, distributionKeyId: units }
			])
		);
		expect(latest.filter((row) => row.buildingId === buildingId)).toHaveLength(2);
	});
});
