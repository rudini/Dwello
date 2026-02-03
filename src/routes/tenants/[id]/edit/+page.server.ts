import type { Tenant } from '$lib/types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface TenantEditData {
	tenant: Tenant;
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<TenantEditData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/tenants/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Mieter nicht gefunden');
			}
			throw error(response.status, 'Fehler beim Laden des Mieters');
		}

		const data = await response.json();

		const tenant: Tenant = {
			id: data.id,
			firstName: data.firstName || '',
			lastName: data.lastName || '',
			email: data.email || null,
			phone: data.phone || null,
			language: data.language || 'de',
			address: data.address || null,
			postalCode: data.postalCode || null,
			city: data.city || null
		};

		return { tenant };
	} catch (err) {
		console.error('Failed to fetch tenant for edit:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden des Mieters');
	}
};
