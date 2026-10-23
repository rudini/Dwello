/**
 * H-28: the run of an Abrechnungsperiode for a building, decided here and not in the BFF: the contracts with Mietstage
 * in the period, which of them have a statement there already (a run bills those no more), those «Abgerechnet bis»
 * leaves without Mietstage there, and whether the period overlaps one of the building's
 */
import { billsIn, lastCompletedPeriod, missingPeriods, missingWays, overlaps, periodsOf, same, uncovered, type AccountingPeriodType, type Range } from './accounting-period';
import { getTypedConfig } from './config.service';
import { getContract, listContracts, type ContractWithDetails } from './contract.service';
import { listHeatingProfiles } from './heating-profile.service';
import { isRealDate } from './real-date';
import { listStatements } from './statement.service';
import { swissToday } from './today';

type Contract = Pick<ContractWithDetails, 'id' | 'startDate' | 'endDate' | 'billedUntil' | 'tenantName'>;
type Statement = { contractId: string; periodStart: string; periodEnd: string; status: string };

const within = (s: Statement, p: Range) => overlaps({ start: s.periodStart, end: s.periodEnd }, p);

/**
 * #199, #408 point 2: one Abrechnungsperiode per day and building. When the run's period overlaps a statement period
 * of the building without being equal, the run is refused for it (a run equal to one of the periods is allowed:
 * statements made before this rule may overlap, product owner, Fachreview 199-1 V-1); the ways out are the overlapped
 * periods in which a contract has Mietstage but no statement, and the days of the run that no statement covers, ended
 * and with Mietstage (short periods), neither ever refused itself (Fachreview 199-1 V-1, V-4, V-5); `vacant`: those
 * days have no Mietstage (V-3); `statements`: how many statements have the overlapped periods. Statements made before
 * stay as they are
 */
function overlapOf(run: Range, contracts: Contract[], statements: Statement[], today: string) {
	const periods = periodsOf(statements);
	const overlapped = periods.some((p) => same(p, run)) ? [] : periods.filter((p) => overlaps(p, run));
	if (!overlapped.length) return null;
	// a contract with a statement that overlaps the period is billed there (#199), a replaced one bills there no more (#120)
	const billing = statements.filter((s) => s.status !== 'replaced');
	const unbilled = (p: Range) => contracts.some((c) => billsIn(c, p) && !billing.some((s) => s.contractId === c.id && within(s, p)));
	const rest = uncovered(run, statements).filter((days) => days.end < today).reverse();
	const short = rest.filter((days) => contracts.some((c) => billsIn(c, days)));
	return {
		periods: overlapped,
		choose: overlapped.filter(unbilled),
		short,
		vacant: rest.length > 0 && !short.length,
		// a replaced statement and its berichtigte Abrechnung are one (code review 199-3 C-12)
		statements: new Set(statements.filter((s) => overlapped.some((p) => within(s, p))).map((s) => `${s.contractId}/${s.periodStart}/${s.periodEnd}`)).size
	};
}

/** The plan of a run over the building's contracts and statements */
export function planRun<C extends Contract>(period: Range, contracts: C[], statements: Statement[], today = swissToday()) {
	// a statement replaced in this very period does not count: the run creates its berichtigte Abrechnung (#120)
	const replacedHere = (s: Statement) => s.status === 'replaced' && s.periodStart === period.start && s.periodEnd === period.end;
	// a statement overlapping the period bills the contract there (#199, #211)
	const overlapping = statements.filter((s) => s.periodStart <= period.end && s.periodEnd >= period.start && !replacedHere(s));
	return {
		contracts: contracts
			.filter((c) => billsIn(c, period))
			.map((c) => ({ ...c, billed: overlapping.some((s) => s.contractId === c.id) })),
		overlap: overlapOf(period, contracts, statements, today),
		// #453 (#327): in the period by its dates, but «Abgerechnet bis» leaves it no Mietstage there
		skipped: contracts
			.filter((c) => !billsIn(c, period) && billsIn({ ...c, billedUntil: null }, period))
			.map(({ id, tenantName, billedUntil }) => ({ id, tenantName, billedUntil }))
	};
}

export async function runPlan(buildingId: string, period: Range) {
	const [{ contracts }, { statements }] = await Promise.all([
		listContracts({ buildingId, limit: 1000 }),
		listStatements({ buildingId, limit: 1000 })
	]);
	return planRun(period, contracts, statements);
}

/**
 * A-10, #142, #199, #408 point 2: the parts of ended Abrechnungsperioden since the Vertragsbeginn with Mietstage but no
 * statement, the latest first, each with its way into the wizard; null for an unknown contract
 */
export async function missingOfContract(id: string) {
	const contract = await getContract(id);
	if (!contract) return null;
	const [type, { statements }, { statements: ofBuilding }] = await Promise.all([
		getTypedConfig('accounting_period'),
		listStatements({ contractId: id, limit: 1000 }),
		listStatements({ buildingId: contract.buildingId, limit: 1000 })
	]);
	return missingWays(type as AccountingPeriodType, contract, statements, ofBuilding);
}

/** #211: per contract id, the parts of ended Abrechnungsperioden without a statement, as on the contract page */
export async function missingByContract() {
	// ponytail: every contract and statement in one list; under 50 apartments that stays far below the limit
	const [type, { contracts }, { statements }] = await Promise.all([
		getTypedConfig('accounting_period'),
		listContracts({ limit: 1000 }),
		listStatements({ limit: 1000 })
	]);
	return Object.fromEntries(
		contracts.map((c) => [c.id, missingPeriods(type as AccountingPeriodType, c, statements.filter((s) => s.contractId === c.id))])
	);
}

type Settings = { accountingPeriod: AccountingPeriodType; managementFeePercent: number; heatingProfileId: string | null };
type Link = { buildingId: string; period: Range };
type Tenancy = Contract & Pick<ContractWithDetails, 'apartmentId' | 'managementFeeAgreed' | 'managementFeePercent'>;
type Settled = Statement & { heatingProfileId: string | null; managementFeePercent: string | null };

/**
 * At a tenant change the statement of the same apartment, when the apartments of the contracts the run bills name one
 * Heizprofil: so the tenants of an apartment carry 100 % of its heating costs (#387, #406 point 7)
 */
function apartmentProfile(period: Range, contracts: Tenancy[], statements: Settled[], profiles: Settled[]) {
	const apartments = new Set(planRun(period, contracts, statements).contracts.filter((c) => !c.billed).map((c) => c.apartmentId));
	const apartmentOf = (contractId: string) => contracts.find((c) => c.id === contractId)?.apartmentId;
	const named = profiles.filter((s) => apartments.has(apartmentOf(s.contractId)!));
	return new Set(named.map((s) => s.heatingProfileId)).size === 1 ? named[0] : undefined;
}

/**
 * A-10: what the wizard starts with. A link to a building and period takes the Heizprofil and the Verwaltungspauschale
 * of the building's other statements of that period, otherwise the settings
 */
export function runDefaults(settings: Settings, link: Link | null, contracts: Tenancy[], statements: Settled[], today = swissToday()) {
	const fromSettings = {
		period: lastCompletedPeriod(settings.accountingPeriod, today),
		buildingId: null,
		heatingProfileId: settings.heatingProfileId,
		managementFeePercent: settings.managementFeePercent,
		preset: null
	};
	if (!link) return fromSettings;
	const { start, end } = link.period;
	// a replaced statement does not count as one of the period (Fachreview 387-1 V-1, glossary «Ersetzt»)
	const others = statements.filter((s) => s.periodStart >= start && s.periodEnd <= end && s.status !== 'replaced');
	// a statement stores its contract's rate (#89): only one at the run's rate tells the run's rate (fach-review V-1);
	// the heating profile comes from any of them, as before #89 (closing review C-1)
	const runRates = others.filter((s) => contracts.some((c) => c.id === s.contractId && c.managementFeeAgreed && c.managementFeePercent == null));
	// set differently, they tell nothing: both from the settings (#119); a deleted profile is no setting (fach-review V-5)
	const profiles = others.filter((s) => s.heatingProfileId);
	const differing =
		new Set(profiles.map((s) => s.heatingProfileId)).size > 1 || new Set(runRates.map((s) => Number(s.managementFeePercent))).size > 1;
	const profile = differing ? apartmentProfile(link.period, contracts, statements, profiles) : profiles[0];
	const runRate = differing ? undefined : runRates[0];
	return {
		period: link.period,
		buildingId: link.buildingId,
		heatingProfileId: profile?.heatingProfileId ?? settings.heatingProfileId,
		managementFeePercent: runRate ? Number(runRate.managementFeePercent) : settings.managementFeePercent,
		preset: { fromStatements: !!profile, feeFromSettings: !runRate, differing, profileFromApartment: differing && !!profile }
	};
}

/** The wizard's defaults for a link (A-10); a link with an impossible period is ignored: the settings (review K-5) */
export async function runDefaultsOf(query: { buildingId?: string; periodStart?: string; periodEnd?: string }) {
	const [accountingPeriod, managementFeePercent, heatingProfileId] = await Promise.all([
		getTypedConfig('accounting_period'),
		getTypedConfig('management_fee_pct'),
		getTypedConfig('default_heating_profile_id')
	]);
	const settings = { accountingPeriod: accountingPeriod as AccountingPeriodType, managementFeePercent, heatingProfileId };
	const { buildingId, periodStart, periodEnd } = query;
	const real = (day?: string) => !!day && isRealDate(day);
	if (!buildingId || !real(periodStart) || !real(periodEnd) || periodStart! > periodEnd!) return runDefaults(settings, null, [], []);
	const [{ contracts }, { statements }] = await Promise.all([
		listContracts({ buildingId, limit: 1000 }),
		listStatements({ buildingId, limit: 1000 })
	]);
	return runDefaults(settings, { buildingId, period: { start: periodStart!, end: periodEnd! } }, contracts, statements);
}


type Names = { name: string; nameDE: string | null; nameFR: string | null; nameIT: string | null; nameEN: string | null };
type Profile = Names & { id: string; updatedAt: Date };
type Share = { byDays: boolean; reason?: string; names?: Names } | null;
type Kept = Omit<Settled, 'status'> & { id: string; heatingShare: Share; createdAt: Date };
type RunSettings = { period: Range; heatingProfileId: string | null; managementFeePercent: number };

const namesOf = ({ name, nameDE, nameFR, nameIT, nameEN }: Names) => ({ name, nameDE, nameFR, nameIT, nameEN });

const namedIn = (profiles: Profile[], id: string | null) => {
	const profile = profiles.find((p) => p.id === id);
	return profile ? namesOf(profile) : null;
};

// Its own profile edited since the statement was made: the statement keeps the Monatsanteile of its time (Fachreview V-1)
const editedSince = (statement: Kept, profiles: Profile[]) => {
	const edited = profiles.find((p) => p.id === statement.heatingProfileId)?.updatedAt;
	return statement.heatingShare?.byDays === false && !!edited && edited > statement.createdAt;
};

// Another Heizprofil, named as the statement stored it (#209), or its own one edited since; neither counts for a
// contract over the whole period, shared by days whatever the profile (Dr. Weber P-2, Fachreview V-8, code review C-13)
function profileDifference(statement: Kept, run: RunSettings, profiles: Profile[]) {
	const { heatingShare: share, heatingProfileId: id } = statement;
	if (share?.reason === 'wholePeriod') return { profile: null, profileEdited: null };
	if (id !== run.heatingProfileId)
		return { profile: { used: share?.names ? namesOf(share.names) : namedIn(profiles, id), run: namedIn(profiles, run.heatingProfileId) }, profileEdited: null };
	return { profile: null, profileEdited: editedSince(statement, profiles) ? namedIn(profiles, id) : null };
}

// The rate the run stores for the contract: 0 without an agreed fee, its own rate before the run's (#89, Fachreview M-1)
function feeDifference(statement: Kept, contract: Pick<Tenancy, 'managementFeeAgreed' | 'managementFeePercent'>, run: RunSettings) {
	const used = Number(statement.managementFeePercent ?? 0);
	const now = !contract.managementFeeAgreed
		? { now: 0, source: 'none' as const }
		: contract.managementFeePercent != null
			? { now: Number(contract.managementFeePercent), source: 'contract' as const }
			: { now: run.managementFeePercent, source: 'run' as const };
	return Math.abs(now.now - used) > 0.001 ? { used, ...now } : null;
}

/**
 * #132, H-28 pair #16: the statements of the run's very Abrechnungsperiode (Fachreview V-4) that a new run keeps
 * although they used another Heizprofil, one edited since they were made, or another Verwaltungspauschale
 */
export function runDifferences(
	run: RunSettings,
	statements: Kept[],
	contracts: Pick<Tenancy, 'id' | 'managementFeeAgreed' | 'managementFeePercent'>[],
	profiles: Profile[]
) {
	return statements.flatMap((statement) => {
		const contract = contracts.find((c) => c.id === statement.contractId);
		if (!contract || !same({ start: statement.periodStart, end: statement.periodEnd }, run.period)) return [];
		const differs = { id: statement.id, ...profileDifference(statement, run, profiles), fee: feeDifference(statement, contract, run) };
		return differs.profile || differs.profileEdited || differs.fee ? [differs] : [];
	});
}

/** The building's statements of the run's period that differ from the run's settings (#132, H-28) */
export async function runDifferencesOf(buildingId: string, run: RunSettings) {
	const [{ contracts }, { statements }, { heatingProfiles }] = await Promise.all([
		listContracts({ buildingId, limit: 1000 }),
		listStatements({ buildingId, periodStart: run.period.start, periodEnd: run.period.end, limit: 1000 }),
		listHeatingProfiles({ limit: 1000 })
	]);
	return { statements: runDifferences(run, statements, contracts, heatingProfiles) };
}
