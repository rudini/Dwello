import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface Tenant {
	id: string;
	firstName: string;
	lastName: string;
}

interface Apartment {
	id: string;
	number: string;
	floor: number;
	buildingId: string;
	buildingName: string;
	status: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		// Fetch tenants and apartments in parallel
		const [tenantsRes, apartmentsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/tenants`),
			fetch(`${BACKEND_URL}/api/v1/apartments`)
		]);

		const tenantsData = tenantsRes.ok ? await tenantsRes.json() : { tenants: [] };
		const apartmentsData = apartmentsRes.ok ? await apartmentsRes.json() : { apartments: [] };

		// Transform tenants for dropdown
		const tenants = (tenantsData.tenants || []).map((t: Tenant) => ({
			id: t.id,
			name: `${t.firstName} ${t.lastName}`
		}));

		// Transform apartments for dropdown
		const apartments = (apartmentsData.apartments || []).map((a: Apartment) => ({
			id: a.id,
			unit: a.number,
			building: a.buildingName || 'Unbekannt',
			status: a.status === 'occupied' ? 'Vermietet' : a.status === 'vacant' ? 'Leer' : a.status
		}));

		return { tenants, apartments };
	} catch (error) {
		console.error('Failed to load data for contract form:', error);
		return { tenants: [], apartments: [] };
	}
};
