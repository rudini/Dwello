/**
 * Active and former tenants in the tenant list (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createContract, deleteContract } from '../services/contract.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const day = (offset: number) => new Date(Date.now() + offset * 86_400_000).toISOString().split('T')[0];
const token = crypto.randomUUID();

let rental: Awaited<ReturnType<typeof createRental>>; // Anna Keller rents since yesterday
const tenants: Record<string, string> = {};
const contracts: string[] = [];
let otherApartment: string;

async function tenantWith(name: string, startDate?: string, endDate?: string, apartmentId?: string) {
	tenants[name] = (await createTenant({ firstName: name, lastName: token })).id;
	if (!startDate) return;
	const contract = await createContract({
		apartmentId: apartmentId ?? rental.apartment,
		tenantId: tenants[name],
		startDate,
		endDate,
		baseRent: '900',
		monthlyAdvancePayment: '100'
	});
	contracts.push(contract.id);
}

const listed = async (status = '') => {
	const response = await callApi(`/api/v1/tenants?search=${token}${status && `&status=${status}`}`);
	return ((await response.json()) as { tenants: { firstName: string; isActive: boolean; contractCount: string }[] })
		.tenants;
};
const list = async (status = '') => Object.fromEntries((await listed(status)).map((t) => [t.firstName, t.isActive]));

beforeAll(async () => {
	rental = await createRental(token, { startDate: day(-1), monthlyAdvancePayment: '100' });
	await tenantWith('Ehemalig', day(-400), day(-30));
	otherApartment = (
		await createApartment({ buildingId: rental.building, number: '3.01', floor: 3, area: '60', rooms: '2.5' })
	).id;
	await tenantWith('Künftig', day(400), undefined, otherApartment);
	await tenantWith('Ohne');
});

afterAll(async () => {
	for (const id of contracts) await deleteContract(id, true);
	for (const id of Object.values(tenants)) await deleteTenant(id);
	await deleteApartment(otherApartment);
	await rental.remove();
});

describe('Mieterliste nach Mietstatus', () => {
	it('kennzeichnet Mieter mit laufendem oder künftigem Vertrag als aktiv', async () => {
		expect(await list()).toEqual({ Anna: true, Ehemalig: false, Künftig: true, Ohne: false });
	});

	it('zeigt nur aktive Mieter', async () => {
		expect(Object.keys(await list('active')).sort()).toEqual(['Anna', 'Künftig']);
	});

	it('zählt die Mietverträge jedes Mieters', async () => {
		const counts = Object.fromEntries((await listed()).map((t) => [t.firstName, Number(t.contractCount)]));

		expect(counts).toEqual({ Anna: 1, Ehemalig: 1, Künftig: 1, Ohne: 0 });
	});

	it('zeigt nur ehemalige Mieter', async () => {
		expect(Object.keys(await list('inactive'))).toEqual(['Ehemalig']);
	});
});
