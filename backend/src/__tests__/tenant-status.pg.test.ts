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
	return (
		(await response.json()) as {
			tenants: { firstName: string; isActive: boolean; isFuture: boolean; contractCount: string }[];
		}
	).tenants;
};
const list = async (status = '') => Object.fromEntries((await listed(status)).map((t) => [t.firstName, t.isActive]));

beforeAll(async () => {
	rental = await createRental(token, { startDate: day(-1), monthlyAdvancePayment: '100' });
	await tenantWith('Ehemalig', day(-400), day(-30));
	otherApartment = (
		await createApartment({ buildingId: rental.building, number: '3.01', floor: 3, area: '60', rooms: '2.5' })
	).id;
	await tenantWith('Künftig', day(400), undefined, otherApartment);
	// moved out of one apartment, moves into another later (F-4, #58): künftig, not ehemalig
	await tenantWith('Wieder', day(-400), day(-30), otherApartment);
	contracts.push(
		(
			await createContract({
				apartmentId: otherApartment,
				tenantId: tenants.Wieder,
				startDate: day(100),
				endDate: day(399),
				baseRent: '900',
				monthlyAdvancePayment: '100'
			})
		).id
	);
	await tenantWith('Ohne');
});

afterAll(async () => {
	for (const id of contracts) await deleteContract(id, true);
	for (const id of Object.values(tenants)) await deleteTenant(id);
	await deleteApartment(otherApartment);
	await rental.remove();
});

describe('Mieterliste nach Mietstatus', () => {
	// F-4 (#58): «Aktiv» nur mit laufendem Mietvertrag
	it('kennzeichnet nur Mieter mit laufendem Vertrag als aktiv', async () => {
		expect(await list()).toEqual({ Anna: true, Ehemalig: false, Künftig: false, Ohne: false, Wieder: false });
	});

	it('kennzeichnet Mieter, deren Vertrag erst beginnt, als künftig', async () => {
		const future = Object.fromEntries((await listed()).map((t) => [t.firstName, t.isFuture]));

		expect(future).toEqual({ Anna: false, Ehemalig: false, Künftig: true, Ohne: false, Wieder: true });
	});

	it('zeigt nur aktive Mieter', async () => {
		expect(Object.keys(await list('active'))).toEqual(['Anna']);
	});

	it('zeigt nur künftige Mieter', async () => {
		expect(Object.keys(await list('future')).sort()).toEqual(['Künftig', 'Wieder']);
	});

	it('zählt die Mietverträge jedes Mieters', async () => {
		const counts = Object.fromEntries((await listed()).map((t) => [t.firstName, Number(t.contractCount)]));

		expect(counts).toEqual({ Anna: 1, Ehemalig: 1, Künftig: 1, Ohne: 0, Wieder: 2 });
	});

	it('zeigt nur ehemalige Mieter', async () => {
		expect(Object.keys(await list('inactive'))).toEqual(['Ehemalig']);
	});
});
