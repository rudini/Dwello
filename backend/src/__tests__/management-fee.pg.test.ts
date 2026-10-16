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
		monthlyAdvancePayment: '0'
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
