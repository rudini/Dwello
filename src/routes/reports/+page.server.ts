import { reportPeriods } from '$lib/server/cost-reconciliation';
import type { PageServerLoad } from './$types';

// #1126: each building and period with statements, the latest first
export const load: PageServerLoad = async ({ fetch }) => ({ periods: await reportPeriods(fetch) });
