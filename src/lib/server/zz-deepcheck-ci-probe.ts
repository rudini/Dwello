// Temporary: verifies on GitHub that the "Deep modules" job fails on a new shallow module (removed in the next commit).
import { fetchTenant, saveTenant } from './tenant';

export function loadTenantProbe(fetch: typeof globalThis.fetch, id: string) {
	return fetchTenant(fetch, id);
}
export function storeTenantProbe(fetch: typeof globalThis.fetch, request: Request, id: string) {
	return saveTenant(fetch, request, id);
}
