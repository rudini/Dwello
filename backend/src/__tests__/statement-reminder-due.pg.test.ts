/**
 * Which sent statements need a Mahnung now (#788): after the Zahlungsfrist and the Mahnfrist (#64), the next one after
 * the last Mahnung's Zahlungsfrist (#107), none while a Mahnung waits to be posted (#449); a Rückerstattung is due at
 * once (Fachreview V-1). Decided in the backend by the Swiss day
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, utilityStatements, type StoredStatementStatus } from '../db/schema';
import { deleteConfig, setConfig } from '../services/config.service';
import { daysAfter, swissToday } from '../services/today';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const rental = await createRental(crypto.randomUUID(), { startDate: '2020-01-01', monthlyAdvancePayment: '100' });
const today = swissToday();
const ago = (days: number) => daysAfter(today, -days);
let number = 0;

async function sent(paymentDeadline: string, balance = '120.00', status: StoredStatementStatus = 'sent') {
	const [created] = await db
		.insert(utilityStatements)
		.values({
			tenantId: rental.tenant,
			apartmentId: rental.apartment,
			contractId: rental.contract,
			statementNumber: `NK-due-${Date.now()}-${++number}`,
			periodStart: `20${10 + number}-01-01`,
			periodEnd: `20${10 + number}-12-31`,
			statementDate: '2025-03-01',
			rentalDays: 365,
			rentalStart: `20${10 + number}-01-01`,
			rentalEnd: `20${10 + number}-12-31`,
			totalCosts: '1200.00',
			totalAdvancePayments: '1000.00',
			balance,
			status,
			paymentDeadline
		})
		.returning({ id: utilityStatements.id });
	return created.id;
}
const reminder = (statementId: string, paymentDeadline: string, status: 'sent' | 'to_send' = 'sent') =>
	db.insert(documents).values({ tenantId: rental.tenant, statementId, type: 'reminder', reminderLevel: 1, title: 'Zahlungserinnerung', fileName: 'z.pdf', content: 'JVBERi0=', channel: 'letter', status, paymentDeadline });
const due = async (id: string) => {
	const { data } = (await (await callApi('/api/v1/statements?status=open&limit=1000')).json()) as {
		data: { id: string; reminderDue: boolean | null }[];
	};
	return data.find((s) => s.id === id)?.reminderDue;
};

afterAll(async () => {
	await deleteConfig('reminder_after_days');
	await db.delete(documents).where(eq(documents.tenantId, rental.tenant));
	await db.delete(utilityStatements).where(eq(utilityStatements.tenantId, rental.tenant));
	await rental.remove();
});

describe('Mahnung fällig', () => {
	// #64: «Überfällig» from the day after the Zahlungsfrist, a Mahnung only after the Mahnfrist of 14 days
	it('schlägt eine Mahnung erst nach der Mahnfrist vor', async () => {
		const within = await sent(ago(14));
		const after = await sent(ago(15));
		const running = await sent(today);

		expect(await due(within)).toBe(false);
		expect(await due(after)).toBe(true);
		expect(await due(running)).toBeNull(); // the Zahlungsfrist runs
	});

	it('nimmt die eingestellte Mahnfrist', async () => {
		const id = await sent(ago(8));
		await setConfig('reminder_after_days', '7');
		try {
			expect(await due(id)).toBe(true);
		} finally {
			await deleteConfig('reminder_after_days');
		}
	});

	// Fachreview V-1: a Rückerstattung is never gemahnt, the landlord owes it from the day after the Zahlungsfrist
	it('nennt eine überfällige Rückerstattung ohne Mahnfrist', async () => {
		const refund = await sent(ago(1), '-80.00');
		const running = await sent(today, '-80.00');

		expect(await due(refund)).toBe(true);
		expect(await due(running)).toBeNull(); // the Zahlungsfrist runs
	});

	// #107: while the last Mahnung's Zahlungsfrist runs, no next one
	it('schlägt die nächste Mahnung erst nach der Zahlungsfrist der letzten vor', async () => {
		const running = await sent(ago(40));
		await reminder(running, today);
		const passed = await sent(ago(40));
		await reminder(passed, ago(1));

		expect(await due(running)).toBe(false);
		expect(await due(passed)).toBe(true);
	});

	// #449: the last Mahnung still «Zu versenden» holds the next one, also after its Zahlungsfrist
	it('schlägt keine Mahnung vor, solange die letzte noch zu versenden ist', async () => {
		const id = await sent(ago(40));
		await reminder(id, ago(10), 'to_send');

		expect(await due(id)).toBe(false);
	});

	it('nennt keine bezahlte Abrechnung', async () => {
		const id = await sent(ago(40), '120.00', 'paid');
		const { data } = (await (await callApi('/api/v1/statements?limit=1000')).json()) as {
			data: { id: string; reminderDue: boolean }[];
		};

		expect(data.find((s) => s.id === id)?.reminderDue).toBeNull();
	});
});
