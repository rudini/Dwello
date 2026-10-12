import type { RentalContract, Tenant, Apartment, Building, ApartmentStatus } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { contractEndError, localToday, pastEndConfirmation } from '$lib/contract-status';
import { formatDate } from '$lib/utils/format';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface ContractDetailsData {
	today: string; // the server's day, for the Vertragsstatus
	contract: RentalContract & {
		tenant: Tenant;
		apartment: Apartment;
		building: Building;
	};
	rentBreakdown: {
		baseRent: number;
		additionalRent: number;
		advancePayment: number;
		total: number;
	};
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<ContractDetailsData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/contracts/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Vertrag nicht gefunden');
			}
			throw error(response.status, 'Fehler beim Laden des Vertrags');
		}

		const data = await response.json();

		const baseRent = Number(data.baseRent) || 0;
		const additionalRent = Number(data.additionalRent) || 0;
		const advancePayment = Number(data.monthlyAdvancePayment || data.advancePayment) || 0;

		const apartmentStatus: ApartmentStatus = data.apartment?.status || 'occupied';
		const contract: RentalContract & { tenant: Tenant; apartment: Apartment; building: Building } =
			{
				id: data.id,
				apartmentId: data.apartmentId,
				tenantId: data.tenantId,
				startDate: data.startDate,
				endDate: data.endDate || null,
				baseRent: data.baseRent || '0',
				additionalRent: data.additionalRent || null,
				monthlyAdvancePayment: data.monthlyAdvancePayment || '0',
				tenant: {
					id: data.tenant?.id || data.tenantId,
					firstName: data.tenant?.firstName || '',
					lastName: data.tenant?.lastName || '',
					email: data.tenant?.email || null,
					phone: data.tenant?.phone || null,
					language: data.tenant?.language || 'de'
				},
				apartment: {
					id: data.apartment?.id || data.apartmentId,
					buildingId: data.apartment?.buildingId || '',
					number: data.apartment?.number || '',
					floor: data.apartment?.floor || 0,
					area: data.apartment?.area || '0',
					rooms: data.apartment?.rooms || '0',
					status: apartmentStatus
				},
				building: {
					id: data.building?.id || '',
					name: data.building?.name || '',
					address: data.building?.address || '',
					postalCode: data.building?.postalCode || '',
					city: data.building?.city || '',
					canton: data.building?.canton || ''
				}
			};

		return {
			today: localToday(),
			contract,
			rentBreakdown: {
				baseRent,
				additionalRent,
				advancePayment,
				total: baseRent + additionalRent + advancePayment
			}
		};
	} catch (err) {
		console.error('Failed to fetch contract:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden des Vertrags');
	}
};

/** The last day of the contract's stored statements, or '': their rent days are billed up to there */
async function billedTo(fetch: typeof globalThis.fetch, tenantId: string, contractId: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/statements?tenantId=${tenantId}&limit=100`);
	const statements: { contractId: string; periodEnd: string }[] =
		(await response.json()).data ?? [];
	return statements
		.filter((statement) => statement.contractId === contractId)
		.map((statement) => statement.periodEnd.slice(0, 10))
		.reduce((last, day) => (day > last ? day : last), '');
}

/** Why the contract cannot end on that day, with its status, or null */
function endRefusal(
	contract: { startDate?: string; endDate?: string | null },
	endDate: string,
	pastConfirmed: boolean,
	billed: () => Promise<string>
) {
	// a stale page: an end already set is changed under «Bearbeiten», not overwritten
	if (contract.endDate)
		return fail(409, {
			endError: 'Der Mietvertrag hat schon ein Vertragsende. Ändern Sie es unter «Bearbeiten».'
		});
	const endError =
		contractEndError(endDate, String(contract.startDate ?? ''), localToday()) ??
		(pastConfirmed ? null : pastEndConfirmation(endDate, localToday()));
	if (endError) return fail(400, { endError });
	// a stored statement already has rent days after that day
	return billed().then((last) =>
		last > endDate
			? fail(409, {
					endError: `Die Nebenkostenabrechnung bis ${formatDate(last)} enthält schon Mietstage nach diesem Tag. Wählen Sie den ${formatDate(last)} oder einen späteren Tag.`
				})
			: null
	);
}

export const actions: Actions = {
	// The last day of the tenancy, the Kündigungstermin; a past day only confirmed, never before a statement's end
	end: async ({ params, fetch, request }) => {
		const form = await request.formData();
		const endDate = String(form.get('endDate') ?? '');
		const url = `${BACKEND_URL}/api/v1/contracts/${params.id}`;
		const stored = await fetch(url);
		if (!stored.ok)
			return fail(stored.status, { endError: 'Mietvertrag konnte nicht beendet werden.' });
		const contract = await stored.json();
		const refusal = await endRefusal(contract, endDate, form.get('pastConfirmed') === 'on', () =>
			billedTo(fetch, contract.tenantId, params.id)
		);
		if (refusal) return refusal;
		const response = await fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ endDate })
		});
		if (!response.ok) {
			return fail(response.status, { endError: 'Mietvertrag konnte nicht beendet werden.' });
		}
	},
	// only a contract that has not started: the statement needs the rent days of every other one
	delete: async ({ params, fetch }) => {
		const url = `${BACKEND_URL}/api/v1/contracts/${params.id}`;
		const stored = await fetch(url);
		if (!stored.ok)
			return fail(stored.status, { deleteError: 'Mietvertrag konnte nicht gelöscht werden.' });
		const { startDate } = await stored.json();
		if (String(startDate).slice(0, 10) <= localToday())
			return fail(409, {
				deleteError:
					'Ein Mietvertrag, der begonnen hat, kann nicht gelöscht werden: Die Nebenkostenabrechnung braucht seine Mietstage.'
			});
		const response = await fetch(url, { method: 'DELETE' });
		if (!response.ok) {
			return fail(response.status, { deleteError: 'Mietvertrag konnte nicht gelöscht werden.' });
		}
		throw redirect(303, '/contracts');
	}
};
