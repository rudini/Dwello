import { m } from '$lib/paraglide/messages';
import { error, fail, redirect } from '@sveltejs/kit';
import { backendMessage, type BackendError } from '$lib/backend-error';
import type { ApartmentListItem, Json } from '$lib/types';
import type {
	ApartmentWithDetails,
	MoveOut,
	MoveOutsResponse
} from '../../../backend/src/api/apartment';
import { monthlyTotal, toContractHistory, type ContractRow } from './contract-history';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

/** A row of GET /apartments, as the apartment list and a building's page show it */
export const toApartmentRow = (a: Json<ApartmentWithDetails>): ApartmentListItem => ({
	id: a.id,
	buildingId: a.buildingId,
	number: a.number || '',
	floor: a.floor || 0,
	area: a.area || '0',
	rooms: a.rooms || '0',
	status: a.status || 'vacant',
	buildingName: a.buildingName || '',
	nextContractStart: a.nextContractStart ?? null,
	currentContractEnd: a.currentContractEnd ?? null,
	lastContractEnd: a.lastContractEnd ?? null
});

/**
 * #664: the rows with the move-out of GET /apartments/move-outs, its own route so the list stays cheap (P2); without
 * it the list shows no hints
 */
export async function withMoveOuts<R extends { id: string }>(
	fetch: typeof globalThis.fetch,
	rows: R[],
	buildingId?: string
): Promise<(R & { moveOut: MoveOut | null })[]> {
	const query = buildingId ? `?buildingId=${encodeURIComponent(buildingId)}` : '';
	const answer = await fetch(`${API}/apartments/move-outs${query}`)
		.then((r) => r.json() as Promise<Partial<Json<MoveOutsResponse>>>)
		.catch(() => null);
	const byApartment = new Map(answer?.moveOuts?.map((m) => [m.apartmentId, m.moveOut]));
	return rows.map((row) => ({ ...row, moveOut: byApartment.get(row.id) ?? null }));
}

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

/** #1257: deletes an apartment, back to its building; the backend refuses one with rental contracts */
export async function deleteApartment(fetch: typeof globalThis.fetch, id: string, request: Request) {
	const buildingId = String((await request.formData()).get('buildingId'));
	const response = await fetch(`${API}/apartments/${id}`, { method: 'DELETE' });
	if (!response.ok) {
		const refused = (await response.json().catch(() => null)) as BackendError | null;
		return fail(response.status, {
			deleteError: backendMessage(refused, m.apartments_delete_failed()),
			deleteImpossible: refused?.code === 'APARTMENT_HAS_CONTRACTS'
		});
	}
	throw redirect(303, `/buildings/${encodeURIComponent(buildingId)}`); // a posted id, no path of its own
}
