import { error } from '@sveltejs/kit';
import type { AnnualReportBody } from '../../../backend/src/api/report';
import { m } from '$lib/paraglide/messages';
import { strToU8 } from 'fflate';
import { fileDownload } from '$lib/server/zip-download';
import { formatCurrency } from '$lib/utils/format';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
type Fetch = typeof globalThis.fetch;

/** #1409: the Jahresbericht of a building and a calendar year, as the backend gives it (tests/contracts/report-annual.json) */
async function annualReport(
	fetch: Fetch,
	buildingId: string,
	year: number
): Promise<AnnualReportBody> {
	const response = await fetch(
		`${BACKEND_URL}/api/v1/reports/annual?buildingId=${buildingId}&year=${year}`
	);
	if (response.status === 404 || response.status === 422)
		error(404, m.record_not_found({ record: m.analytics_title() }));
	if (!response.ok) error(response.status, m.error_unexpected());
	return response.json();
}

/** The buildings to choose from, by name as the backend lists them */
async function reportBuildings(
	fetch: Fetch
): Promise<{ value: string; label: string; address: string }[]> {
	const response = await fetch(`${BACKEND_URL}/api/v1/buildings?limit=all`);
	if (!response.ok) error(response.status, m.error_unexpected());
	const {
		buildings
	}: { buildings: Record<'id' | 'name' | 'address' | 'postalCode' | 'city', string>[] } =
		await response.json();
	return buildings.map(({ id, name, address, postalCode, city }) => ({
		value: id,
		label: name,
		address: `${name}, ${address}, ${postalCode} ${city}`
	}));
}

type ReportRow = { label: string; amount: number; total?: boolean };
type ReportSection = {
	key: 'income' | 'costs';
	heading: string;
	help: string;
	rows: ReportRow[];
};

/** The sections the page, the CSV and the PDF show, in the UI language: the same rows and numbers in all three */
function sectionsOf(report: AnnualReportBody): ReportSection[] {
	const { income } = report;
	return [
		{
			key: 'income',
			// TODO(fachlich prüfen, #1415): the term «Mietertrag»
			heading: m.analytics_income_heading(),
			help: m.analytics_income_help(),
			rows: [
				{ label: m.analytics_income_net_rent(), amount: income.netRent },
				{ label: m.common_additional_rent(), amount: income.additionalRent },
				{ label: m.analytics_income_advance(), amount: income.advancePayments },
				{ label: m.common_flat_rate_utility_charge(), amount: income.flatRateUtilityCharge },
				{ label: m.analytics_income_total(), amount: income.total, total: true }
			]
		}
	];
}

const thisYear = () =>
	Number(new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' }).slice(0, 4));

/**
 * The Jahresbericht of the chosen building and year; without a choice the first building and the last year, or the
 * first year of the building when its data begins later (Fachreview 1409-1 V-10); null without buildings
 */
export async function loadAnnualReport(fetch: Fetch, url: URL) {
	const buildings = await reportBuildings(fetch);
	const buildingId = url.searchParams.get('building') ?? buildings[0]?.value;
	if (!buildingId) return { buildings, report: null };
	const building = buildings.find(({ value }) => value === buildingId);
	const currentYear = thisYear();
	const chosen = Number(url.searchParams.get('year')) || null;
	let report = await annualReport(fetch, buildingId, chosen ?? currentYear - 1);
	if (!chosen && report.firstYear > report.year)
		report = await annualReport(fetch, buildingId, report.firstYear);
	const years = Array.from(
		{ length: currentYear - Math.min(report.firstYear, report.year) + 1 },
		(_, i) => String(currentYear - i)
	);
	return {
		buildings,
		buildingId,
		buildingName: building?.label ?? '',
		buildingAddress: building?.address ?? '',
		years: years.includes(String(report.year)) ? years : [String(report.year), ...years],
		currentYear,
		report: { year: report.year, sections: sectionsOf(report) }
	};
}

type Loaded = Awaited<ReturnType<typeof loadAnnualReport>>;
const reportOf = async (fetch: Fetch, url: URL) => {
	const loaded = await loadAnnualReport(fetch, url);
	if (!loaded.report) error(404, m.record_not_found({ record: m.analytics_title() }));
	return loaded as Required<Loaded> & { report: NonNullable<Loaded['report']> };
};
const fileName = (loaded: { buildingName: string; report: { year: number } }, extension: string) =>
	`${m.analytics_report_heading({ building: loaded.buildingName, year: loaded.report.year })}.${extension}`;

// a field with «;», a quote or a line break in quotes; only the landlord's own names and plain numbers, so no formula
// guard as in the export of all data (Fachreview 496-1 V-2)
const field = (text: string) => (/[;"\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text);

/** The Jahresbericht as CSV, as the export of all data: UTF-8 with the mark Excel reads it by, «;», CRLF; a row per row
 * of the page, the amount as a plain number */
export async function annualReportCsv(fetch: Fetch, url: URL) {
	const loaded = await reportOf(fetch, url);
	const rows = loaded.report.sections.flatMap(({ heading, rows }) =>
		rows.map(({ label, amount }) => [heading, label, amount.toFixed(2)])
	);
	return fileDownload(
		fileName(loaded, 'csv'),
		'text/csv; charset=utf-8',
		strToU8(
			`\ufeff${[[m.analytics_csv_section(), m.analytics_item(), m.analytics_csv_amount()], ...rows]
				.map((row) => row.map(field).join(';'))
				.join('\r\n')}\r\n`
		)
	);
}

/** The Jahresbericht as PDF, made by the backend from the page's texts and amounts */
export async function annualReportPdf(fetch: Fetch, url: URL) {
	const loaded = await reportOf(fetch, url);
	const { year } = loaded.report;
	const response = await fetch(`${BACKEND_URL}/api/v1/reports/pdf`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			title: m.analytics_pdf_title({ year }),
			lines: [
				loaded.buildingAddress,
				m.analytics_pdf_period({ year }),
				...(year >= loaded.currentYear ? [m.analytics_current_year({ year })] : [])
			],
			sections: loaded.report.sections.map(({ heading, help, rows }) => ({
				heading,
				help,
				rows: rows.map(({ label, amount, total }) => ({
					label,
					// a plain space: the PDF's amount column never breaks, and its text reads «CHF 32’675.81»
					amount: formatCurrency(amount).replace(/\u00a0/g, ' '),
					total
				}))
			}))
		})
	});
	if (!response.ok) error(response.status, m.error_unexpected());
	return fileDownload(fileName(loaded, 'pdf'), 'application/pdf', await response.arrayBuffer());
}
