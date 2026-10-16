import { backendMessage } from '$lib/backend-error';
import { localToday } from '$lib/contract-status';
import { m } from '$lib/paraglide/messages';
import { namesById } from '$lib/server/statement';
import type { InvoiceCheck } from '$lib/statement-wizard';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

type Fetch = typeof globalThis.fetch;
type Contract = {
	id: string;
	startDate: string;
	endDate: string | null;
	tenantName: string;
	apartmentNumber: string;
};

export interface GenerationRequest {
	buildingIds: string[];
	periodStart: string;
	periodEnd: string;
	heatingProfileId: string;
	managementFeePercent: number;
}

async function call(fetch: Fetch, path: string, body?: object) {
	const response = await fetch(
		`${API}/${path}`,
		body && {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		}
	);
	// a refusal is JSON with a code; a crash may answer with plain text (review K-5)
	const data = await response.json().catch(() => ({}));
	if (!response.ok)
		throw new Error(
			backendMessage(data, m.statements_backend_failed({ path, status: response.status }))
		);
	return data;
}

const nextDay = (date: string) =>
	new Date(Date.parse(`${date}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

// Whether the periods together cover every day from `from` to `to` (ISO dates compare as text)
function covers(periods: Period[], from: string, to: string) {
	let next = from;
	for (const p of [...periods].sort((a, b) => a.periodStart.localeCompare(b.periodStart)))
		if (p.periodStart <= next && p.periodEnd >= next) next = nextDay(p.periodEnd);
	return next > to;
}

type Run = Pick<GenerationRequest, 'buildingIds' | 'periodStart' | 'periodEnd'>;

// Per building: its contracts that overlap the period, and those of them with a statement in the period already
// TODO(fachlich prüfen, #199): an overlapping statement counts as billed, the dashboard counts only one inside the period
async function contractsOf(fetch: Fetch, { buildingIds, periodStart, periodEnd }: Run) {
	return Promise.all(
		buildingIds.map(async (buildingId) => {
			const [{ contracts }, { data: statements }] = await Promise.all([
				call(fetch, `contracts?buildingId=${encodeURIComponent(buildingId)}&limit=1000`),
				call(fetch, `statements?buildingId=${encodeURIComponent(buildingId)}&limit=1000`)
			]);
			const overlapping = (statements as (Period & { contractId: string })[]).filter(
				(s) => s.periodStart <= periodEnd && s.periodEnd >= periodStart
			);
			const inPeriod = (contracts as Contract[]).filter(
				(c) => c.startDate <= periodEnd && (!c.endDate || c.endDate >= periodStart)
			);
			const billed = inPeriod.filter((c) => overlapping.some((s) => s.contractId === c.id));
			// its days in the period that none of its statements covers stay unbilled (Fachreview M-1, #199)
			const partly = billed.filter(
				(c) =>
					!covers(
						overlapping.filter((s) => s.contractId === c.id),
						c.startDate > periodStart ? c.startDate : periodStart,
						c.endDate && c.endDate < periodEnd ? c.endDate : periodEnd
					)
			);
			return { buildingId, inPeriod, billed, partly };
		})
	);
}

// Every contract of the selected buildings that overlaps the period gets its own statement (tenant change = two
// statements); a contract that already has one in the period gets none, so a deleted draft can be created again
async function contractsInPeriod(fetch: Fetch, request: GenerationRequest) {
	return (await contractsOf(fetch, request)).flatMap(({ buildingId, inPeriod, billed }) =>
		inPeriod.filter((c) => !billed.includes(c)).map((contract) => ({ buildingId, contract }))
	);
}

/** Per building: its contracts in the period, how many of them have a statement there already and how many of these
 *  leave days unbilled (wizard steps 2 and 4) */
export async function billedContracts(fetch: Fetch, request: Run) {
	return (await contractsOf(fetch, request)).map(({ buildingId, inPeriod, billed, partly }) => ({
		buildingId,
		contracts: inPeriod.length,
		billed: billed.length,
		partly: partly.length
	}));
}

export async function previewStatements(fetch: Fetch, request: GenerationRequest) {
	const { periodStart, periodEnd, heatingProfileId, managementFeePercent } = request;
	const rows = [];
	for (const { contract } of await contractsInPeriod(fetch, request)) {
		const preview = await call(fetch, 'statements/preview', {
			contractId: contract.id,
			periodStart,
			periodEnd,
			heatingProfileId,
			managementFeePercent
		});
		rows.push({
			contractId: contract.id,
			tenantName: contract.tenantName,
			apartmentNumber: contract.apartmentNumber,
			totalCosts: Number(preview.totalCosts),
			totalAdvancePayments: Number(preview.totalAdvancePayments),
			balance: Number(preview.balance),
			rentalDays: Number(preview.rentalDays),
			totalPeriodDays: Number(preview.totalPeriodDays),
			movedOut: !!contract.endDate && contract.endDate <= [periodEnd, localToday()].sort()[1] // ended by now
		});
	}
	return rows;
}

export async function generateStatements(fetch: Fetch, request: GenerationRequest) {
	const { periodStart, periodEnd, heatingProfileId, managementFeePercent } = request;
	const contracts = await contractsInPeriod(fetch, request);
	for (const { buildingId, contract } of contracts) {
		await call(fetch, 'statements/generate', {
			contractId: contract.id,
			buildingId,
			periodStart,
			periodEnd,
			heatingProfileId,
			managementFeePercent
		});
	}
	return contracts.length;
}

type Period = { periodStart: string; periodEnd: string };

/** Per building: the utility invoices of the period, the statements whose period overlaps it and the check per category */
export async function invoicesInPeriod(
	fetch: Fetch,
	{ buildingIds, periodStart, periodEnd }: GenerationRequest
) {
	const overlaps = (s: Period) => s.periodStart <= periodEnd && s.periodEnd >= periodStart;
	const [rows, categories] = await Promise.all([
		Promise.all(
			buildingIds.map(async (buildingId) => {
				const building = encodeURIComponent(buildingId);
				const [invoices, { data: statements }, check] = await Promise.all([
					// the invoices the statement takes: by Leistungszeitraum, otherwise by Rechnungsdatum
					call(
						fetch,
						`invoices/for-statement/${building}?periodStart=${periodStart}&periodEnd=${periodEnd}`
					),
					call(fetch, `statements?buildingId=${building}&limit=1000`),
					// a hint only: without it the preview still shows
					call(
						fetch,
						`invoices/completeness/${building}?periodStart=${periodStart}&periodEnd=${periodEnd}`
					).catch(() => undefined)
				]);
				// an invoice with a Leistungszeitraum covers its days in the period, not its date
				type Bill = {
					invoiceDate: string;
					servicePeriodEnd?: string | null;
					inPeriod?: { start: string; end: string };
				};
				const dates = (invoices as Bill[])
					.flatMap((i) =>
						i.servicePeriodEnd && i.inPeriod ? [i.inPeriod.start, i.inPeriod.end] : [i.invoiceDate]
					)
					.sort();
				return {
					buildingId,
					count: invoices.length,
					first: dates[0] ?? null,
					last: dates.at(-1) ?? null,
					statements: (statements as Period[]).filter(overlaps).length,
					check: check as InvoiceCheck | undefined
				};
			})
		),
		namesById(fetch, 'categories')
	]);
	return rows.map((row) => ({ ...row, check: row.check && localCheck(row.check, categories) }));
}

// The check names each category in German: here in the UI language
const localCheck = (check: InvoiceCheck, names: Map<string, string>): InvoiceCheck => ({
	...check,
	findings: check.findings?.map((finding) => ({
		...finding,
		categoryName: finding.categoryId
			? (names.get(finding.categoryId) ?? finding.categoryName)
			: m.invoices_not_categorised()
	}))
});
