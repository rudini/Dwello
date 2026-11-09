import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, rentalContracts, utilityStatements } from '../db/schema';

// #748: where each kind of file lives, read only for the tenant it belongs to
const sources = {
	document: (tenantId: string, id: string) =>
		db.select({ content: documents.content }).from(documents).where(and(eq(documents.id, id), eq(documents.tenantId, tenantId))),
	contract: (tenantId: string, id: string) =>
		db.select({ content: rentalContracts.contractPdf }).from(rentalContracts).where(and(eq(rentalContracts.id, id), eq(rentalContracts.tenantId, tenantId))),
	statement: (tenantId: string, id: string) =>
		db.select({ content: utilityStatements.pdfBlob }).from(utilityStatements).where(and(eq(utilityStatements.id, id), eq(utilityStatements.tenantId, tenantId)))
};

/** One file of the tenant's export by its source («document/<id>» …); null when there is none of the tenant's */
export async function exportFile(tenantId: string, kind: keyof typeof sources, id: string) {
	const [row] = await sources[kind](tenantId, id);
	return row?.content ? Buffer.from(row.content, 'base64') : null;
}
