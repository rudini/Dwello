import { m } from '$lib/paraglide/messages';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { roomsLabel, statusLabels } from '$lib/apartment';
import type { ApartmentStatus, Tenant } from '$lib/types';
import { agreeableCategories } from '$lib/server/category';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface Apartment {
	id: string;
	number: string;
	floor: number;
	buildingId: string;
	rooms: string | number;
	area: string | number;
	buildingName: string;
	status: ApartmentStatus;
	blocked?: boolean; // whether a new contract can be recorded, as the backend decides (#815)
	availableFrom?: string | null;
}

// #368 (#407 point 3): a new contract from the old one of the same tenant starts with its agreed Nebenkosten
async function agreedOf(fetch: typeof globalThis.fetch, contractId: string | null | undefined) {
	if (!contractId) return null;
	const response = await fetch(`${BACKEND_URL}/api/v1/contracts/${contractId}`);
	return response.ok ? ((await response.json()).agreedCategoryIds as string[]) : null;
}

export const load: PageServerLoad = async ({ fetch, url }) => {
	// Fetch tenants and apartments in parallel
	const [tenantsRes, apartmentsRes] = await Promise.all([
		fetch(`${BACKEND_URL}/api/v1/tenants?limit=1000`), // far more than a small portfolio has
		fetch(`${BACKEND_URL}/api/v1/apartments?limit=1000`)
	]).catch((err) => {
		console.error('Failed to load data for contract form:', err);
		return [];
	});
	// an empty choice would read as "no tenants yet" (#147): the landlord sees a load error instead
	if (!tenantsRes?.ok || !apartmentsRes?.ok) {
		// without a response the .catch above has logged the network error already (#715)
		if (tenantsRes)
			console.error(
				'Failed to load data for contract form:',
				tenantsRes.status,
				apartmentsRes.status
			);
		throw error(500, m.contracts_choices_load_failed());
	}
	const tenantsData = await tenantsRes.json();
	const apartmentsData = await apartmentsRes.json();

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
		status: statusLabels[a.status],
		// whether a new contract can be recorded, decided by the backend by the Swiss day (#815)
		blocked: !!a.blocked,
		availableFrom: a.availableFrom ?? null
	}));

	return {
		tenants,
		apartments,
		categories: await agreeableCategories(fetch),
		agreed: await agreedOf(fetch, url?.searchParams.get('from'))
	};
};
