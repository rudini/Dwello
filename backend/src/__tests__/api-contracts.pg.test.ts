/**
 * The backend answers with every field the frontend reads (tests/contracts, real PostgreSQL database):
 * the frontend unit tests use these samples as backend answers, so they cannot drift from the real API.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, sql } from 'drizzle-orm';
import { join } from 'path';
import { db } from '../db/connection';
import { buildings, categories, heatingProfiles, invoices, tenants } from '../db/schema';
import { deleteStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const contracts = join(import.meta.dir, '..', '..', '..', 'tests', 'contracts');
const sample = (name: string) => Bun.file(join(contracts, `${name}.json`)).json();

const kind = (value: unknown) => (value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value);

/** Paths of the sample's fields that the real answer lacks or delivers with another JSON type (null allowed) */
function drift(expected: unknown, actual: unknown, path = ''): string[] {
	if (expected === null || actual === null) return [];
	if (kind(expected) !== kind(actual)) return [`${path || '.'}: ${kind(expected)} erwartet, ${kind(actual)} geliefert`];
	if (Array.isArray(expected)) {
		if (expected.length === 0) return [];
		if ((actual as unknown[]).length === 0) return [`${path}[]: leer geliefert`];
		return drift(expected[0], (actual as unknown[])[0], `${path}[0]`);
	}
	if (kind(expected) !== 'object') return [];
	return Object.entries(expected as Record<string, unknown>).flatMap(([key, value]) =>
		key in (actual as object)
			? drift(value, (actual as Record<string, unknown>)[key], `${path}.${key}`)
			: [`${path}.${key}: fehlt`]
	);
}

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let statementId: string;
const period = { periodStart: '2024-01-01', periodEnd: '2024-12-31' };

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', monthlyAdvancePayment: '150' });
	await insertInvoice(rental.building, { amount: '1000.00', invoiceDate: '2024-03-31' });
	// A year later 50 % more: the check for missing invoices reports a deviation with its percentage
	await insertInvoice(rental.building, { amount: '1500.00', invoiceDate: '2025-06-30' });
	// Optional fields filled, so the contract checks their JSON type too (null is not checked)
	await db
		.update(buildings)
		.set({ latitude: '47.3769', longitude: '8.5417', yearBuilt: 1965, buildingType: 'residential' })
		.where(eq(buildings.id, rental.building));
	await db
		.update(tenants)
		.set({ email: 'anna.keller@example.ch', phone: '+41 44 123 45 67', address: 'Seestrasse 12', postalCode: '8002', city: 'Zürich' })
		.where(eq(tenants.id, rental.tenant));
	await db
		.update(invoices)
		.set({ llmCategoryId: sql`${invoices.categoryId}`, llmConfidence: '0.86', manualOverrideReason: 'Vertrag geprüft' })
		.where(eq(invoices.buildingId, rental.building));
	// a heating profile of the master data: the statement names it (A-10)
	const [profile] = await db.select({ id: heatingProfiles.id }).from(heatingProfiles).limit(1);
	const response = await sendJson('POST', '/api/v1/statements/generate', {
		...period,
		contractId: rental.contract,
		buildingId: rental.building,
		managementFeePercent: 3,
		heatingProfileId: profile.id
	});
	statementId = ((await response.json()) as { id: string }).id;
});

afterAll(async () => {
	await deleteStatement(statementId);
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('API-Verträge des Frontends', () => {
	it('GET /statements/:id liefert die Felder von statement.json', async () => {
		const actual = await (await callApi(`/api/v1/statements/${statementId}`)).json();
		expect(drift(await sample('statement'), actual)).toEqual([]);
	});

	it('GET /contracts?buildingId liefert die Felder von building-contracts.json', async () => {
		const actual = await (await callApi(`/api/v1/contracts?buildingId=${rental.building}&limit=1000`)).json();
		expect(drift(await sample('building-contracts'), actual)).toEqual([]);
	});

	// The caretaker costs of 2025 against 2024: a finding with all its fields
	it('GET /invoices/completeness/:buildingId liefert die Felder von invoice-completeness.json', async () => {
		const actual = await (
			await callApi(`/api/v1/invoices/completeness/${rental.building}?periodStart=2025-01-01&periodEnd=2025-12-31`)
		).json();
		expect(drift(await sample('invoice-completeness'), actual)).toEqual([]);
	});

	it('POST /statements/preview liefert die Felder von statement-preview.json', async () => {
		const actual = await (await sendJson('POST', '/api/v1/statements/preview', { ...period, contractId: rental.contract })).json();
		expect(drift(await sample('statement-preview'), actual)).toEqual([]);
	});

	it('GET /invoices und /invoices/:id liefern die Felder von invoice.json', async () => {
		const listed = (await (await callApi(`/api/v1/invoices?buildingId=${rental.building}`)).json()) as { invoices: { id: string }[] };
		const actual = await (await callApi(`/api/v1/invoices/${listed.invoices[0].id}`)).json();
		expect(drift(await sample('invoice'), listed.invoices[0])).toEqual([]);
		expect(drift(await sample('invoice'), actual)).toEqual([]);
	});

	it('GET /buildings/:id liefert die Felder von building.json', async () => {
		const actual = await (await callApi(`/api/v1/buildings/${rental.building}`)).json();
		expect(drift(await sample('building'), actual)).toEqual([]);
	});

	it('GET /buildings/:id/fuel-stocks liefert die Felder von fuel-stocks.json', async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await sendJson('POST', `/api/v1/buildings/${rental.building}/fuel-stocks`, { readingDate: '2024-12-31', amount: '2650.00', categoryId: heating.id });
		const actual = await (await callApi(`/api/v1/buildings/${rental.building}/fuel-stocks`)).json();
		expect(drift(await sample('fuel-stocks'), actual)).toEqual([]);
	});

	it('GET /contracts/:id liefert die Felder von contract.json', async () => {
		const actual = await (await callApi(`/api/v1/contracts/${rental.contract}`)).json();
		expect(drift(await sample('contract'), actual)).toEqual([]);
	});

	it('GET /tenants/:id liefert die Felder von tenant.json', async () => {
		const actual = await (await callApi(`/api/v1/tenants/${rental.tenant}`)).json();
		expect(drift(await sample('tenant'), actual)).toEqual([]);
	});

	it('GET /buildings liefert die Felder von buildings.json', async () => {
		const actual = await (await callApi(`/api/v1/buildings?search=${encodeURIComponent(`Ahornhof ${token}`)}`)).json();
		expect(drift(await sample('buildings'), actual)).toEqual([]);
	});

	// the 2024 statement already bills the days after 31.03.2024
	it('PUT /contracts/:id mit einem Vertragsende vor einer Abrechnung liefert die Felder von contract-end-refused.json', async () => {
		const response = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { endDate: '2024-03-31' });
		expect(response.status).toBe(409);
		expect(drift(await sample('contract-end-refused'), await response.json())).toEqual([]);
	});

	// a contract with an end and a notice: null fields are not checked (J2-3)
	it('GET /contracts liefert die Felder von contracts.json', async () => {
		const noticed = await createRental(crypto.randomUUID(), { startDate: '2024-04-01', monthlyAdvancePayment: '150' });
		try {
			await sendJson('PUT', `/api/v1/contracts/${noticed.contract}`, { endDate: '2099-03-31', terminated: true });
			const actual = await (await callApi(`/api/v1/contracts?buildingId=${noticed.building}&limit=1000`)).json();
			expect(drift(await sample('contracts'), actual)).toEqual([]);
			expect(actual).toMatchObject({ contracts: [{ endDate: '2099-03-31', terminated: true }] });
		} finally {
			await noticed.remove();
		}
	});

	it('GET /statements einer Periode liefert die Felder von period-statements.json', async () => {
		const actual = await (await callApi(`/api/v1/statements?periodStart=${period.periodStart}&periodEnd=${period.periodEnd}&limit=1000`)).json();
		expect(drift(await sample('period-statements'), actual)).toEqual([]);
	});

	it('GET /tenants liefert die Felder von tenants.json', async () => {
		const actual = await (await callApi(`/api/v1/tenants?search=${encodeURIComponent(`Keller ${token}`)}`)).json();
		expect(drift(await sample('tenants'), actual)).toEqual([]);
	});
});
