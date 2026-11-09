import { annualReportCsv } from '$lib/server/annual-report';
import type { RequestHandler } from './$types';

// #1409: the Jahresbericht of a building and a calendar year as CSV
export const GET: RequestHandler = ({ fetch, url }) => annualReportCsv(fetch, url);
