import { backendMessage } from '$lib/backend-error';
import { billingStart, billsIn, localToday } from '$lib/contract-status';
import { periodDays } from '$lib/accounting-period';
import { m } from '$lib/paraglide/messages';
import { localName } from '$lib/names';
import { laterChanges, namesById, toStatement } from '$lib/server/statement';
import type { ChangedStatement, HintedInvoice, InvoiceCheck } from '$lib/statement-wizard';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

type Fetch = typeof globalThis.fetch;
type Contract = {
	id: string;
	startDate: string;
	endDate: string | null;
	billedUntil?: string | null;
	terminated?: boolean;
	tenantName: string;
	apartmentId?: string;
	apartmentNumber: string;
	managementFeeAgreed?: boolean;
	managementFeePercent?: string | null; // its own rate, before the run's (#89)
	oldAddress?: boolean; // A-5 (#114): moved out, still with the building's address
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

type Run = Pick<GenerationRequest, 'buildingIds' | 'periodStart' | 'periodEnd'>;

type Range = { start: string; end: string };
/** The backend's plan of a run for one building (H-28: the backend decides which contracts a run bills) */
type Plan = {
	contracts: (Contract & { billed: boolean })[];
	overlap: {
		periods: Range[];
		choose: Range[];
		short: Range[];
		vacant: boolean;
		statements: number;
	} | null;
	skipped: { id: string; tenantName: string; billedUntil: string }[];
};

// Per building: its contracts with Mietstage in the period, those of them with a statement there already, whether the
// period overlaps one of the building's, and those «Abgerechnet bis» leaves no Mietstage there
async function contractsOf(fetch: Fetch, { buildingIds, periodStart, periodEnd }: Run) {
	return Promise.all(
		buildingIds.map(async (buildingId) => {
			const plan: Plan = await call(
				fetch,
				`statements/run?buildingId=${encodeURIComponent(buildingId)}&periodStart=${periodStart}&periodEnd=${periodEnd}`
			);
			const billed = plan.contracts.filter((c) => c.billed);
			return {
				buildingId,
				inPeriod: plan.contracts,
				billed,
				overlap: plan.overlap,
				skipped: plan.skipped
			};
		})
	);
}

// Every contract of the selected buildings that overlaps the period gets its own statement (tenant change = two
// statements); a contract that already has one in the period gets none, so a deleted draft can be created again.
// A building whose statement period the run overlaps refuses the run, as step 2 and the backend do (#408 point 2)
async function contractsInPeriod(fetch: Fetch, request: Run) {
	const buildings = await contractsOf(fetch, request);
	// each building and every period it overlaps (Fachreview 199-1 V-7, code review C-3)
	const refusals = await Promise.all(
		buildings.flatMap(({ buildingId, overlap }) =>
			overlap
				? [
						call(fetch, `buildings/${encodeURIComponent(buildingId)}`).then(({ name }) => {
							const params = {
								building: name,
								periods: overlap.periods.map(periodDays).join(', ')
							};
							return backendMessage({ code: 'STATEMENT_PERIOD_OVERLAPS', params }, '');
						})
					]
				: []
		)
	);
	if (refusals.length) throw new Error(refusals.join(' '));
	return buildings.flatMap(({ buildingId, inPeriod, billed }) =>
		inPeriod.filter((c) => !billed.includes(c)).map((contract) => ({ buildingId, contract }))
	);
}

/**
 * Per building: its contracts in the period, how many of them have a statement there already, whether the period
 * overlaps one of the building's (wizard step 2), and those this run bills without an agreed Verwaltungspauschale
 * (#89, step «Einstellungen»)
 */
export async function billedContracts(fetch: Fetch, request: Run) {
	return (await contractsOf(fetch, request)).map(
		({ buildingId, inPeriod, billed, overlap, skipped }) => ({
			buildingId,
			contracts: inPeriod.length,
			billed: billed.length,
			overlap,
			withoutFee: inPeriod
				.filter((c) => !billed.includes(c) && !c.managementFeeAgreed)
				.map(({ id, tenantName, apartmentNumber }) => ({ id, tenantName, apartmentNumber })),
			...(skipped.length ? { skipped } : {})
		})
	);
}

/**
 * #91, step «Einstellungen»: per contract this run bills, the categories with costs in the period it has no answer for
 * (open) and those it does not agree (notAgreed), named in the UI language
 */
export async function contractAgreements(fetch: Fetch, request: Run) {
	const { periodStart, periodEnd } = request;
	const [contracts, names] = await Promise.all([
		contractsInPeriod(fetch, request),
		namesById(fetch, 'categories')
	]);
	const rows = await Promise.all(
		contracts.map(async ({ contract: { id, tenantName, apartmentNumber } }) => {
			const answers: { categoryId: string; agreed: boolean | null }[] = await call(
				fetch,
				`contracts/${id}/agreements?periodStart=${periodStart}&periodEnd=${periodEnd}`
			);
			const named = (agreed: boolean | null) =>
				answers
					.filter((answer) => answer.agreed === agreed)
					.map(({ categoryId }) => ({ categoryId, name: names.get(categoryId) ?? categoryId }));
			return { contractId: id, tenantName, apartmentNumber, open: named(null), notAgreed: named(false) };
		})
	);
	return rows.filter((row) => row.open.length || row.notAgreed.length);
}

export async function previewStatements(fetch: Fetch, request: GenerationRequest) {
	const { periodStart, periodEnd, heatingProfileId, managementFeePercent } = request;
	const rows = [];
	for (const { buildingId, contract } of await contractsInPeriod(fetch, request)) {
		const movedOut = !!contract.endDate && contract.endDate <= [periodEnd, localToday()].sort()[1]; // ended by now
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
			rentalStart: preview.rentalStart as string,
			rentalEnd: preview.rentalEnd as string,
			// #453 (#327): «Abgerechnet bis» where it shortens the Mietstage in the period
			billedUntil:
				billingStart(contract) > [contract.startDate.slice(0, 10), periodStart].sort()[1]
					? contract.billedUntil!
					: undefined,
			movedOut,
			// befristet, its end not reached: no Kündigungstermin before it (#76)
			fixedTerm: !!contract.endDate && !contract.terminated && !movedOut,
			oldAddress: !!contract.oldAddress, // A-5: moved out, still with the building's address
			buildingId
		});
	}
	return rows;
}

export async function generateStatements(fetch: Fetch, request: GenerationRequest) {
	const { periodStart, periodEnd, heatingProfileId, managementFeePercent } = request;
	const ids: string[] = [];
	for (const { buildingId, contract } of await contractsInPeriod(fetch, request)) {
		const statement = await call(fetch, 'statements/generate', {
			contractId: contract.id,
			buildingId,
			periodStart,
			periodEnd,
			heatingProfileId,
			managementFeePercent
		});
		ids.push(statement.id);
	}
	return ids;
}

type Period = { periodStart: string; periodEnd: string };
type Names = Parameters<typeof localName>[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON, mapped by toStatement
type Listed = Record<string, any>;

const nameOf = (names: Names | null) => (names ? localName(names) : m.common_unknown());

/** What the backend finds a kept statement doing differently from the run (#132, H-28 pair #16) */
type Difference = {
	id: string;
	profile: { used: Names | null; run: Names | null } | null;
	profileEdited: Names | null;
	fee: ChangedStatement['fee'];
};

/**
 * The building's statements of the run's period that a new run keeps although they differ from it (#132): a draft that
 * misses invoices of the period as they are now (#96's stored link), and what the backend finds it doing differently
 * from the run's settings (Heizprofil, Verwaltungspauschale), named in the UI language
 */
async function changedStatements(
	fetch: Fetch,
	buildingId: string,
	run: GenerationRequest,
	overlapping: Listed[],
	oldRule: (listed: Listed) => boolean
): Promise<ChangedStatement[]> {
	const query = new URLSearchParams({
		buildingId,
		periodStart: run.periodStart,
		periodEnd: run.periodEnd,
		...(run.heatingProfileId ? { heatingProfileId: run.heatingProfileId } : {}),
		managementFeePercent: String(run.managementFeePercent)
	});
	// only a hint (code review C-1): without the answer no settings are compared
	const { statements: differences = [] }: { statements?: Difference[] } = overlapping.length
		? await call(fetch, `statements/run-differences?${query}`).catch(() => ({}))
		: {};
	const settings = (listed: Listed) => {
		const found = differences.find((d) => d.id === listed.id);
		return {
			profile: found?.profile ? { used: nameOf(found.profile.used), run: nameOf(found.profile.run) } : null,
			profileEdited: found?.profileEdited ? localName(found.profileEdited) : null,
			fee: found?.fee ?? null
		};
	};
	const changed = await Promise.all(
		overlapping.map(async (listed) => {
			const { id, statementNumber, tenantName, status } = toStatement(listed);
			const later = status === 'draft' ? await laterChanges(fetch, id) : null;
			// the invoices and the Tankbestand changed since (#454, #408 point 8), and what it does differently
			const notes = { outdated: !!later?.invoices, fuelStock: !!later?.fuelStock, ...settings(listed), oldRule: oldRule(listed) };
			return Object.values(notes).some(Boolean) ? { id, statementNumber, tenantName, ...notes } : null;
		})
	);
	return changed.filter((one) => one !== null);
}

// The building's contracts this run bills: Mietstage in the period and no statement there yet (as contractsOf); only a
// hint, none when they do not load
async function runContracts(fetch: Fetch, buildingId: string, run: Run, overlapping: Listed[]) {
	const { contracts = [] }: { contracts?: Contract[] } = await call(fetch, `contracts?buildingId=${encodeURIComponent(buildingId)}&limit=1000`).catch(() => ({}));
	return contracts.filter(
		(c) => billsIn(c, { start: run.periodStart, end: run.periodEnd }) && !overlapping.some((s) => s.contractId === c.id)
	);
}

// A contract moving in or out in the period: by the Heizprofil a heating invoice with a Leistungszeitraum counts only its
// months (#339)
const movesIn = (c: Contract, { periodStart, periodEnd }: Run) =>
	billingStart(c) > periodStart || (!!c.endDate && c.endDate < periodEnd);

// The hints on heating by the Heizprofil need the contracts this run bills (#335, #339): heating invoices without
// Leistungszeitraum only at a move-in or move-out, a sent statement under the old rule only when the run bills another
// contract of its apartment
async function heatingHints(fetch: Fetch, buildingId: string, run: GenerationRequest, overlapping: Listed[], check?: InvoiceCheck) {
	const { heatingWithoutServicePeriod: hinted = [], oldHeatingRule: sent = [] } = check ?? {};
	const billed = hinted.length + sent.length ? await runContracts(fetch, buildingId, run, overlapping) : [];
	const change = !!run.heatingProfileId && billed.some((c) => movesIn(c, run));
	return { found: check && { ...check, heatingWithoutServicePeriod: change ? hinted : [] }, oldRule: rebills(sent, billed) };
}

// a sent statement under the old rule whose apartment the run bills again, by another contract
const rebills = (sent: string[], billed: Contract[]) => (listed: Listed) =>
	sent.includes(listed.id) && billed.some((c) => c.id !== listed.contractId && c.apartmentNumber === listed.apartment?.number);

/** Per building: the utility invoices of the period, the statements whose period overlaps it and the check per category */
export async function invoicesInPeriod(fetch: Fetch, run: GenerationRequest) {
	const { buildingIds, periodStart, periodEnd } = run;
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
				type Bill = HintedInvoice & {
					categoryId?: string | null;
					servicePeriodEnd?: string | null;
					inPeriod?: { start: string; end: string };
				};
				const dates = (invoices as Bill[])
					.flatMap((i) =>
						i.servicePeriodEnd && i.inPeriod ? [i.inPeriod.start, i.inPeriod.end] : [i.invoiceDate]
					)
					.sort();
				const overlapping = (statements as Listed[]).filter((s) => overlaps(s as Period));
				const { found, oldRule } = await heatingHints(fetch, buildingId, run, overlapping, check as InvoiceCheck | undefined);
				return {
					buildingId,
					count: invoices.length,
					first: dates[0] ?? null,
					last: dates.at(-1) ?? null,
					statements: (statements as Period[]).filter(overlaps).length,
					check: found,
					changed: await changedStatements(fetch, buildingId, run, overlapping, oldRule),
					// #382: the agreement is checked through the category, so the run waits for one on each
					uncategorized: (invoices as Bill[])
						.filter((i) => !i.categoryId)
						.map(({ id, billingEntityName, description, invoiceDate, amount }) => ({
							id,
							billingEntityName,
							description,
							invoiceDate,
							amount
						}))
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
	heatingWithoutServicePeriod: check.heatingWithoutServicePeriod?.map((invoice) => ({
		...invoice,
		categoryName: (invoice.categoryId && names.get(invoice.categoryId)) || ''
	})),
	findings: check.findings?.map((finding) => ({
		...finding,
		categoryName: finding.categoryId
			? (names.get(finding.categoryId) ?? finding.categoryName)
			: m.invoices_not_categorised()
	}))
});
