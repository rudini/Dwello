import { contractStatusOn } from './contract-status';

type Contract = { startDate: string; endDate: string | null };
type Document = { type: string; createdAt: string };

// The day in Switzerland a document was uploaded; the server stores UTC
const swissDay = (timestamp: string) =>
	new Date(timestamp).toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

/**
 * Once all Mietverträge of a tenant have ended (ehemaliger Mieter), the documents the landlord uploaded before the
 * last Vertragsende, to look at and delete what is no longer needed (#178, DSG Art. 6 Abs. 4); null when there are none
 */
export function formerTenantDocuments<D extends Document>(
	contracts: Contract[],
	documents: D[],
	today: string
) {
	if (!contracts.length || contracts.some((c) => contractStatusOn(c.startDate, c.endDate, today) !== 'ended'))
		return null;
	const endDate = contracts.map((c) => c.endDate!.slice(0, 10)).sort().at(-1)!;
	const before = documents.filter((d) => d.type === 'upload' && swissDay(d.createdAt) < endDate);
	return before.length ? { endDate, documents: before } : null;
}
