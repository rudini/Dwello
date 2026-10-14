/**
 * The statement list shows only one Mietvertrag's statements (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createContract, deleteContract } from '../services/contract.service';
import { deleteStatement, generateStatement } from '../services/statement.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const period = { periodStart: '2024-01-01', periodEnd: '2024-12-31' };
let rental: Awaited<ReturnType<typeof createRental>>;
let other: { apartment: string; tenant: string; contract: string };
const generated: string[] = [];

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-01-01', monthlyAdvancePayment: '150' });
	const apartment = await createApartment({ buildingId: rental.building, number: '2.02', floor: 2, area: '60', rooms: '2.5' });
	const tenant = await createTenant({ firstName: 'Ben', lastName: `Meier ${crypto.randomUUID()}` });
	const contract = await createContract({
		apartmentId: apartment.id,
		tenantId: tenant.id,
		baseRent: '900',
		startDate: '2024-01-01',
		monthlyAdvancePayment: '120'
	});
	other = { apartment: apartment.id, tenant: tenant.id, contract: contract.id };
	for (const contractId of [rental.contract, other.contract]) {
		generated.push((await generateStatement({ contractId, buildingId: rental.building, ...period })).id);
	}
});

afterAll(async () => {
	for (const id of generated) await deleteStatement(id);
	await deleteContract(other.contract);
	await deleteTenant(other.tenant);
	await deleteApartment(other.apartment);
	await rental.remove();
});

describe('Abrechnungen eines Mietvertrags', () => {
	it('zeigt nur die Abrechnungen dieses Mietvertrags und zählt nur sie', async () => {
		const response = await callApi(`/api/v1/statements?contractId=${rental.contract}`);
		const { data, total } = (await response.json()) as { data: { contractId: string }[]; total: number };

		expect(data.map((s) => s.contractId)).toEqual([rental.contract]);
		expect(total).toBe(1);
	});

	it('zählt die Status nur über die Abrechnungen dieses Mietvertrags', async () => {
		const counts = (await (await callApi(`/api/v1/statements/counts?contractId=${rental.contract}`)).json()) as {
			draft: number;
			total: number;
		};

		expect(counts).toMatchObject({ draft: 1, total: 1 });
	});

	it('zählt eine versendete Abrechnung mit vergangener Frist als überfällig, nicht als versendet', async () => {
		await db
			.update(utilityStatements)
			.set({ status: 'sent', paymentDeadline: '2025-03-31' })
			.where(eq(utilityStatements.contractId, other.contract));

		const counts = (await (await callApi(`/api/v1/statements/counts?contractId=${other.contract}`)).json()) as object;

		expect(counts).toMatchObject({ draft: 0, sent: 0, overdue: 1, total: 1 });
	});
});
