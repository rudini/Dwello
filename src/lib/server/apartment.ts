import { error } from '@sveltejs/kit';
import type { ApartmentStatus } from '$lib/types';
import { grossRent, toContractHistory } from './contract-history';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

/** Apartment with its building, as the detail and edit pages show it */
export async function fetchApartment(fetch: typeof globalThis.fetch, id: string) {
	const response = await fetch(`${API}/apartments/${id}`);
	if (response.status === 404) throw error(404, 'Wohnung nicht gefunden');
	if (!response.ok) throw error(response.status, 'Fehler beim Laden der Wohnung');
	const a = await response.json();
	return {
		id: a.id as string,
		buildingId: a.buildingId as string,
		number: a.number as string,
		floor: a.floor as number,
		area: a.area as string,
		rooms: a.rooms as string,
		status: a.status as ApartmentStatus,
		currentContractId: (a.currentContractId ?? null) as string | null,
		nextContractStart: (a.nextContractStart ?? null) as string | null,
		building: a.building as { id: string; name: string; address: string; postalCode: string; city: string }
	};
}

/** Apartment with its current tenant, monthly costs and all its contracts */
export async function loadApartmentDetails(fetch: typeof globalThis.fetch, id: string) {
	const apartment = await fetchApartment(fetch, id);
	const { contracts } = await (await fetch(`${API}/contracts?apartmentId=${id}&limit=100`)).json();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
	const current = contracts.find((c: Record<string, any>) => c.id === apartment.currentContractId);

	return {
		apartment,
		currentContract: current
			? {
					id: current.id as string,
					tenantId: current.tenantId as string,
					tenantName: current.tenantName as string,
					tenantEmail: current.tenantEmail as string | null,
					startDate: current.startDate as string
				}
			: null,
		monthlyCosts: {
			baseRent: Number(current?.baseRent ?? 0),
			additionalRent: Number(current?.additionalRent ?? 0),
			advancePayment: Number(current?.monthlyAdvancePayment ?? 0),
			totalBrutto: current ? grossRent(current) : 0
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
		contractHistory: contracts.map((c: Record<string, any>) => toContractHistory(c, c.tenantName))
	};
}
