/**
 * Apartment status follows the rental contracts on every day (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { db } from '../db/connection';
import { rentalContracts } from '../db/schema';
import { inArray } from 'drizzle-orm';
import {
	createApartment,
	deleteApartment,
	getApartment,
	listApartments,
	updateApartment
} from '../services/apartment.service';
import { getBuilding } from '../services/building.service';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const day = (offset: number) => new Date(Date.now() + offset * 86_400_000).toISOString().split('T')[0];

let rental: Awaited<ReturnType<typeof createRental>>;
const contracts: string[] = [];

// Contracts written directly: the status must not depend on the contract service updating a stored value
async function contractFor(apartmentId: string, startDate: string, endDate: string | null = null) {
	const [contract] = await db
		.insert(rentalContracts)
		.values({ apartmentId, tenantId: rental.tenant, startDate, endDate, baseRent: '900', monthlyAdvancePayment: '100' })
		.returning();
	contracts.push(contract.id);
}

async function apartment(number: string, status: 'vacant' | 'reserved' = 'vacant') {
	return (await createApartment({ buildingId: rental.building, number, floor: 1, area: '50', rooms: '2', status })).id;
}

const statusOf = async (id: string) => (await getApartment(id))!.status;

beforeAll(async () => {
	// Apartment 2.01 rented since yesterday
	rental = await createRental(crypto.randomUUID(), { startDate: day(-1), monthlyAdvancePayment: '100' });
});

afterAll(async () => {
	await db.delete(rentalContracts).where(inArray(rentalContracts.id, contracts));
	for (const a of (await listApartments({ buildingId: rental.building })).apartments) {
		if (a.id !== rental.apartment) await deleteApartment(a.id);
	}
	await rental.remove();
});

describe('Wohnungsstatus aus den Mietverträgen', () => {
	it('ist vermietet, solange heute ein Vertrag läuft', async () => {
		const id = await apartment('1.01');
		await contractFor(id, day(-30));

		expect(await statusOf(id)).toBe('occupied');
	});

	it('ist wiedervermietet ab Beginn eines künftigen Vertrags', async () => {
		const id = await apartment('1.02', 'reserved');
		await contractFor(id, day(-90), day(-1));
		await contractFor(id, day(30));
		await contractFor(id, day(60));

		const relet = (await getApartment(id))!;
		expect(relet.status).toBe('relet');
		expect(relet.nextContractStart).toBe(day(30));
	});

	// A-4: «Vermietet bis …»: das Ende des Vertrags, der heute läuft
	it('nennt das Ende des laufenden Vertrags', async () => {
		const id = await apartment('1.06');
		await contractFor(id, day(-30), day(40));
		await contractFor(id, day(41));

		const occupied = (await getApartment(id))!;
		expect(occupied.currentContractEnd).toBe(day(40));
		const listed = (await listApartments({ buildingId: rental.building })).apartments.find((a) => a.id === id)!;
		expect(listed.currentContractEnd).toBe(day(40));
	});

	it('ist leer, sobald der Vertrag abgelaufen ist', async () => {
		const id = await apartment('1.03');
		await contractFor(id, day(-60), day(-1));

		expect(await statusOf(id)).toBe('vacant');
	});

	it('bleibt gesperrt ohne laufenden Vertrag', async () => {
		const id = await apartment('1.04', 'reserved');
		await contractFor(id, day(-60), day(-1));

		expect(await statusOf(id)).toBe('reserved');
	});

	it('gilt in Liste, Filter und Gebäudezahlen gleich', async () => {
		const id = await apartment('1.05');
		await contractFor(id, day(-10));

		const occupied = await listApartments({ buildingId: rental.building, status: 'occupied' });
		expect(occupied.apartments.map((a) => a.id)).toContain(id);
		expect(occupied.apartments.every((a) => a.status === 'occupied')).toBe(true);

		const building = (await getBuilding(rental.building))!;
		expect(building.occupiedCount).toBe(occupied.total);
	});

	it('zählt Wohnungen im Dashboard wie in der Liste', async () => {
		const relet = await listApartments({ status: 'relet', limit: 1000 });
		const response = await callApi('/api/v1/dashboard');
		const { portfolio } = (await response.json()) as { portfolio: Record<string, number> };

		expect(portfolio.reletApartments).toBe(relet.total);
		expect(portfolio.reservedApartments).toBe((await listApartments({ status: 'reserved', limit: 1000 })).total);
		expect(portfolio.occupiedApartments).toBe((await listApartments({ status: 'occupied', limit: 1000 })).total);
	});

	it('wird vom Ändern der Wohnung nicht überschrieben', async () => {
		await updateApartment(rental.apartment, { area: '71' });

		expect(await statusOf(rental.apartment)).toBe('occupied');
	});
});

describe('Status von Hand', () => {
	it('lässt nur Leer und Gesperrt zu', async () => {
		const response = await callApi(`/api/v1/apartments/${rental.apartment}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ status: 'occupied' })
		});

		expect(response.status).toBe(422);
	});
});
