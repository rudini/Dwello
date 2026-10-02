import { error } from '@sveltejs/kit';
import type { Tenant } from '$lib/types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/tenants`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendTenant = Record<string, any>;

/** Backend tenant (with contracts and occupancy) or a 404/500 page */
export async function fetchTenant(
	fetch: typeof globalThis.fetch,
	id: string
): Promise<BackendTenant> {
	const response = await fetch(`${API}/${id}`);
	if (response.status === 404) throw error(404, 'Mieter nicht gefunden');
	if (!response.ok) throw error(response.status, 'Fehler beim Laden des Mieters');
	return response.json();
}

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
	correspondenceChannel: data.correspondenceChannel
});
