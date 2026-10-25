/**
 * The overview's tasks about contracts (#788): a notice without a next tenant (A-4), an agreed end the tenant may have
 * stayed past (A-6), a former tenant's uploads to check (#178); decided in the backend by the Swiss day
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, rentalContracts, tenants, utilityStatements } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createDocument } from '../services/document.service';
import { createContract } from '../services/contract.service';
import { createTenant } from '../services/tenant.service';
import { daysAfter, swissToday } from '../services/today';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const rentals: Awaited<ReturnType<typeof createRental>>[] = [];

async function contractWith(endDate: string, flags = { terminated: true, movedOut: false }) {
	const rental = await createRental(crypto.randomUUID(), { startDate: '2020-04-01', endDate, monthlyAdvancePayment: '100' });
	await db.update(rentalContracts).set(flags).where(eq(rentalContracts.id, rental.contract));
	rentals.push(rental);
	return rental;
}
type Task = { id?: string; tenantId?: string; tenantName?: string; buildingId?: string; building?: string; periods?: { start: string }[] };
const tasks = async () =>
	((await (await callApi('/api/v1/dashboard')).json()) as { contractTasks: Record<string, Task[]> }).contractTasks;
const ids = (list: Task[]) => list.map((t) => t.id ?? t.tenantId);
let number = 0;
const draft = (of: Awaited<ReturnType<typeof createRental>>, periodStart: string) =>
	db.insert(utilityStatements).values({
		tenantId: of.tenant,
		apartmentId: of.apartment,
		contractId: of.contract,
		statementNumber: `NK-${crypto.randomUUID()}-${++number}`,
		periodStart,
		periodEnd: `${periodStart.slice(0, 4)}-12-31`,
		statementDate: '2021-03-01',
		rentalDays: 365,
		rentalStart: periodStart,
		rentalEnd: `${periodStart.slice(0, 4)}-12-31`,
		totalCosts: '1200.00',
		totalAdvancePayments: '1000.00',
		balance: '200.00'
	});

afterAll(async () => {
	for (const rental of rentals) {
		await db.delete(documents).where(eq(documents.tenantId, rental.tenant));
		await db.delete(utilityStatements).where(eq(utilityStatements.tenantId, rental.tenant));
		await rental.remove();
	}
});

describe('Aufgaben der Übersicht zu Mietverträgen', () => {
	// A-4.1, review K-6: a next tenant is still to find, also after the end
	it('nennt eine Kündigung ohne späteren Mietvertrag der Wohnung', async () => {
		const { contract } = await contractWith('2099-03-31');
		const agreed = await contractWith('2099-03-31', { terminated: false, movedOut: false });

		const { noticedContracts } = await tasks();
		expect(noticedContracts).toContainEqual(expect.objectContaining({ id: contract, endDate: '2099-03-31' }));
		expect(ids(noticedContracts)).not.toContain(agreed.contract);
	});

	it('nennt keine Kündigung, nach der ein Nachmieter erfasst ist', async () => {
		const { contract, apartment } = await contractWith('2099-03-31');
		const next = await createTenant({ firstName: 'Nach', lastName: crypto.randomUUID() });
		const successor = await createContract({ apartmentId: apartment, tenantId: next.id, baseRent: '950', monthlyAdvancePayment: '100', startDate: '2099-04-01' });
		try {
			expect(ids((await tasks()).noticedContracts)).not.toContain(contract);
		} finally {
			await db.delete(rentalContracts).where(eq(rentalContracts.id, successor.id));
			await db.delete(tenants).where(eq(tenants.id, next.id));
		}
	});

	// review p4a C-1, K-6: the notice stays a task after its end; only a later contract of the same apartment counts
	it('nennt eine Kündigung auch nach dem Vertragsende und trotz eines späteren Mietvertrags in einer anderen Wohnung', async () => {
		const ended = await contractWith('2025-03-31');
		const elsewhere = await contractWith('2099-03-31');
		const other = await createRental(crypto.randomUUID(), { startDate: '2099-04-01', monthlyAdvancePayment: '0' });
		rentals.push(other);

		const listed = ids((await tasks()).noticedContracts);
		expect(listed).toContain(ended.contract);
		expect(listed).toContain(elsewhere.contract);
	});

	// A-6: an agreed end passed, the tenant may have stayed; as the contract page asks it
	it('nennt einen abgelaufenen befristeten Mietvertrag ohne Auszug', async () => {
		const expired = await contractWith('2025-12-31', { terminated: false, movedOut: false });
		const movedOut = await contractWith('2025-12-31', { terminated: false, movedOut: true });

		const { expiredContracts } = await tasks();
		expect(expiredContracts).toContainEqual(expect.objectContaining({ id: expired.contract, endDate: '2025-12-31' }));
		expect(ids(expiredContracts)).not.toContain(movedOut.contract);
	});

	// #178: a former tenant's uploads from before the last Vertragsende, until «Als geprüft markieren» (#459)
	it('nennt ehemalige Mieter mit Dokumenten von vor dem Vertragsende, bis sie geprüft sind', async () => {
		const unchecked = await contractWith('2025-03-31');
		const checked = await contractWith('2025-03-31');
		await db.update(rentalContracts).set({ documentsCheckedOn: '2025-05-01' }).where(eq(rentalContracts.id, checked.contract));
		for (const { tenant } of [unchecked, checked])
			await createDocument({ tenantId: tenant, type: 'upload', title: 'Ausweis', fileName: 'a.pdf', content: 'JVBERi0=', createdAt: new Date('2024-06-10T09:00:00.000Z') });

		const { formerTenants } = await tasks();
		expect(formerTenants).toContainEqual(expect.objectContaining({ tenantId: unchecked.tenant, endDate: '2025-03-31', count: 1 }));
		expect(ids(formerTenants)).not.toContain(checked.tenant);
	});

	// A-5 (#114): a draft would go to the apartment the moved-out tenant left; once per tenant, whatever its periods
	it('nennt Mieter, deren Entwürfe an die Adresse der verlassenen Wohnung gingen, einmal', async () => {
		const movedOut = await contractWith('2021-02-28');
		const elsewhere = await contractWith('2021-02-28');
		await db.update(tenants).set({ address: 'Testweg 1', postalCode: '8400' }).where(eq(tenants.id, movedOut.tenant));
		await db.update(tenants).set({ address: 'Neuweg 5', postalCode: '8000' }).where(eq(tenants.id, elsewhere.tenant));
		await draft(movedOut, '2019-01-01');
		await draft(movedOut, '2020-01-01');
		await draft(elsewhere, '2020-01-01');

		const listed = (await tasks()).oldAddresses.filter((t) => [movedOut.tenant, elsewhere.tenant].includes(t.tenantId!));
		const [{ tenantName }] = await db.select({ tenantName: tenants.lastName }).from(tenants).where(eq(tenants.id, movedOut.tenant));
		expect(listed).toEqual([{ tenantId: movedOut.tenant, tenantName: `Anna ${tenantName}` }]);
	});

	// #211: per building the ended Abrechnungsperioden without a statement, each once, the latest first, with the
	// building's id for the link to its invoices (#454)
	it('nennt je Gebäude die fehlenden Abrechnungsperioden einmal, die neueste zuerst', async () => {
		const first = await contractWith('2099-03-31', { terminated: false, movedOut: false });
		const parking = await createApartment({ buildingId: first.building, number: 'P1', floor: 0, area: '12', rooms: '1' });
		const second = await createContract({ apartmentId: parking.id, tenantId: first.tenant, baseRent: '100', monthlyAdvancePayment: '0', startDate: '2024-01-01' });
		// review p4b C-1: the later contract, read first, has its newest period billed, so the earlier adds a newer one last
		await draft({ ...first, apartment: parking.id, contract: second.id }, '2025-01-01');
		try {
			const building = (await tasks()).missingStatements.find((b) => b.buildingId === first.building)!;
			const starts = building.periods!.map((p) => p.start);
			expect(building.building).toStartWith('Ahornhof ');
			expect(new Set(starts).size).toBe(starts.length);
			expect(starts).toEqual([...starts].sort().reverse());
			expect(starts.at(-1)!.slice(0, 4)).toBe('2020');
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.contractId, second.id));
			await db.delete(rentalContracts).where(eq(rentalContracts.id, second.id));
			await deleteApartment(parking.id);
		}
	});

	it('nennt die Gebäude mit fehlenden Abrechnungen nach ihrem Namen', async () => {
		const token = crypto.randomUUID();
		const later = await createRental(`${token} Birke`, { startDate: '2020-04-01', monthlyAdvancePayment: '0' });
		const earlier = await createRental(`${token} Ahorn`, { startDate: '2020-04-01', monthlyAdvancePayment: '0' });
		rentals.push(later, earlier);

		const named = (await tasks()).missingStatements.map((b) => b.buildingId).filter((id) => [later.building, earlier.building].includes(id!));
		expect(named).toEqual([earlier.building, later.building]);
	});
});

// #815: the overview's deadlines, decided in the backend by the Swiss day
describe('Fristen der Übersicht aus dem Backend', () => {
	type Deadline = { id: string; kind: string; name: string; date: string; days: number };
	const deadlines = async () =>
		((await (await callApi('/api/v1/dashboard')).json()) as { deadlines: Deadline[] }).deadlines;

	it('nennt ein nahes Vertragsende und eine abgelaufene Zahlungsfrist mit den Tagen ab heute, eine Kündigung nicht', async () => {
		const ending = await contractWith(daysAfter(swissToday(), 10), { terminated: false, movedOut: false });
		const noticed = await contractWith(daysAfter(swissToday(), 10));
		const owing = await contractWith('2099-03-31', { terminated: false, movedOut: false });
		await draft(owing, '2024-01-01');
		await db
			.update(utilityStatements)
			.set({ status: 'sent', paymentDeadline: daysAfter(swissToday(), -3) })
			.where(eq(utilityStatements.contractId, owing.contract));

		const all = await deadlines();
		expect(all.find((d) => d.id === ending.contract)).toMatchObject({ kind: 'Vertragsende', days: 10 });
		expect(all.find((d) => d.id === noticed.contract)).toBeUndefined();
		// #605: an open statement is read once, overdue and sent together
		expect(all.filter((d) => d.kind === 'Zahlungsfrist' && d.date === daysAfter(swissToday(), -3))).toEqual([
			expect.objectContaining({ days: -3 })
		]);
	});

	// review K-6: a contract given notice with a next tenant has no task, so it keeps its deadline
	it('nennt das Vertragsende einer Kündigung mit späterem Mietvertrag der Wohnung', async () => {
		const end = daysAfter(swissToday(), 20);
		const noticed = await contractWith(end);
		const successor = await createContract({ apartmentId: noticed.apartment, tenantId: noticed.tenant, baseRent: '900', monthlyAdvancePayment: '100', startDate: daysAfter(end, 1) });
		try {
			expect((await deadlines()).find((d) => d.id === noticed.contract)).toMatchObject({ kind: 'Vertragsende', days: 20 });
		} finally {
			await db.delete(rentalContracts).where(eq(rentalContracts.id, successor.id)); // review i815d C-2
		}
	});
});
