/**
 * «Abgerechnet bis» (#133): up to that day the Nebenkosten of the contract are billed outside Dwello, so Dwello bills
 * Mietstage, heating share and Akonto only from the day after (real PostgreSQL database)
 *
 * Apartment 2.01 (70 m², the building's only one) rented since 2020 with CHF 100 Akonto. Caretaker CHF 732 for 2024
 * (2.00 a day), heating CHF 1000 with a profile whose May to December carry 52 %.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, contractAdvancePayments, heatingProfiles, invoices, rentalContracts, utilityStatements } from '../db/schema';
import { daysAfter, swissToday } from '../services/today';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { generateStatementPdf, getStatementPdf } from '../services/statement-pdf.service';
import { correctStatement, generateStatement, replaceStatement, updateStatementStatus } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { readPdf } from './helpers/pdf-text';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

type LineItem = { isHeatingCost: boolean; periodShare: number; tenantShare: number };

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let heatingProfileId: string;

const billedUntil = (date: string | null) =>
	sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { billedUntil: date });

const preview = (periodStart = '2024-01-01', periodEnd = '2024-12-31') =>
	callApi('/api/v1/statements/preview', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ contractId: rental.contract, periodStart, periodEnd, heatingProfileId })
	});

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2020-01-01', monthlyAdvancePayment: '100' });
	await insertInvoice(rental.building, { amount: '732.00', invoiceDate: '2024-06-30' });
	const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
	await insertInvoice(rental.building, { categoryId: heating.id, amount: '1000.00', invoiceDate: '2024-06-30' });
	const [profile] = await db
		.insert(heatingProfiles)
		.values({
			name: `Abgerechnet bis ${token}`,
			type: 'custom',
			januaryPct: '18',
			februaryPct: '14',
			marchPct: '11',
			aprilPct: '5',
			mayPct: '2',
			junePct: '0',
			julyPct: '0',
			augustPct: '0',
			septemberPct: '2',
			octoberPct: '8',
			novemberPct: '14',
			decemberPct: '26'
		})
		.returning();
	heatingProfileId = profile.id;
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
	await db.delete(heatingProfiles).where(eq(heatingProfiles.id, heatingProfileId));
});

describe('Abgerechnet bis', () => {
	it('speichert «Abgerechnet bis» am Mietvertrag und vergisst es ohne Datum', async () => {
		expect((await billedUntil('2024-04-30')).status).toBe(200);
		expect(await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()).toMatchObject({ billedUntil: '2024-04-30' });
		expect((await billedUntil(null)).status).toBe(200);
		expect(await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()).toMatchObject({ billedUntil: null });
	});

	// #453 (#337): a statement exists only after its period ended, and a date before the Vertragsbeginn has no effect
	it('lehnt «Abgerechnet bis» nach heute ab', async () => {
		const response = await billedUntil(daysAfter(swissToday(), 1));
		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'BILLED_UNTIL_FUTURE' });
		expect((await billedUntil(swissToday())).status).toBe(200);
	});

	it('lehnt «Abgerechnet bis» vor dem Vertragsbeginn ab und nennt ihn', async () => {
		const response = await billedUntil('2019-12-31');
		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'BILLED_UNTIL_BEFORE_START', params: { date: '2020-01-01' } });
		expect((await billedUntil('2020-01-01')).status).toBe(200);
	});

	// fach review 453-1 M-1: the stored «Abgerechnet bis» against a new Vertragsbeginn
	it('lehnt einen Vertragsbeginn nach dem gespeicherten «Abgerechnet bis» ab', async () => {
		expect((await billedUntil('2020-06-30')).status).toBe(200);
		const response = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { startDate: '2020-07-01' });
		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'BILLED_UNTIL_BEFORE_START', params: { date: '2020-07-01' } });
		expect((await billedUntil(null)).status).toBe(200);
	});

	it('lehnt beim Erfassen «Abgerechnet bis» vor dem Vertragsbeginn ab', async () => {
		const [contract] = await db.select().from(rentalContracts).where(eq(rentalContracts.id, rental.contract));
		const response = await sendJson('POST', '/api/v1/contracts', {
			tenantId: contract.tenantId,
			apartmentId: contract.apartmentId,
			startDate: '2010-01-01',
			endDate: '2011-12-31',
			baseRent: '900',
			monthlyAdvancePayment: '0',
			billedUntil: '2009-12-31'
		});
		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'BILLED_UNTIL_BEFORE_START', params: { date: '2010-01-01' } });
	});

	it('behält ein gespeichertes «Abgerechnet bis» nach heute bis zum nächsten Speichern des Datums', async () => {
		await db.update(rentalContracts).set({ billedUntil: '2099-12-31' }).where(eq(rentalContracts.id, rental.contract));
		expect((await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { baseRent: '1000.00' })).status).toBe(200);
		expect(await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()).toMatchObject({ billedUntil: '2099-12-31' });
		expect((await billedUntil(null)).status).toBe(200);
	});

	it('zählt Mietstage, Heizanteil und Akonto erst ab dem Tag nach «Abgerechnet bis»', async () => {
		await billedUntil('2024-04-30');
		const statement = (await (await preview()).json()) as {
			rentalDays: number;
			rentalStart: string;
			totalAdvancePayments: number;
			lineItems: LineItem[];
		};
		// 01.05. to 31.12.2024: 245 days, 8 months of Akonto
		expect(statement).toMatchObject({ rentalDays: 245, rentalStart: '2024-05-01', totalAdvancePayments: 800 });
		expect(statement.lineItems.find((line) => !line.isHeatingCost)?.tenantShare).toBe(490);
		expect(statement.lineItems.find((line) => line.isHeatingCost)).toMatchObject({ periodShare: 0.52, tenantShare: 520 });
	});

	// code review 453-3 C-8: with a second Akonto from 01.09.2024 (#464), May to August at 100, September to December at 150
	it('zählt nach «Abgerechnet bis» jeden Akontobetrag für seine Monate', async () => {
		await billedUntil('2024-04-30');
		await db.insert(contractAdvancePayments).values({ contractId: rental.contract, validFrom: '2024-09-01', amount: '150' });
		try {
			const statement = (await (await preview()).json()) as { totalAdvancePayments: number };
			expect(statement.totalAdvancePayments).toBe(1000);
		} finally {
			await db.delete(contractAdvancePayments).where(and(eq(contractAdvancePayments.contractId, rental.contract), eq(contractAdvancePayments.validFrom, '2024-09-01')));
		}
	});

	// fach review V-14: a part month counts by its days, 16 of 31 in May
	it('zählt das Akonto eines angebrochenen Monats nach Tagen', async () => {
		await billedUntil('2024-05-15');
		const statement = (await (await preview()).json()) as { rentalStart: string; totalAdvancePayments: number };
		expect(statement).toMatchObject({ rentalStart: '2024-05-16', totalAdvancePayments: 751.61 });
	});

	it('rechnet eine Abrechnungsperiode, die bis «Abgerechnet bis» endet, nicht ab', async () => {
		await billedUntil('2024-12-31');
		const response = await preview();
		expect(response.ok).toBe(false);
		expect(await response.json()).toMatchObject({ code: 'CONTRACT_NOT_IN_PERIOD' });
	});

	// fach review V-2: a stored statement keeps its Mietstage, whether the dates or «Abgerechnet bis» change
	describe('mit einer gespeicherten Abrechnung', () => {
		let statementId: string;
		beforeAll(async () => {
			await billedUntil('2024-04-30');
			const statement = await generateStatement({
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				heatingProfileId,
				managementFeePercent: 3
			});
			statementId = statement.id;
			await updateStatementStatus(statementId, 'sent');
		});
		// a sent statement is never deleted through the service
		afterAll(async () => {
			await db.delete(utilityStatements).where(eq(utilityStatements.id, statementId));
		});

		it('nimmt eine Änderung der Vertragsdaten an, die ihre Mietstage nicht ändert', async () => {
			expect((await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { endDate: '2099-12-31' })).status).toBe(200);
			expect((await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { endDate: null })).status).toBe(200);
		});

		// #499 (persona Dr. Weber 453 P-1): the sent statement bills 2024 in Dwello; correcting it led to a dead end
		it('lehnt «Abgerechnet bis» über die versendete Abrechnung ohne Weg über das Berichtigen ab', async () => {
			const [stored] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, statementId));
			const response = await billedUntil('2024-06-30');
			expect(response.status).toBe(400);
			expect(await response.json()).toMatchObject({
				code: 'BILLED_UNTIL_BILLED',
				params: { number: stored.statementNumber, start: '2024-01-01', end: '2024-12-31', date: '2024-04-30' }
			});
			expect((await billedUntil('2023-12-31')).status).toBe(409); // earlier: it changes the billed Mietstage (#120)
		});

		// fach review 499-1 V-6b: a paid statement counts too
		it('lehnt «Abgerechnet bis» auch über die bezahlte Abrechnung ab', async () => {
			await db.update(utilityStatements).set({ status: 'paid' }).where(eq(utilityStatements.id, statementId));
			try {
				expect(await (await billedUntil('2024-06-30')).json()).toMatchObject({ code: 'BILLED_UNTIL_BILLED' });
			} finally {
				await db.update(utilityStatements).set({ status: 'sent' }).where(eq(utilityStatements.id, statementId));
			}
		});

		it('lehnt ein anderes «Abgerechnet bis» ab, das ihre Mietstage ändert, und nennt sie', async () => {
			for (const date of ['2024-03-31', null]) {
				const response = await billedUntil(date);
				expect(response.status).toBe(409);
				expect(await response.json()).toMatchObject({ statements: [{ id: statementId, status: 'sent' }] });
			}
			expect((await billedUntil('2024-04-30')).status).toBe(200);
		});

		// fach review M-1: the tenancy is the contract's, the statement bills the days after «Abgerechnet bis»
		it('nennt im PDF das Mietverhältnis und die abgerechneten Tage nach «Abgerechnet bis»', async () => {
			const iban = await getConfig('iban');
			await setConfig('iban', 'CH4431999123000889012');
			await generateStatementPdf(statementId, 'de');
			if (iban) await setConfig('iban', iban);
			else await deleteConfig('iban');
			const text = readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64')).flowing;
			// #453 (#325): what is billed already, and from when the Akonto counts
			expect(text).toContain(
				'Ihr Mietverhältnis in dieser Periode: 01.01.2024 – 31.12.2024. Ihre Nebenkosten und Akontobeiträge bis 30.04.2024 sind mit einer früheren Abrechnung abgerechnet. Diese Abrechnung umfasst 01.05.2024 – 31.12.2024 (245 Mietstage von 366 Tagen).'
			);
			expect(text).toContain('Akontobeiträge ab 01.05.2024');
		});

		// fach review 499-1 V-3: the new refusal comes before the offer to delete a draft (#141)
		it('lehnt auch mit einem Entwurf der Folgeperiode ab, ohne den Entwurf zum Löschen anzubieten', async () => {
			const draft = await generateStatement({
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2025-01-01',
				periodEnd: '2025-12-31',
				heatingProfileId,
				managementFeePercent: 3
			});
			try {
				expect(await (await billedUntil('2025-06-30')).json()).toMatchObject({ code: 'BILLED_UNTIL_BILLED' });
			} finally {
				await db.delete(utilityStatements).where(eq(utilityStatements.id, draft.id));
			}
		});

		// #499, fach review 499-1 V-1 (decided: option a): a replaced statement bills those days until its berichtigte
		// Abrechnung is sent; correcting first and entering «Abgerechnet bis» after it led to the same dead end
		it('zählt eine ersetzte Abrechnung, solange ihre berichtigte Abrechnung fehlt oder ein Entwurf ist', async () => {
			const [stored] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, statementId));
			await replaceStatement(statementId);
			expect(await (await billedUntil('2024-06-30')).json()).toMatchObject({
				code: 'BILLED_UNTIL_BILLED',
				params: { number: stored.statementNumber }
			});
			const correction = await correctStatement(statementId);
			try {
				expect(await (await billedUntil('2024-06-30')).json()).toMatchObject({
					code: 'BILLED_UNTIL_BILLED',
					params: { number: stored.statementNumber }
				});
			} finally {
				await db.delete(utilityStatements).where(eq(utilityStatements.id, correction.id));
			}
		});
	});

	// #499, fach review 499-1 V-2 (decided): with the Vertragsbeginn in the statement's period no day before it is left
	describe('mit einer versendeten Abrechnung ab dem Vertragsbeginn', () => {
		let later: Awaited<ReturnType<typeof createRental>>;
		let sent: string;
		beforeAll(async () => {
			later = await createRental(crypto.randomUUID(), { startDate: '2024-04-01', monthlyAdvancePayment: '100' });
			await insertInvoice(later.building, { amount: '732.00', invoiceDate: '2024-06-30' });
			const statement = await generateStatement({
				contractId: later.contract,
				buildingId: later.building,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				heatingProfileId,
				managementFeePercent: 3
			});
			sent = statement.id;
			await updateStatementStatus(sent, 'sent');
		});
		afterAll(async () => {
			await db.delete(utilityStatements).where(eq(utilityStatements.id, sent));
			await db.delete(invoices).where(eq(invoices.buildingId, later.building));
			await later.remove();
		});

		it('rät, das Feld leer zu lassen, statt einen Tag vor dem Vertragsbeginn zu nennen', async () => {
			const response = await sendJson('PUT', `/api/v1/contracts/${later.contract}`, { billedUntil: '2024-06-30' });
			expect(response.status).toBe(400);
			expect(await response.json()).toMatchObject({
				code: 'BILLED_UNTIL_BILLED_START',
				params: { start: '2024-01-01', end: '2024-12-31' }
			});
		});
	});
});
