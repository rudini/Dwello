import { annualReportPdf } from '$lib/server/annual-report';
import type { RequestHandler } from './$types';

// #1409: the Jahresbericht of a building and a calendar year as PDF
export const GET: RequestHandler = ({ fetch, url }) => annualReportPdf(fetch, url);
