import { m } from '$lib/paraglide/messages';
import { error, fail, redirect } from '@sveltejs/kit';
import { countStatus, reletStarts } from '$lib/apartment';
import { backendMessage, refusedFields, type BackendError } from '$lib/backend-error';
import { localName } from '$lib/names';
import type { BuildingWithStats, Apartment, ApartmentStatus } from '$lib/types';
import { toBuilding } from '$lib/server/building';
import type { Actions, PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export interface BuildingDetailsData {
	building: BuildingWithStats;
	apartments: Apartment[];
	fuelStocks: FuelStock[] | null; // null: could not be loaded
	heatingCategories: { id: string; name: string }[] | null; // null: could not be loaded
}

/** Heating oil or pellets in the tank at the end of a reading day, in CHF, billed in its category */
interface FuelStock {
	id: string;
	readingDate: string;
	amount: number;
	categoryId: string;
	categoryName: string;
}

type Fetch = typeof globalThis.fetch;

// Why the backend refused a reading (H-28, #717): each check at its field, a taken day or another category on the form
async function notSaved(response: Response) {
	const refused = (await response.json().catch(() => ({}))) as BackendError;
	if (refused.causes) return refusedFields(refused);
	return { form: refused.code ? backendMessage(refused, '') : m.buildings_fuel_not_saved() };
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The building's Tankbestand readings and the heating cost categories they can be billed in
async function fuelStockData(fetch: Fetch, buildingId: string) {
	const [stocksRes, categoriesRes] = await Promise.all([
		fetch(`${BACKEND_URL}/api/v1/buildings/${buildingId}/fuel-stocks`),
		fetch(`${BACKEND_URL}/api/v1/categories?limit=1000`) // all of them (#585)
	]);
	const stocks = stocksRes.ok ? await stocksRes.json() : null;
	// without the categories the page still shows, only the choice is empty
	const categories: Record<string, string | boolean>[] | null = categoriesRes.ok
		? ((await categoriesRes.json()).categories ?? [])
		: null;
	const name = (c: Record<string, string | boolean>) =>
		localName(c as Parameters<typeof localName>[0]);
	return {
		fuelStocks: Array.isArray(stocks)
			? stocks.map((s: Record<string, string>) => {
					// named from all categories: one no longer allocable is not in the choice
					const category = categories?.find((c) => c.id === s.categoryId);
					return {
						id: s.id,
						readingDate: s.readingDate,
						amount: Number(s.amount),
						categoryId: s.categoryId,
						categoryName: category ? name(category) : ''
					};
				})
			: null,
		// allocable Brennstoff only (#100), as the API accepts it
		heatingCategories:
			categories
				?.filter((c) => c.isFuel && c.isAllowedUtilityCost)
				.map((c) => ({ id: String(c.id), name: name(c) })) ?? null
	};
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<BuildingDetailsData> => {
	try {
		const [buildingRes, apartmentsRes, fuel] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}`),
			fetch(`${BACKEND_URL}/api/v1/apartments?buildingId=${params.id}&limit=100`),
			fuelStockData(fetch, params.id)
		]);

		if (!buildingRes.ok) {
			if (buildingRes.status === 404) {
				throw error(404, m.buildings_not_found());
			}
			throw error(buildingRes.status, m.buildings_load_failed());
		}

		const buildingData = await buildingRes.json();
		const apartmentsData = await apartmentsRes.json();

		const building = toBuilding(buildingData);

		const apartments: Apartment[] = (apartmentsData.apartments || apartmentsData.data || []).map(
			(a: Record<string, unknown>) => {
				const status: ApartmentStatus = (a.status as ApartmentStatus) || 'vacant';
				return {
					id: a.id as string,
					buildingId: a.buildingId as string,
					number: (a.number as string) || '',
					floor: (a.floor as number) || 0,
					rooms: a.rooms || '0',
					area: a.area || '0',
					status,
					nextContractStart: (a.nextContractStart as string | null) ?? null,
					currentContractEnd: (a.currentContractEnd as string | null) ?? null,
					lastContractEnd: (a.lastContractEnd as string | null) ?? null
				};
			}
		);
		building.reletStarts = reletStarts(apartments);
		building.reservedCount = countStatus(apartments, 'reserved');

		return { building, apartments, ...fuel };
	} catch (err) {
		console.error('Failed to fetch building:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, m.buildings_load_failed());
	}
};

export const actions: Actions = {
	delete: async ({ params, fetch }) => {
		const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}`, {
			method: 'DELETE'
		});
		if (!response.ok) {
			return fail(response.status, { deleteError: m.buildings_delete_failed() });
		}
		throw redirect(303, '/buildings');
	},

	// Heating oil in the tank on a reading day (Tankbestand), in CHF
	addFuelStock: async ({ request, params, fetch }) => {
		const form = await request.formData();
		const readingDate = String(form.get('readingDate') ?? '');
		const amount = String(form.get('amount') ?? '');
		const categoryId = String(form.get('categoryId') ?? '');

		const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}/fuel-stocks`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ readingDate, amount, categoryId })
		});
		if (!response.ok)
			return fail(response.status, { fuelStockErrors: await notSaved(response) });
		return { fuelStockSaved: true };
	},

	deleteFuelStock: async ({ request, params, fetch }) => {
		const stockId = String((await request.formData()).get('stockId'));
		const notDeleted = (status: number) =>
			fail(status, {
				fuelStockDeleteError: m.buildings_fuel_not_deleted()
			});
		if (!UUID.test(stockId)) return notDeleted(400);
		const response = await fetch(
			`${BACKEND_URL}/api/v1/buildings/${params.id}/fuel-stocks/${stockId}`,
			{
				method: 'DELETE'
			}
		);
		return response.ok ? { fuelStockDeleted: true } : notDeleted(response.status);
	}
};
