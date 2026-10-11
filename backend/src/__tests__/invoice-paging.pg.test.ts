/**
 * Paging through the invoice list shows every invoice once (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import { listInvoices } from '../services/invoice.service';
import { insertInvoice, invoicedBuilding } from './helpers/records';
import { buildings } from '../db/schema';

const token = crypto.randomUUID();
let removeBuilding = async () => {};

// Loaded together (demo data, an import): same invoice date, same recording time
beforeAll(async () => {
	removeBuilding = await invoicedBuilding(`Blätterhaus ${token}`, { description: `Rechnung ${token} 0` });
	const [building] = await db.select().from(buildings).where(eq(buildings.name, `Blätterhaus ${token}`));
	// 40 invoices with different dates, two of the same day at the end of the first page (Allgemeinstrom and Wasser)
	const date = (i: number) => (i === 20 ? '2025-06-30' : `2025-${String(1 + Math.floor(i / 4)).padStart(2, '0')}-${String(1 + (i % 4) * 7).padStart(2, '0')}`);
	for (let i = 1; i < 40; i++) await insertInvoice(building.id, { description: `Rechnung ${token} ${i}`, invoiceDate: i === 19 ? '2025-06-30' : date(i) });
	await db.update(invoices).set({ createdAt: new Date('2026-01-01T00:00:00Z') }).where(eq(invoices.buildingId, building.id));
});

afterAll(() => removeBuilding());

describe('Rechnungsliste', () => {
	// Fehler behoben: bei gleichem Datum fehlte beim Blättern eine Rechnung, eine andere stand doppelt
	it('zeigt beim Blättern jede Rechnung genau einmal', async () => {
		const seen: string[] = [];
		const [building] = await db.select().from(buildings).where(eq(buildings.name, `Blätterhaus ${token}`));
		for (let offset = 0; offset < 40; offset += 20) {
			seen.push(...(await listInvoices({ buildingId: building.id, dateFrom: '2025-01-01', dateTo: '2025-12-31', limit: 20, offset })).invoices.map((invoice) => invoice.id));
		}

		expect(new Set(seen).size).toBe(40);
	});
});
