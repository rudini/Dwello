/**
 * Contract list route against the real PostgreSQL database (docker compose postgres on 5432)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createContract, deleteContract } from '../services/contract.service';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;

const get = async (path: string) => (await callApi(`/api/v1/contracts${path}`)).json();

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-04-01', monthlyAdvancePayment: '0' });
});

afterAll(async () => {
	await rental.remove();
});

describe('GET /api/v1/contracts?search', () => {
	it('findet Mietverträge über den Namen des Mieters', async () => {
		const result = (await get(`?search=${encodeURIComponent(`Anna Keller ${token}`)}`)) as {
			contracts: { id: string }[];
			total: number;
		};

		expect(result.contracts.map((c) => c.id)).toEqual([rental.contract]);
		expect(result.total).toBe(1);
	});

	it('findet Mietverträge über den Gebäudenamen', async () => {
		const result = (await get(`?search=${token}`)) as { contracts: { id: string }[] };

		expect(result.contracts.map((c) => c.id)).toEqual([rental.contract]);
	});
});

describe('GET /api/v1/contracts/:id', () => {
	it('liefert Mieter, Wohnung und Gebäude des Mietvertrags', async () => {
		expect(await get(`/${rental.contract}`)).toMatchObject({
			tenant: { id: rental.tenant, firstName: 'Anna', lastName: `Keller ${token}` },
			apartment: { id: rental.apartment, number: '2.01', floor: 2 },
			building: { id: rental.building, name: `Ahornhof ${token}`, postalCode: '8400', city: 'Winterthur' }
		});
	});
});

// H-28 (#717): which contract runs today is the backend's, by the Swiss day; the BFF passes it on
describe('Status eines Mietvertrags', () => {
	it('nennt künftige, laufende und beendete Mietverträge in der Liste und einzeln', async () => {
		const later = await createRental(`${token}-status`, { startDate: '2099-01-01', monthlyAdvancePayment: '0' });
		const ended = await createRental(`${token}-status`, { startDate: '2020-01-01', endDate: '2020-12-31', monthlyAdvancePayment: '0' });
		try {
			const listed = (await get(`?search=${token}`)) as { contracts: { id: string; status: string }[] };
			const status = (id: string) => listed.contracts.find((c) => c.id === id)?.status;
			const single = (await get(`/${later.contract}`)) as { status: string };

			expect([status(rental.contract), status(later.contract), status(ended.contract)]).toEqual(['active', 'future', 'ended']);
			expect(single.status).toBe('future');
		} finally {
			await later.remove();
			await ended.remove();
		}
	});

	// the contract the next tenant moves in with, and the tenant's running one, else the next: chosen here
	it('nennt der Wohnung den nächsten und dem Mieter den laufenden, sonst den nächsten Mietvertrag', async () => {
		const later = await createRental(`${token}-next`, { startDate: '2099-01-01', endDate: '2099-12-31', monthlyAdvancePayment: '0' });
		const after = await createContract({ apartmentId: later.apartment, tenantId: later.tenant, baseRent: '950', startDate: '2101-01-01', monthlyAdvancePayment: '0' });
		try {
			const apartment = (await (await callApi(`/api/v1/apartments/${later.apartment}`)).json()) as { nextContractId?: string };
			const moving = (await (await callApi(`/api/v1/tenants/${later.tenant}`)).json()) as { rentalContractId?: string; isFuture?: boolean };
			const living = (await (await callApi(`/api/v1/tenants/${rental.tenant}`)).json()) as { rentalContractId?: string; isFuture?: boolean };

			expect(apartment.nextContractId).toBe(later.contract);
			expect(moving).toMatchObject({ rentalContractId: later.contract, isFuture: true });
			expect(living).toMatchObject({ rentalContractId: rental.contract, isFuture: false });
		} finally {
			await deleteContract(after.id, true);
			await later.remove();
		}
	});
});

