import { error } from '@sveltejs/kit';
import { tenantExportZip } from '$lib/server/tenant-export';
import type { RequestHandler } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/** Everything Dwello holds about the tenant as one ZIP, for the right to data handover (#435, Art. 28 DSG) */
export const GET: RequestHandler = async ({ fetch, params }) => {
	const api = `${BACKEND_URL}/api/v1/tenants/${encodeURIComponent(params.id)}/export`;
	const response = await fetch(api);
	if (!response.ok) error(response.status === 404 ? 404 : 500);
	return tenantExportZip(fetch, api, await response.json());
};
