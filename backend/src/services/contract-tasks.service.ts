import { fixedTermCheck, listContracts } from './contract.service';
import { formerTenantDocuments } from './document.service';
import { laterContract } from './later-contract';

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
	return { noticedContracts, expiredContracts, formerTenants };
}
