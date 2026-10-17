import { contractStatusOn } from './contract-status';

type Contract = {
	apartmentId?: string;
	startDate: string;
	endDate: string | null;
	terminated?: boolean;
	movedOut?: boolean;
};
type Document = { type: string; createdAt: string };

// The day in Switzerland a document was uploaded; the server stores UTC
const swissDay = (timestamp: string) =>
	new Date(timestamp).toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

/**
 * Once all Mietverträge of a tenant have ended (ehemaliger Mieter), the documents the landlord uploaded before the
 * last Vertragsende, to look at and delete what is no longer needed (#178, DSG Art. 6 Abs. 4); null when there are none.
 * apartmentContracts: the contracts of the apartment of the last one, whatever their tenant
 */
export function formerTenantDocuments<D extends Document>(
	contracts: Contract[],
	documents: D[],
	today: string,
	apartmentContracts: Contract[] = []
) {
	if (
		!contracts.length ||
		contracts.some((c) => contractStatusOn(c.startDate, c.endDate, today) !== 'ended')
	)
		return null;
	const last = contracts.reduce((a, b) => (a.endDate! > b.endDate! ? a : b));
	// after an agreed end without notice the tenant may have stayed, until «Mieter ist ausgezogen» or a later
	// contract for the apartment (A-6)
	const later = apartmentContracts.some(
		(c) => c.apartmentId === last.apartmentId && c.startDate > last.endDate!
	);
	if (!last.terminated && !last.movedOut && !later) return null;
	const endDate = last.endDate!.slice(0, 10);
	const before = documents.filter((d) => d.type === 'upload' && swissDay(d.createdAt) < endDate);
	return before.length ? { endDate, documents: before } : null;
}
