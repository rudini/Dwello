/**
 * «Mieter anonymisieren» (#459, #332): a former tenant 10 years after the end of the year of his last event (the end
 * of his last contract, the last sent statement, the last reminder; Art. 958f Abs. 1, Art. 127 OR). Dwello then
 * removes name, contact data and all documents, the statement PDFs included; the amounts stay (Art. 6 Abs. 4 DSG;
 * product owner 2026-10-22, Fachreview 459-B)
 * TODO(fachlich prüfen, #623): «Mieter anonymisieren» and «Anonymisierter Mieter» have no glossary row yet
 */
import { eq, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, rentalContracts, tenants, utilityStatements } from '../db/schema';
import { CodedError } from './coded-error';
import { sqlToday, swissToday } from './today';

/** The first day the tenant may be anonymised; null while a contract runs or lies ahead, or once anonymised */
export async function anonymisableFrom(id: string): Promise<string | null> {
	const { rows } = await db.execute<{ latest: string | null; current: boolean; anonymised: boolean }>(sql`
		select greatest(
			(select max(end_date) from rental_contracts where tenant_id = ${id}),
			(select max(statement_date) from utility_statements
				where tenant_id = ${id} and status <> 'draft'), -- every statement that went out
			(select max((sent_at at time zone 'UTC' at time zone 'Europe/Zurich')::date) from documents
				where tenant_id = ${id} and type = 'reminder' and sent_at is not null)
		)::text as latest,
		exists (select 1 from rental_contracts where tenant_id = ${id} and (end_date is null or end_date >= ${sqlToday})) as current,
		exists (select 1 from tenants where id = ${id} and anonymised_on is not null) as anonymised`);
	const [{ latest, current, anonymised }] = rows;
	if (!latest || current || anonymised) return null;
	return `${Number(latest.slice(0, 4)) + 11}-01-01`;
}

/** Replaces the name with `name` (in the landlord's language) and removes contact data and documents */
export async function anonymiseTenant(id: string, name: { firstName: string; lastName: string }) {
	const from = await anonymisableFrom(id);
	if (!from) throw new CodedError('TENANT_NOT_FORMER', 'A tenant with a running or upcoming contract stays');
	if (from > swissToday()) throw new CodedError('TENANT_ANONYMISE_TOO_EARLY', 'The retention has not ended', { date: from });
	await db.transaction(async (tx) => {
		const removed = { email: null, phone: null, address: null, postalCode: null, city: null };
		await tx
			.update(tenants)
			.set({ ...name, ...removed, anonymisedOn: swissToday(), updatedAt: new Date() })
			.where(eq(tenants.id, id));
		await tx.delete(documents).where(eq(documents.tenantId, id));
		// a later download creates the PDF anew, with the replacement name and without the address
		await tx.update(utilityStatements).set({ pdfBlob: null, pdfGeneratedAt: null, notes: null }).where(eq(utilityStatements.tenantId, id));
		await tx.update(rentalContracts).set({ contractPdf: null, notes: null }).where(eq(rentalContracts.tenantId, id));
	});
}
