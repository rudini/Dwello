import { m } from '$lib/paraglide/messages';
import type { PageServerLoad } from './$types';
import { roomsLabel, statusLabels } from '$lib/apartment';
import type { ApartmentStatus } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface Tenant {
	id: string;
	firstName: string;
	lastName: string;
	city?: string | null;
}

interface Apartment {
	id: string;
	number: string;
	floor: number;
	buildingId: string;
	rooms: string | number;
	area: string | number;
	buildingName: string;
	status: ApartmentStatus;
}

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		// Fetch tenants and apartments in parallel
		const [tenantsRes, apartmentsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/tenants?limit=1000`), // far more than a small portfolio has
			fetch(`${BACKEND_URL}/api/v1/apartments?limit=1000`)
		]);

		const tenantsData = tenantsRes.ok ? await tenantsRes.json() : { tenants: [] };
		const apartmentsData = apartmentsRes.ok ? await apartmentsRes.json() : { apartments: [] };

		// Transform tenants for dropdown
		const tenants = (tenantsData.tenants || []).map((t: Tenant) => ({
			id: t.id,
			name: `${t.firstName} ${t.lastName}`,
			place: t.city ?? undefined // two tenants of the same name are told apart by their town
		}));

		// Transform apartments for dropdown
		const apartments = (apartmentsData.apartments || []).map((a: Apartment) => ({
			id: a.id,
			unit: a.number,
			building: a.buildingName || m.contracts_unknown_building(),
			size: `${roomsLabel(String(Number(a.rooms)))}, ${Number(a.area)} m²`, // to judge the rent in the wizard
			status: statusLabels[a.status]
		}));

		return { tenants, apartments };
	} catch (error) {
		console.error('Failed to load data for contract form:', error);
		return { tenants: [], apartments: [] };
	}
};
