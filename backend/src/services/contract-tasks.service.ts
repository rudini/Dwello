import { fixedTermCheck, listContracts } from './contract.service';
import { formerTenantDocuments } from './document.service';
import type { Range } from './accounting-period';
import { laterContract } from './later-contract';
import { listStatements } from './statement.service';
import { missingByContract } from './statement-run.service';

/**
 * The overview's tasks about contracts (#788), decided here by the Swiss day: a notice with no later contract for the
 * apartment, a next tenant is still to find, also after the end (A-4.1, review K-6); an agreed end passed with no
 * sign the tenant left, as the contract page asks it (A-6); a former tenant's uploads from before the last
 * Vertragsende, until «Als geprüft markieren» (#178, #459)
 */
export async function contractTasks() {
	const { contracts } = await listContracts({ limit: 1000 });
	const noticedContracts = [];
	const expiredContracts = [];
	for (const c of contracts)
		if (c.terminated && c.endDate && !(await laterContract(c.apartmentId, c.endDate)))
			noticedContracts.push({
				id: c.id,
				tenantName: c.tenantName,
				apartmentId: c.apartmentId,
				apartmentNumber: c.apartmentNumber,
				endDate: c.endDate
			});
		else if (await fixedTermCheck(c)) expiredContracts.push({ id: c.id, tenantName: c.tenantName, endDate: c.endDate });
	const formerTenants = [];
	for (const tenantId of new Set(contracts.map((c) => c.tenantId))) {
		const former = await formerTenantDocuments(tenantId);
		if (former && !former.checkedOn)
			formerTenants.push({
				tenantId,
				tenantName: contracts.find((c) => c.tenantId === tenantId)!.tenantName,
				endDate: former.endDate,
				count: former.documentIds.length
			});
	}
	return {
		noticedContracts,
		expiredContracts,
		formerTenants,
		oldAddresses: await oldAddresses(),
		missingStatements: await missingStatements(contracts)
	};
}

// Drafts that would go to the apartment a moved-out tenant left, once per tenant (A-5, #114)
async function oldAddresses() {
	const { statements } = await listStatements({ status: 'draft', limit: 1000 });
	const byTenant = new Map<string, { tenantId: string; tenantName: string }>();
	for (const s of statements)
		if (s.oldAddress && s.tenant) byTenant.set(s.tenantId, { tenantId: s.tenantId, tenantName: `${s.tenant.firstName} ${s.tenant.lastName}` });
	return [...byTenant.values()];
}

// Per building the parts of ended Abrechnungsperioden since a Vertragsbeginn without a statement, as on the contract
// page (#211); each once, the latest first, also of a contract that has ended since
async function missingStatements(contracts: { id: string; buildingId: string; buildingName: string }[]) {
	const missing: Record<string, Range[]> = await missingByContract();
	const byBuilding = new Map<string, { building: string; buildingId: string; periods: Map<string, Range> }>();
	for (const c of contracts)
		for (const { start, end } of missing[c.id] ?? []) {
			const entry = byBuilding.get(c.buildingName) ?? { building: c.buildingName, buildingId: c.buildingId, periods: new Map() };
			entry.buildingId = c.buildingId; // the building's id, for the link to its invoices (#454)
			entry.periods.set(`${start}/${end}`, { start, end });
			byBuilding.set(c.buildingName, entry);
		}
	return [...byBuilding.values()]
		.sort((a, b) => a.building.localeCompare(b.building, 'de-CH'))
		.map(({ building, buildingId, periods }) => ({
			building,
			buildingId,
			periods: [...periods.values()].sort((a, b) => b.start.localeCompare(a.start) || b.end.localeCompare(a.end))
		}));
}
