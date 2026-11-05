// The move-out hint of an ended contract (#664), apart from the statement run it reads
import { moveOut, overlapped } from './accounting-period';
import { listContracts, type ContractWithDetails } from './contract.service';
import { laterContract } from './later-contract';
import { listStatements } from './statement.service';
import { typeOf } from './statement-run.service';
import { swissToday } from './today';

/**
 * #664: an ended contract's move-out until its Schlussabrechnung exists, with whose it is (Persona Helga 664-2 P-2);
 * none for a fixed-term end without notice, «Auszug bestätigt» or a later contract, also on the end day: whether the
 * tenant stays is open (Art. 266 Abs. 2 OR, Fachreview 664-1 M-1, code review 664-1 C-1); `outside` as for a missing
 * statement
 */
export async function moveOutOf(contract: ContractWithDetails) {
	if (!contract.terminated && !contract.movedOut && contract.endDate && !(await laterContract(contract.apartmentId, contract.endDate))) return null;
	const [type, { statements }] = await Promise.all([typeOf(contract.buildingId), listStatements({ contractId: contract.id, limit: 1000 })]);
	const move = moveOut(type, contract, statements);
	if (!move) return null;
	const { statements: ofBuilding } = move.due ? await listStatements({ buildingId: contract.buildingId, limit: 1000 }) : { statements: [] };
	return { ...move, tenantName: contract.tenantName, outside: overlapped(move.period, ofBuilding).length > 0 };
}

/** #664: per apartment the move-out of its latest contract ended by today */
export async function moveOutsByApartment(apartmentIds: string[]) {
	// ponytail: every contract in one list and a few queries per apartment; under 50 apartments that stays small
	const { contracts } = await listContracts({ limit: 1000 });
	const today = swissToday();
	const latestEnded = (id: string) =>
		contracts.filter((c) => c.apartmentId === id && c.endDate && c.endDate <= today).sort((a, b) => b.endDate!.localeCompare(a.endDate!))[0];
	return new Map(await Promise.all(apartmentIds.map(async (id) => [id, latestEnded(id) ? await moveOutOf(latestEnded(id)) : null] as const)));
}
