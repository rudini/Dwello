/**
 * The management fee is a percentage of the tenant's own utility costs, so the tenant can check the rate on the
 * statement (real PostgreSQL database)
 *
 * Apartment 1.01 (50 m²) and 1.02 (150 m²), caretaker invoice CHF 1000 by area.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import { createApartment, deleteApartment, updateApartment } from '../services/apartment.service';
import { createContract, deleteContract } from '../services/contract.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let small: Awaited<ReturnType<typeof createRental>>;
let large: { apartment: string; tenant: string; contract: string };

const fee = async (contractId: string) =>
	(
		(await (
			await callApi('/api/v1/statements/preview', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contractId,
					periodStart: '2024-01-01',
					periodEnd: '2024-12-31',
					managementFeePercent: 3
				})
			})
		).json()) as { managementFee: number }
	).managementFee;

beforeAll(async () => {
	small = await createRental(token, { startDate: '2020-01-01', monthlyAdvancePayment: '0' });
	await updateApartment(small.apartment, { area: '50' });
	const apartment = await createApartment({ buildingId: small.building, number: '1.02', floor: 1, area: '150', rooms: '4.5' });
	const tenant = await createTenant({ firstName: 'Beat', lastName: `Huber ${token}` });
	const contract = await createContract({
		apartmentId: apartment.id,
		tenantId: tenant.id,
		startDate: '2024-07-01',
		baseRent: '1900',
		monthlyAdvancePayment: '0',
		managementFeeAgreed: true
	});
	large = { apartment: apartment.id, tenant: tenant.id, contract: contract.id };
	await insertInvoice(small.building, { amount: '1000.00', invoiceDate: '2024-06-30' });
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, small.building));
	await deleteContract(large.contract, true);
	await deleteTenant(large.tenant);
	await deleteApartment(large.apartment);
	await small.remove();
});

describe('Verwaltungspauschale aus den eigenen Nebenkosten', () => {
	// Prozentsatz der eigenen Nebenkosten des Mieters, so lässt sie sich direkt nachrechnen
	it('berechnet die Pauschale als Prozentsatz der eigenen Nebenkosten des Mieters', async () => {
		// 50 von 200 m² der Hauswartrechnung (250.00) das ganze Jahr: 3 % = 7.50
		expect(await fee(small.contract)).toBe(7.5);
		// 150 von 200 m² (750.00) für 184 von 366 Tagen = 377.05: 3 % = 11.31
		expect(await fee(large.contract)).toBe(11.31);
	});

	it('hält den gewählten Satz mit der Abrechnung fest', async () => {
		const response = await sendJson('POST', '/api/v1/statements/generate', {
			contractId: small.contract,
			buildingId: small.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			managementFeePercent: 3
		});
		const { id } = (await response.json()) as { id: string };
		try {
			const stored = (await (await callApi(`/api/v1/statements/${id}`)).json()) as Record<string, unknown>;
			expect(stored).toMatchObject({ managementFee: '7.50', managementFeePercent: '3.00' });
		} finally {
			await sendJson('DELETE', `/api/v1/statements/${id}`);
		}
	});
});

// #124: höchstens 10 %; der Höchstsatz fängt auch Tippfehler wie 1000 statt 10 ab, ohne Datenbankfehler
describe('Höchstsatz der Verwaltungspauschale', () => {
	const run = (path: 'preview' | 'generate', managementFeePercent: number) =>
		sendJson('POST', `/api/v1/statements/${path}`, {
			contractId: small.contract,
			buildingId: small.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			managementFeePercent
		});

	it('rechnet und speichert mit dem Höchstsatz', async () => {
		expect(((await (await run('preview', 10)).json()) as { managementFee: number }).managementFee).toBe(25);
		const response = await run('generate', 10);
		const { id } = (await response.json()) as { id: string };
		try {
			const stored = (await (await callApi(`/api/v1/statements/${id}`)).json()) as Record<string, unknown>;
			expect(stored).toMatchObject({ managementFee: '25.00', managementFeePercent: '10.00' });
		} finally {
			await sendJson('DELETE', `/api/v1/statements/${id}`);
		}
	});

	it('lehnt einen Satz über dem Höchstsatz bei Vorschau und Erstellen ab', async () => {
		for (const path of ['preview', 'generate'] as const) {
			const response = await run(path, 10.01);
			expect(response.status).toBe(422);
		}
		const { data } = (await (await callApi(`/api/v1/statements?contractId=${small.contract}`)).json()) as {
			data: unknown[];
		};
		expect(data).toEqual([]);
	});

	it('speichert den Höchstsatz als Einstellung und lehnt einen höheren ab', async () => {
		const before = (await (await callApi('/api/v1/config')).json()) as { data: { management_fee_pct: string } };
		try {
			expect((await sendJson('PUT', '/api/v1/config', { management_fee_pct: '10' })).status).toBe(200);
			const refused = await sendJson('PUT', '/api/v1/config', { management_fee_pct: '10.01' });
			expect(refused.status).toBe(400);
			const after = (await (await callApi('/api/v1/config')).json()) as { data: { management_fee_pct: string } };
			expect(after.data.management_fee_pct).toBe('10');
		} finally {
			await sendJson('PUT', '/api/v1/config', { management_fee_pct: before.data.management_fee_pct });
		}
	});
});

// #89: die Pauschale gilt nur, wo sie im Mietvertrag vereinbart ist (Art. 257a Abs. 2 OR); ein eigener Satz geht vor
describe('Verwaltungspauschale nach Mietvertrag', () => {
	const agree = (managementFeeAgreed: boolean, managementFeePercent: string | null = null) =>
		sendJson('PUT', `/api/v1/contracts/${small.contract}`, { managementFeeAgreed, managementFeePercent });
	afterAll(() => agree(true));

	it('rechnet ohne vereinbarte Verwaltungspauschale keine Pauschale', async () => {
		expect((await agree(false)).status).toBe(200);
		expect(await fee(small.contract)).toBe(0);
	});

	it('rechnet mit dem eigenen Satz des Mietvertrags statt mit dem Satz des Abrechnungslaufs', async () => {
		expect((await agree(true, '2')).status).toBe(200);
		// 2 % von 250.00
		expect(await fee(small.contract)).toBe(5);
	});

	it('hält den Satz fest, mit dem die Abrechnung gerechnet ist', async () => {
		await agree(false);
		const response = await sendJson('POST', '/api/v1/statements/generate', {
			contractId: small.contract,
			buildingId: small.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			managementFeePercent: 3
		});
		const { id } = (await response.json()) as { id: string };
		try {
			const stored = (await (await callApi(`/api/v1/statements/${id}`)).json()) as Record<string, unknown>;
			expect(stored).toMatchObject({ managementFee: '0.00', managementFeePercent: '0.00' });
		} finally {
			await sendJson('DELETE', `/api/v1/statements/${id}`);
		}
	});

	it('nennt die Vereinbarung am Mietvertrag; ohne Angabe ist keine vereinbart', async () => {
		await agree(true, '4');
		expect(await (await callApi(`/api/v1/contracts/${small.contract}`)).json()).toMatchObject({
			managementFeeAgreed: true,
			managementFeePercent: '4.00'
		});
		const tenant = await createTenant({ firstName: 'Carla', lastName: `Graf ${token}` });
		const apartment = await createApartment({ buildingId: small.building, number: '1.03', floor: 1, area: '1', rooms: '1' });
		const created = await sendJson('POST', '/api/v1/contracts', {
			apartmentId: apartment.id,
			tenantId: tenant.id,
			startDate: '2030-01-01',
			baseRent: '900',
			monthlyAdvancePayment: '0'
		});
		const contract = (await created.json()) as { id: string; managementFeeAgreed: boolean; managementFeePercent: string | null };
		try {
			expect(contract).toMatchObject({ managementFeeAgreed: false, managementFeePercent: null });
		} finally {
			await deleteContract(contract.id);
			await deleteTenant(tenant.id);
			await deleteApartment(apartment.id);
		}
	});

	// code review C-7: «Nein» forgets an own rate; agreeing again later does not bring an old rate back
	it('vergisst mit «Nein» einen eigenen Satz', async () => {
		await agree(true, '2');
		await agree(false, '2');
		expect(await (await callApi(`/api/v1/contracts/${small.contract}`)).json()).toMatchObject({
			managementFeeAgreed: false,
			managementFeePercent: null
		});
		await sendJson('PUT', `/api/v1/contracts/${small.contract}`, { managementFeeAgreed: true });
		expect(await fee(small.contract)).toBe(7.5);
	});

		it('lehnt einen eigenen Satz über dem Höchstsatz ab', async () => {
		expect((await agree(true, '10.01')).status).toBe(422);
	});
});

