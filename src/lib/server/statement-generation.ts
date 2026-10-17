import { backendMessage } from '$lib/backend-error';
import { localToday } from '$lib/contract-status';
import { m } from '$lib/paraglide/messages';
import { localName } from '$lib/names';
import { changedInvoiceCount, namesById, toStatement } from '$lib/server/statement';
import type { ChangedStatement, InvoiceCheck } from '$lib/statement-wizard';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

type Fetch = typeof globalThis.fetch;
type Contract = {
	id: string;
	startDate: string;
	endDate: string | null;
	tenantName: string;
	apartmentNumber: string;
	managementFeeAgreed?: boolean;
	managementFeePercent?: string | null; // its own rate, before the run's (#89)
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

// Per building: its contracts that overlap the period, and those of them with a statement in the period already
// TODO(fachlich prüfen, #199): an overlapping statement counts as billed, the dashboard counts only one inside the period
async function contractsOf(fetch: Fetch, { buildingIds, periodStart, periodEnd }: Run) {
	return Promise.all(
		buildingIds.map(async (buildingId) => {
			const [{ contracts }, { data: statements }] = await Promise.all([
				call(fetch, `contracts?buildingId=${encodeURIComponent(buildingId)}&limit=1000`),
				call(fetch, `statements?buildingId=${encodeURIComponent(buildingId)}&limit=1000`)
			]);
			const billed = new Set(
				(statements as (Period & { contractId: string })[])
					.filter((s) => s.periodStart <= periodEnd && s.periodEnd >= periodStart)
					.map((s) => s.contractId)
			);
			const inPeriod = (contracts as Contract[]).filter(
				(c) => c.startDate <= periodEnd && (!c.endDate || c.endDate >= periodStart)
			);
			return { buildingId, inPeriod, billed: inPeriod.filter((c) => billed.has(c.id)) };
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

/**
 * Per building: its contracts in the period and how many of them have a statement there already (wizard step 2), and
 * those this run bills without an agreed Verwaltungspauschale (#89, step «Einstellungen»)
 */
export async function billedContracts(fetch: Fetch, request: Run) {
	return (await contractsOf(fetch, request)).map(({ buildingId, inPeriod, billed }) => ({
		buildingId,
		contracts: inPeriod.length,
		billed: billed.length,
		withoutFee: inPeriod
			.filter((c) => !billed.includes(c) && !c.managementFeeAgreed)
			.map(({ id, tenantName, apartmentNumber }) => ({ id, tenantName, apartmentNumber }))
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
type Profile = Parameters<typeof localName>[0] & { id: string; updatedAt: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON, mapped by toStatement
type Listed = Record<string, any>;

const nameOf = (profiles: Profile[], id: string | null) => {
	const profile = profiles.find((p) => p.id === id);
	return profile ? localName(profile) : m.common_unknown();
};

// The statement's own profile edited since it was made: it keeps the Monatsanteile of its time (Fachreview V-1)
const editedSince = (listed: Listed, profiles: Profile[]) => {
	const edited = profiles.find((p) => p.id === listed.heatingProfileId)?.updatedAt;
	return !!edited && Date.parse(edited) > Date.parse(listed.createdAt);
};

// Another Heizprofil, named as the statement stored it (#209), or its own one edited since; neither counts for a
// contract over the whole period, shared by days whatever the profile (Dr. Weber P-2, Fachreview V-8, code review C-13)
function profileDifference(listed: Listed, run: GenerationRequest, profiles: Profile[]) {
	const share = listed.heatingShare;
	const id: string | null = listed.heatingProfileId;
	if (share?.reason === 'wholePeriod') return { profile: null, profileEdited: null };
	if (id !== run.heatingProfileId) {
		const used = share?.names ? localName(share.names) : nameOf(profiles, id);
		return { profile: { used, run: nameOf(profiles, run.heatingProfileId) }, profileEdited: null };
	}
	const since = share?.byDays === false && editedSince(listed, profiles);
	return { profile: null, profileEdited: since ? nameOf(profiles, id) : null };
}

// The rate the run stores for the contract: 0 without an agreed fee, its own rate before the run's (#89, Fachreview M-1)
function feeDifference(listed: Listed, contract: Contract, run: GenerationRequest) {
	const used = Number(listed.managementFeePercent ?? 0);
	const now = !contract.managementFeeAgreed
		? { now: 0, source: 'none' as const }
		: contract.managementFeePercent != null
			? { now: Number(contract.managementFeePercent), source: 'contract' as const }
			: { now: run.managementFeePercent, source: 'run' as const };
	return Math.abs(now.now - used) > 0.001 ? { used, ...now } : null;
}

/**
 * The building's statements of the run's period that a new run keeps although they differ from it (#132): a draft that
 * misses invoices of the period as they are now (#96's stored link), and, in the same Abrechnungsperiode only
 * (Fachreview V-4), another Heizprofil, one edited since the statement was made, or another rate
 */
async function changedStatements(
	fetch: Fetch,
	buildingId: string,
	run: GenerationRequest,
	overlapping: Listed[],
	profiles: () => Promise<Profile[]>
): Promise<ChangedStatement[]> {
	const same = overlapping.filter(
		(s) => s.periodStart === run.periodStart && s.periodEnd === run.periodEnd
	);
	// only a hint (code review C-1): without contracts or Heizprofile no settings are compared
	const [{ contracts = [] }, known]: [{ contracts?: Contract[] }, Profile[]] = same.length
		? await Promise.all([
				call(fetch, `contracts?buildingId=${encodeURIComponent(buildingId)}&limit=1000`),
				profiles()
			]).catch(() => [{}, []])
		: [{}, []];
	const settings = (listed: Listed) => {
		const contract = contracts.find((c) => c.id === listed.contractId);
		return same.includes(listed) && contract && known.length
			? { ...profileDifference(listed, run, known), fee: feeDifference(listed, contract, run) }
			: { profile: null, profileEdited: null, fee: null };
	};
	const changed = await Promise.all(
		overlapping.map(async (listed) => {
			const { id, statementNumber, tenantName, status } = toStatement(listed);
			const outdated = status === 'draft' && (await changedInvoiceCount(fetch, id)) > 0;
			const differs = settings(listed);
			return outdated || differs.profile || differs.profileEdited || differs.fee
				? { id, statementNumber, tenantName, outdated, ...differs }
				: null;
		})
	);
	return changed.filter((one) => one !== null);
}

/** Per building: the utility invoices of the period, the statements whose period overlaps it and the check per category */
export async function invoicesInPeriod(fetch: Fetch, run: GenerationRequest) {
	const { buildingIds, periodStart, periodEnd } = run;
	const overlaps = (s: Period) => s.periodStart <= periodEnd && s.periodEnd >= periodStart;
	// loaded once, only when a building has statements of the period to compare (#132)
	let profiles: Promise<Profile[]> | undefined;
	const loadProfiles = () =>
		(profiles ??= call(fetch, 'heating-profiles?limit=100').then((body) => body.data ?? []));
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
					check: check as InvoiceCheck | undefined,
					changed: await changedStatements(
						fetch,
						buildingId,
						run,
						(statements as Listed[]).filter((s) => overlaps(s as Period)),
						loadProfiles
					)
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
