import { error, fail, redirect } from '@sveltejs/kit';
import { countStatus } from '$lib/apartment';
import { plainAmount } from '$lib/invoice';
import type { BuildingWithStats, Apartment, ApartmentStatus } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export interface BuildingDetailsData {
	building: BuildingWithStats;
	apartments: Apartment[];
	fuelStocks: FuelStock[];
}

/** Heating oil in the tank at the end of a reading day, in CHF */
export interface FuelStock {
	id: string;
	readingDate: string;
	amount: number;
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<BuildingDetailsData> => {
	try {
		const [buildingRes, apartmentsRes, stocksRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}`),
			fetch(`${BACKEND_URL}/api/v1/apartments?buildingId=${params.id}&limit=100`),
			fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}/fuel-stocks`)
		]);

		if (!buildingRes.ok) {
			if (buildingRes.status === 404) {
				throw error(404, 'Gebäude nicht gefunden');
			}
			throw error(buildingRes.status, 'Fehler beim Laden des Gebäudes');
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

		const stocks = stocksRes.ok ? await stocksRes.json() : [];
		const fuelStocks: FuelStock[] = (Array.isArray(stocks) ? stocks : []).map(
			(s: Record<string, string>) => ({ id: s.id, readingDate: s.readingDate, amount: Number(s.amount) })
		);

		return { building, apartments, fuelStocks };
	} catch (err) {
		console.error('Failed to fetch building:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden des Gebäudes');
	}
};

export const actions: Actions = {
	delete: async ({ params, fetch }) => {
		const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}`, {
			method: 'DELETE'
		});
		if (!response.ok) {
			return fail(response.status, { deleteError: 'Gebäude konnte nicht gelöscht werden.' });
		}
		throw redirect(303, '/buildings');
	},

	// Heating oil in the tank on a reading day (Tankbestand), in CHF
	addFuelStock: async ({ request, params, fetch }) => {
		const form = await request.formData();
		const readingDate = String(form.get('readingDate') ?? '');
		const amount = plainAmount(String(form.get('amount') ?? ''));
		const fuelStockErrors: Record<string, string> = {};
		if (!readingDate) fuelStockErrors.readingDate = 'Bitte geben Sie den Stichtag ein.';
		if (!/^\d+(\.\d{1,2})?$/.test(amount))
			fuelStockErrors.amount = 'Bitte geben Sie den Wert in Franken ein, zum Beispiel 2650.00.';
		if (Object.keys(fuelStockErrors).length) return fail(400, { fuelStockErrors });

		const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}/fuel-stocks`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ readingDate, amount })
		});
		if (!response.ok) {
			const form =
				response.status === 409
					? 'Für diesen Stichtag ist schon ein Bestand erfasst. Löschen Sie ihn zuerst.'
					: 'Der Bestand konnte nicht gespeichert werden. Versuchen Sie es erneut.';
			return fail(response.status, { fuelStockErrors: { form } });
		}
		return { fuelStockSaved: true };
	},

	deleteFuelStock: async ({ request, params, fetch }) => {
		const stockId = String((await request.formData()).get('stockId'));
		await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}/fuel-stocks/${stockId}`, {
			method: 'DELETE'
		});
		return { fuelStockDeleted: true };
	}
};
