import { m } from '$lib/paraglide/messages';
import { error } from '@sveltejs/kit';
import type { Tenant } from '$lib/types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/tenants`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendTenant = Record<string, any>;

/** The tenant as the pages show it, or a 404/500 page */
export async function loadTenant(fetch: typeof globalThis.fetch, id: string): Promise<Tenant> {
	const response = await fetch(`${API}/${id}`);
	if (response.status === 404) throw error(404, m.tenants_not_found());
	if (!response.ok) throw error(response.status, m.tenants_load_failed());
	return toTenant(await response.json());
}

/** The backend's tenant in the shape of `Tenant`: the one place that maps its fields (CLAUDE.md, one mapper per response) */
export const toTenant = (data: BackendTenant): Tenant => ({
	id: data.id,
	firstName: data.firstName,
	lastName: data.lastName,
	email: data.email,
	phone: data.phone,
	language: data.language,
	address: data.address,
	postalCode: data.postalCode,
	city: data.city,
	country: data.country,
	correspondenceChannel: data.correspondenceChannel,
	anonymisableFrom: data.anonymisableFrom ?? null,
	rentalContractId: data.rentalContractId,
	isFuture: !!data.isFuture
});
