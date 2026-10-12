import { m } from '$lib/paraglide/messages';
import { error, fail, redirect } from '@sveltejs/kit';
import { countStatus } from '$lib/apartment';
import { plainAmount } from '$lib/invoice';
import { localName } from '$lib/names';
import type { BuildingWithStats, Apartment, ApartmentStatus } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export interface BuildingDetailsData {
	building: BuildingWithStats;
	apartments: Apartment[];
	fuelStocks: FuelStock[] | null; // null: could not be loaded
	heatingCategories: { id: string; name: string }[] | null; // null: could not be loaded
}

/** Heating oil or pellets in the tank at the end of a reading day, in CHF, billed in its category */
export interface FuelStock {
	id: string;
	readingDate: string;
	amount: number;
	categoryId: string;
	categoryName: string;
}

type Fetch = typeof globalThis.fetch;

// Why the backend refused a reading, in words: the day is taken, or the tank's category differs
async function notSaved(response: Response) {
	if (response.status !== 409) return m.buildings_fuel_not_saved();
	const { error = '' } = await response.json().catch(() => ({}));
	return String(error).includes('category')
		? m.buildings_fuel_other_category()
		: m.buildings_fuel_date_taken();
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The building's Tankbestand readings and the heating cost categories they can be billed in
async function fuelStockData(fetch: Fetch, buildingId: string) {
	const [stocksRes, categoriesRes] = await Promise.all([
		fetch(`${BACKEND_URL}/api/v1/buildings/${buildingId}/fuel-stocks`),
		fetch(`${BACKEND_URL}/api/v1/categories?limit=100`)
	]);
	const stocks = stocksRes.ok ? await stocksRes.json() : null;
	// without the categories the page still shows, only the choice is empty
	const categories: Record<string, string | boolean>[] | null = categoriesRes.ok
		? ((await categoriesRes.json()).categories ?? [])
		: null;
	const name = (c: Record<string, string | boolean>) => localName(c as Parameters<typeof localName>[0]);
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
		// allocable fuel only: the chimney sweep is shared like heating but is no fuel (the API refuses it too)
		heatingCategories:
			categories
				?.filter((c) => c.isHeatingCost && c.isAllowedUtilityCost && c.name !== 'Chimney Sweep')
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

		const building: BuildingWithStats = {
			id: buildingData.id,
			name: buildingData.name || '',
			address: buildingData.address,
			postalCode: buildingData.postalCode,
			city: buildingData.city,
			canton: buildingData.canton,
			country: buildingData.country || 'CH',
			latitude: buildingData.latitude ? Number(buildingData.latitude) : undefined,
			longitude: buildingData.longitude ? Number(buildingData.longitude) : undefined,
			yearBuilt: buildingData.yearBuilt ? Number(buildingData.yearBuilt) : undefined,
			buildingType: buildingData.buildingType,
			apartmentCount: Number(buildingData.apartmentCount) || 0,
			occupiedCount: Number(buildingData.occupiedCount) || 0,
			vacantCount: Number(buildingData.vacantCount) || 0
		};

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
					nextContractStart: (a.nextContractStart as string | null) ?? null
				};
			}
		);
		building.reletCount = countStatus(apartments, 'relet');
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
		const amount = plainAmount(String(form.get('amount') ?? ''));
		const categoryId = String(form.get('categoryId') ?? '');
		const fuelStockErrors: Record<string, string> = {};
		if (!readingDate) fuelStockErrors.readingDate = m.buildings_fuel_date_missing();
		if (!/^\d+(\.\d{1,2})?$/.test(amount))
			fuelStockErrors.amount = m.buildings_fuel_amount_invalid();
		if (Object.keys(fuelStockErrors).length) return fail(400, { fuelStockErrors });

		const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}/fuel-stocks`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ readingDate, amount, categoryId })
		});
		if (!response.ok)
			return fail(response.status, { fuelStockErrors: { form: await notSaved(response) } });
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
