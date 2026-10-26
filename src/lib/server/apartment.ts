import { m } from '$lib/paraglide/messages';
import { error } from '@sveltejs/kit';
import type { Json } from '$lib/types';
import type { ApartmentWithDetails } from '../../../backend/src/api/apartment';
import { monthlyTotal, toContractHistory, type ContractRow } from './contract-history';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

/** Apartment with its building, as the detail and edit pages show it */
export async function fetchApartment(fetch: typeof globalThis.fetch, id: string) {
	const response = await fetch(`${API}/apartments/${id}`);
	if (response.status === 404) throw error(404, m.apartments_not_found());
	if (!response.ok) throw error(response.status, m.apartments_load_failed());
	const a: Json<ApartmentWithDetails> = await response.json();
	return {
		id: a.id,
		buildingId: a.buildingId,
		number: a.number,
		floor: a.floor,
		area: a.area,
		rooms: a.rooms,
		status: a.status,
		currentContractId: a.currentContractId ?? null,
		nextContractId: a.nextContractId ?? null,
		nextContractStart: a.nextContractStart ?? null,
		currentContractEnd: a.currentContractEnd ?? null,
		lastContractEnd: a.lastContractEnd ?? null,
		building: a.building! // GET /apartments/:id always names it
	};
}

/** Apartment with its current tenant, monthly costs and all its contracts */
export async function loadApartmentDetails(fetch: typeof globalThis.fetch, id: string) {
	const apartment = await fetchApartment(fetch, id);
	const { contracts }: { contracts: ContractRow[] } = await (
		await fetch(`${API}/contracts?apartmentId=${id}&limit=100`)
	).json();
	const current = contracts.find((c) => c.id === apartment.currentContractId);
	// the contract the next tenant moves in with, as the backend names it (H-28, #717)
	const next = contracts.find((c) => c.id === apartment.nextContractId);

	return {
		apartment,
		currentContract: current
			? {
					id: current.id,
					tenantId: current.tenantId,
					tenantName: current.tenantName,
					tenantEmail: current.tenantEmail,
					startDate: current.startDate
				}
			: null,
		nextContract: next
			? {
					tenantId: next.tenantId,
					tenantName: next.tenantName,
					startDate: next.startDate
				}
			: null,
		monthlyCosts: {
			baseRent: Number(current?.baseRent ?? 0),
			additionalRent: Number(current?.additionalRent ?? 0),
			advancePayment: Number(current?.monthlyAdvancePayment ?? 0),
			flatRateUtilityCharge: Number(current?.flatRateUtilityCharge ?? 0),
			monthlyTotal: current ? monthlyTotal(current) : 0
		},
		contractHistory: contracts.map((c) => toContractHistory(c, c.tenantName))
	};
}
