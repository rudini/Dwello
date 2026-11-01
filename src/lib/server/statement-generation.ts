import { backendMessage } from '$lib/backend-error';
import { periodDays } from '$lib/accounting-period';
import { m } from '$lib/paraglide/messages';
import { localName } from '$lib/names';
import { localSplitKeys, namesById, toStatement } from '$lib/server/statement';
import type { ChangedStatement, HeatingSum, HintedInvoice, InvoiceCheck } from '$lib/statement-wizard';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

type Fetch = typeof globalThis.fetch;
type Contract = {
	id: string;
	tenantName: string;
	apartmentId?: string;
	apartmentNumber: string;
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
	// what the preview says about each contract (H-28, #717): moved out, befristet, «Abgerechnet bis» where it shortens
	contracts: (Contract & { billed: boolean; movedOut: boolean; fixedTerm: boolean; shortenedTo: string | null })[];
	withoutFee: { id: string; tenantName: string; apartmentNumber: string }[];
	overlap: {
		periods: Range[];
		choose: Range[];
		short: Range[];
		vacant: boolean;
		statements: number;
		// #521: the contracts with a letter for the tenants' consent to the new Abrechnungsperiode
		consent: { id: string; tenantName: string; apartmentNumber: string }[];
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
				withoutFee: plan.withoutFee,
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
		({ buildingId, inPeriod, billed, overlap, withoutFee, skipped }) => ({
			buildingId,
			contracts: inPeriod.length,
			billed: billed.length,
			overlap,
			withoutFee,
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
			// #453 (#327): «Abgerechnet bis» where it shortens the Mietstage in the period, #76 befristet (H-28: the backend's)
			billedUntil: contract.shortenedTo ?? undefined,
			movedOut: contract.movedOut,
			fixedTerm: contract.fixedTerm,
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

// The building, the period and the Heizprofil of a run, as the backend's run routes take them
const runQuery = (buildingId: string, run: GenerationRequest) =>
	new URLSearchParams({
		buildingId,
		periodStart: run.periodStart,
		periodEnd: run.periodEnd,
		...(run.heatingProfileId ? { heatingProfileId: run.heatingProfileId } : {})
	});

const nameOf = (names: Names | null) => (names ? localName(names) : m.common_unknown());

/** What the backend finds a kept statement doing differently from the run (#132, H-28 pair #16) */
type Difference = {
	id: string;
	profile: { used: Names | null; run: Names | null } | null;
	profileEdited: Names | null;
	fee: ChangedStatement['fee'];
	outdated: boolean; // a draft whose invoices changed since (#454): only a draft, the backend decides (H-28, #717)
	fuelStock: boolean; // a draft whose Tankbestand changed since (#408 point 8)
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
	heating: Pick<Awaited<ReturnType<typeof heatingHints>>, 'oldRule' | 'heatingSum'>
): Promise<ChangedStatement[]> {
	const query = runQuery(buildingId, run);
	query.set('managementFeePercent', String(run.managementFeePercent));
	// only a hint (code review C-1): without the answer no settings are compared
	const { statements: differences = [] }: { statements?: Difference[] } = overlapping.length
		? await call(fetch, `statements/run-differences?${query}`).catch(() => ({}))
		: {};
	const settings = (listed: Listed) => {
		const found = differences.find((d) => d.id === listed.id);
		return {
			profile: found?.profile ? { used: nameOf(found.profile.used), run: nameOf(found.profile.run) } : null,
			profileEdited: found?.profileEdited ? localName(found.profileEdited) : null,
			fee: found?.fee ?? null,
			outdated: !!found?.outdated,
			fuelStock: !!found?.fuelStock
		};
	};
	return overlapping.flatMap((listed) => {
		// a row of GET /statements has the statement's form (backend/src/api/statement.ts)
		const { id, statementNumber, tenantName } = toStatement(listed as Parameters<typeof toStatement>[0]);
		// the invoices and the Tankbestand changed since (#454, #408 point 8), and what it does differently
		const notes = { ...settings(listed), oldRule: heating.oldRule(listed), heatingSum: heating.heatingSum(listed) };
		return Object.values(notes).some(Boolean) ? [{ id, statementNumber, tenantName, ...notes }] : [];
	});
}

// The hints on heating by the Heizprofil that concern this run (#335, #339), as the backend decides them (H-28); asked
// only when the check has some, none when they do not load
async function heatingHints(fetch: Fetch, buildingId: string, run: GenerationRequest, check?: InvoiceCheck) {
	const { heatingWithoutServicePeriod: hinted = [], oldHeatingRule: sent = [] } = check ?? {};
	const forRun: Partial<Pick<InvoiceCheck, 'heatingWithoutServicePeriod' | 'oldHeatingRule'> & { heatingSums: HeatingSum[] }> =
		hinted.length + sent.length ? await call(fetch, `statements/run-heating?${runQuery(buildingId, run)}`).catch(() => ({})) : {};
	const { heatingWithoutServicePeriod = [], oldHeatingRule = [], heatingSums = [] } = forRun;
	return {
		found: check && { ...check, heatingWithoutServicePeriod },
		oldRule: (listed: Listed) => oldHeatingRule.includes(listed.id),
		// #508: the heating sum of its apartment, on its first statement under the old rule
		heatingSum: (listed: Listed) => heatingSums.find((sum) => sum.statementId === listed.id) ?? null
	};
}

/** Per building: the utility invoices of the period, the statements whose period overlaps it and the check per category */
export async function invoicesInPeriod(fetch: Fetch, run: GenerationRequest) {
	const { buildingIds, periodStart, periodEnd } = run;
	const overlaps = (s: Period) => s.periodStart <= periodEnd && s.periodEnd >= periodStart;
	const [rows, categories, keys] = await Promise.all([
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
				const { found, ...heating } = await heatingHints(fetch, buildingId, run, check as InvoiceCheck | undefined);
				return {
					buildingId,
					count: invoices.length,
					first: dates[0] ?? null,
					last: dates.at(-1) ?? null,
					statements: (statements as Period[]).filter(overlaps).length,
					check: found,
					changed: await changedStatements(fetch, buildingId, run, overlapping, heating),
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
		namesById(fetch, 'categories'),
		namesById(fetch, 'distribution-keys')
	]);
	return rows.map((row) => ({
		...row,
		check: row.check && localCheck(row.check, categories, keys)
	}));
}

// The check names each category and key in German: here in the UI language
const localCheck = (
	check: InvoiceCheck,
	names: Map<string, string>,
	keys: Map<string, string>
): InvoiceCheck => ({
	...check,
	splitKeys: localSplitKeys(check.splitKeys, names, keys),
	heatingWithoutServicePeriod: check.heatingWithoutServicePeriod?.map((invoice) => ({
		...invoice,
		categoryName: (invoice.categoryId && names.get(invoice.categoryId)) || ''
	})),
	findings: check.findings?.map((finding) => ({
		...finding,
		categoryName: finding.categoryId
			? (names.get(finding.categoryId) ?? finding.categoryName)
			: m.invoices_not_categorised(),
		...(finding.keyId && { keyName: keys.get(finding.keyId) ?? '' })
	}))
});
