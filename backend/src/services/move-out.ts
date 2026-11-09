// The move-out hint of an ended contract (#664): the rule on rows loaded once, for a list as for one contract (P2),
// apart from the statement run (fitness fat-module)
import { moveOut, overlapped, type AccountingPeriodType } from './accounting-period';
import { listContracts, type ContractWithDetails } from './contract.service';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, utilityStatements } from '../db/schema';
import { typeOf, typesByBuilding } from './statement-run.service';
import { swissToday } from './today';

type Statement = { periodStart: string; periodEnd: string; status: string; contractId: string | null; apartmentId: string };
type Contract = {
	id: string;
	apartmentId: string;
	buildingId: string;
	tenantName: string;
	startDate: string;
	endDate: string | null;
	billedUntil: string | null;
	terminated: boolean | null;
	movedOut: boolean | null;
};

/**
 * #664: an ended contract's move-out until its Schlussabrechnung exists, with whose it is (Persona Helga 664-2 P-2);
 * none for a fixed-term end without notice, «Auszug bestätigt» or a later contract of the apartment (A-4, A-6), also
 * on the end day: whether the tenant stays is open (Art. 266 Abs. 2 OR, Fachreview 664-1 M-1, code review 664-1 C-1);
 * `outside` as for a missing statement. `contracts` and `statements` hold at least those of the contract's building.
 */
function moveOutIn(contract: Contract, contracts: Contract[], type: AccountingPeriodType, statements: Statement[]) {
	const later = contracts.some((n) => n.apartmentId === contract.apartmentId && n.startDate > contract.endDate!);
	if (!contract.terminated && !contract.movedOut && contract.endDate && !later) return null;
	const move = moveOut(type, contract, statements.filter((s) => s.contractId === contract.id));
	if (!move) return null;
	const ofBuilding = new Set(contracts.filter((c) => c.buildingId === contract.buildingId).map((c) => c.apartmentId));
	const outside = move.due && overlapped(move.period, statements.filter((s) => ofBuilding.has(s.apartmentId))).length > 0;
	return { ...move, tenantName: contract.tenantName, outside };
}

/** #664: per apartment the move-out of its latest contract ended by today */
function moveOutsIn(apartmentIds: string[], contracts: Contract[], types: Map<string, AccountingPeriodType>, statements: Statement[]) {
	const today = swissToday();
	const latestEnded = (id: string) =>
		contracts.filter((c) => c.apartmentId === id && c.endDate && c.endDate <= today).sort((a, b) => b.endDate!.localeCompare(a.endDate!))[0];
	return new Map(
		apartmentIds.map((id) => {
			const ended = latestEnded(id);
			return [id, ended ? moveOutIn(ended, contracts, types.get(ended.buildingId) ?? 'calendar', statements) : null] as const;
		})
	);
}

// only the columns the rule reads, not listStatements: it loads line items, and a new user of statement-query.service
// would put it against the stability of its own dependencies (fitness unstable-dependency)
const statementsOf = (buildingId?: string) =>
	db
		.select({
			periodStart: utilityStatements.periodStart,
			periodEnd: utilityStatements.periodEnd,
			status: utilityStatements.status,
			contractId: utilityStatements.contractId,
			apartmentId: utilityStatements.apartmentId
		})
		.from(utilityStatements)
		.innerJoin(apartments, eq(utilityStatements.apartmentId, apartments.id))
		.where(buildingId ? eq(apartments.buildingId, buildingId) : undefined);

/** #664: the move-out hint of an ended contract, loaded once per call */
export async function moveOutOf(contract: ContractWithDetails) {
	const [{ contracts }, type, statements] = await Promise.all([
		listContracts({ buildingId: contract.buildingId, limit: null }),
		typeOf(contract.buildingId),
		statementsOf(contract.buildingId)
	]);
	return moveOutIn(contract, contracts, type, statements);
}

/** #664: the apartments with a move-out, of one building or all, loaded once for the list, not per row (P2) */
export async function moveOutsByApartment(buildingId?: string) {
	const [{ contracts }, statements, types] = await Promise.all([
		listContracts({ buildingId, limit: null }),
		statementsOf(buildingId),
		typesByBuilding()
	]);
	const moveOuts = moveOutsIn([...new Set(contracts.map((c) => c.apartmentId))], contracts, types, statements);
	return [...moveOuts].flatMap(([apartmentId, moveOut]) => (moveOut ? [{ apartmentId, moveOut }] : []));
}
