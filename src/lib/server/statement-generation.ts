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
	// Distributes the management fee to the apartments; none: equally
	managementFeeDistributionKeyId?: string;
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
	const data = await response.json();
	if (!response.ok) throw new Error(data.error ?? `${path} antwortet ${response.status}`);
	return data;
}

// Every contract of the selected buildings that overlaps the period gets its own statement (tenant change = two statements)
async function contractsInPeriod(
	fetch: Fetch,
	{ buildingIds, periodStart, periodEnd }: GenerationRequest
) {
	const perBuilding = await Promise.all(
		buildingIds.map(async (buildingId) => {
			const { contracts } = await call(fetch, `contracts?buildingId=${buildingId}&limit=1000`);
			return (contracts as Contract[])
				.filter((c) => c.startDate <= periodEnd && (!c.endDate || c.endDate >= periodStart))
				.map((contract) => ({ buildingId, contract }));
		})
	);
	return perBuilding.flat();
}

export async function previewStatements(fetch: Fetch, request: GenerationRequest) {
	const { periodStart, periodEnd, heatingProfileId, managementFeePercent } = request;
	const managementFeeDistributionKeyId = request.managementFeeDistributionKeyId || undefined;
	const rows = [];
	for (const { contract } of await contractsInPeriod(fetch, request)) {
		const preview = await call(fetch, 'statements/preview', {
			contractId: contract.id,
			periodStart,
			periodEnd,
			heatingProfileId,
			managementFeePercent,
			managementFeeDistributionKeyId
		});
		rows.push({
			contractId: contract.id,
			tenantName: contract.tenantName,
			apartmentNumber: contract.apartmentNumber,
			totalCosts: Number(preview.totalCosts),
			totalAdvancePayments: Number(preview.totalAdvancePayments),
			balance: Number(preview.balance),
			rentalDays: Number(preview.rentalDays),
			totalPeriodDays: Number(preview.totalPeriodDays)
		});
	}
	return rows;
}

export async function generateStatements(fetch: Fetch, request: GenerationRequest) {
	const { periodStart, periodEnd, heatingProfileId, managementFeePercent } = request;
	const managementFeeDistributionKeyId = request.managementFeeDistributionKeyId || undefined;
	const contracts = await contractsInPeriod(fetch, request);
	for (const { buildingId, contract } of contracts) {
		await call(fetch, 'statements/generate', {
			contractId: contract.id,
			buildingId,
			periodStart,
			periodEnd,
			heatingProfileId,
			managementFeePercent,
			managementFeeDistributionKeyId
		});
	}
	return contracts.length;
}

type Period = { periodStart: string; periodEnd: string };

/** Per building: the utility invoices dated in the period, the statements whose period overlaps it and the check per category */
export async function invoicesInPeriod(
	fetch: Fetch,
	{ buildingIds, periodStart, periodEnd }: GenerationRequest
) {
	const overlaps = (s: Period) => s.periodStart <= periodEnd && s.periodEnd >= periodStart;
	return Promise.all(
		buildingIds.map(async (buildingId) => {
			const building = encodeURIComponent(buildingId);
			const [{ invoices }, { data: statements }, check] = await Promise.all([
				call(
					fetch,
					`invoices?buildingId=${building}&dateFrom=${periodStart}&dateTo=${periodEnd}&isValidUtilityCost=true&limit=1000`
				),
				call(fetch, `statements?buildingId=${building}&limit=1000`),
				// a hint only: without it the preview still shows
				call(fetch, `invoices/completeness/${building}?periodStart=${periodStart}&periodEnd=${periodEnd}`).catch(
					() => undefined
				)
			]);
			const dates = (invoices as { invoiceDate: string }[]).map((i) => i.invoiceDate).sort();
			return {
				buildingId,
				count: dates.length,
				first: dates[0] ?? null,
				last: dates.at(-1) ?? null,
				statements: (statements as Period[]).filter(overlaps).length,
				check: check as InvoiceCheck | undefined
			};
		})
	);
}
