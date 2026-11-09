import { loadAnnualReport } from '$lib/server/annual-report';
import type { PageServerLoad } from './$types';

// #1409: the Jahresbericht of a building and a calendar year
export const load: PageServerLoad = ({ fetch, url }) => loadAnnualReport(fetch, url);
