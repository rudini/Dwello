/**
 * Documents of a former tenant (#178, #788): once all Mietverträge of a tenant have ended, the uploads from before the
 * last Vertragsende, to look at and delete what is no longer needed (DSG Art. 6 Abs. 4); decided in the backend
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { and, eq, ne } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, rentalContracts } from '../db/schema';
import { createContract } from '../services/contract.service';
import { createDocument } from '../services/document.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { swissToday } from '../services/today';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const rentals: Awaited<ReturnType<typeof createRental>>[] = [];

// a tenant whose contract ended by notice (a fixed-term contract needs «Mieter ist ausgezogen», A-6)
async function tenantWith(startDate: string, endDate?: string, flags = { terminated: Boolean(endDate), movedOut: false }) {
	const rental = await createRental(crypto.randomUUID(), { startDate, endDate, monthlyAdvancePayment: '100' });
	await db.update(rentalContracts).set(flags).where(eq(rentalContracts.id, rental.contract));
	rentals.push(rental);
	return rental;
}
const former = async (tenant: string) =>
	((await (await callApi(`/api/v1/tenants/${tenant}/former-documents`)).json()) as { formerDocuments: unknown })
		.formerDocuments;
const uploadedAt = async (tenantId: string, createdAt: string, type = 'upload') =>
	(
		await createDocument({
			tenantId,
			type,
			title: 'Betreibungsauszug',
			fileName: 'betreibung.pdf',
			content: 'JVBERi0=',
			createdAt: new Date(createdAt)
		})
	).id;

afterAll(async () => {
	for (const rental of rentals) {
		await db.delete(documents).where(eq(documents.tenantId, rental.tenant));
		const other = and(eq(rentalContracts.tenantId, rental.tenant), ne(rentalContracts.id, rental.contract));
		await db.delete(rentalContracts).where(other);
		await rental.remove();
	}
});

describe('Dokumente eines ehemaligen Mieters', () => {
	it('nennt die Dokumente, die vor dem Ende des letzten Mietvertrags hochgeladen wurden', async () => {
		const { tenant, contract } = await tenantWith('2024-04-01', '2025-03-31');
		const id = await uploadedAt(tenant, '2024-06-10T09:00:00.000Z');

		expect(await former(tenant)).toEqual({ endDate: '2025-03-31', documentIds: [id], contractId: contract, checkedOn: null });
	});

	it('nennt keine Mahnungen, nur hochgeladene Dokumente', async () => {
		const { tenant } = await tenantWith('2024-04-01', '2025-03-31');
		await uploadedAt(tenant, '2024-06-10T09:00:00.000Z', 'reminder');

		expect(await former(tenant)).toBeNull();
	});

	it('nennt kein Dokument vom Tag des Vertragsendes oder später, etwa das Rückgabeprotokoll', async () => {
		const { tenant } = await tenantWith('2024-04-01', '2025-03-31');
		await uploadedAt(tenant, '2025-03-31T08:00:00.000Z');
		await uploadedAt(tenant, '2025-04-03T08:00:00.000Z');

		expect(await former(tenant)).toBeNull();
	});

	it('nimmt den Tag des Hochladens in der Schweiz, nicht in UTC', async () => {
		const { tenant } = await tenantWith('2024-04-01', '2025-03-31');
		// 30.3. 23:30 UTC is 31.3. 01:30 in Zurich, the day of the end
		await uploadedAt(tenant, '2025-03-30T23:30:00.000Z');

		expect(await former(tenant)).toBeNull();
	});

	it('nennt nichts, solange ein Mietvertrag läuft, auch einer, der heute endet', async () => {
		const endsToday = await tenantWith('2024-04-01', swissToday());
		const ongoing = await tenantWith('2024-04-01');
		const future = await tenantWith('2099-04-01');
		for (const { tenant } of [endsToday, ongoing, future]) {
			await uploadedAt(tenant, '2024-06-10T09:00:00.000Z');
			expect(await former(tenant)).toBeNull();
		}
	});

	it('nennt nichts bei einem Mieter ohne Mietvertrag', async () => {
		const tenant = await createTenant({ firstName: 'Ohne', lastName: crypto.randomUUID() });
		await uploadedAt(tenant.id, '2024-06-10T09:00:00.000Z');

		expect(await former(tenant.id)).toBeNull();
		await db.delete(documents).where(eq(documents.tenantId, tenant.id));
		await deleteTenant(tenant.id);
	});

	// #459: «Als geprüft markieren» belongs to the last contract; an earlier contract's check does not count (V-2)
	it('misst am Ende des letzten von mehreren Mietverträgen und nennt dessen Prüfung', async () => {
		const { tenant, apartment } = await tenantWith('2020-04-01', '2022-03-31');
		await db.update(rentalContracts).set({ documentsCheckedOn: '2022-05-01' }).where(eq(rentalContracts.tenantId, tenant));
		const last = await createContract({ apartmentId: apartment, tenantId: tenant, baseRent: '950', monthlyAdvancePayment: '100', startDate: '2024-01-01', endDate: '2025-03-31' });
		await db.update(rentalContracts).set({ terminated: true }).where(eq(rentalContracts.id, last.id));
		const id = await uploadedAt(tenant, '2023-05-01T09:00:00.000Z');

		expect(await former(tenant)).toEqual({ endDate: '2025-03-31', documentIds: [id], contractId: last.id, checkedOn: null });
		await db.update(rentalContracts).set({ documentsCheckedOn: '2025-05-01' }).where(eq(rentalContracts.id, last.id));
		expect(await former(tenant)).toMatchObject({ contractId: last.id, checkedOn: '2025-05-01' });
	});

	// A-6: after the agreed end of a fixed-term contract the tenant may have stayed; deleting cannot be undone
	it('nennt nichts, solange offen ist, ob der Mieter nach einem befristeten Mietvertrag geblieben ist', async () => {
		const stayed = await tenantWith('2024-04-01', '2025-03-31', { terminated: false, movedOut: false });
		const left = await tenantWith('2024-04-01', '2025-03-31', { terminated: false, movedOut: true });
		await uploadedAt(stayed.tenant, '2024-06-10T09:00:00.000Z');
		const id = await uploadedAt(left.tenant, '2024-06-10T09:00:00.000Z');

		expect(await former(stayed.tenant)).toBeNull();
		expect(await former(left.tenant)).toMatchObject({ documentIds: [id] });
	});

	// A-6: a later contract for the apartment shows that the tenant moved out after the fixed term
	it('nennt die Dokumente, wenn nach dem befristeten Mietvertrag ein anderer Mieter eingezogen ist', async () => {
		const fixedTerm = await tenantWith('2024-04-01', '2025-03-31', { terminated: false, movedOut: false });
		const elsewhere = await tenantWith('2025-04-01');
		const id = await uploadedAt(fixedTerm.tenant, '2024-06-10T09:00:00.000Z');
		const successor = await createContract({ apartmentId: fixedTerm.apartment, tenantId: elsewhere.tenant, baseRent: '950', monthlyAdvancePayment: '100', startDate: '2025-04-01' });

		expect(await former(fixedTerm.tenant)).toMatchObject({ documentIds: [id] });
		await db.delete(rentalContracts).where(eq(rentalContracts.id, successor.id));
		expect(await former(fixedTerm.tenant)).toBeNull();
	});
});
