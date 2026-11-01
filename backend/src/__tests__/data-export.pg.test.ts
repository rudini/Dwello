/**
 * The export of all data under «Einstellungen» (#496; domain review docs/reviews/496-fachreview-1.md), against the
 * real database. The database holds the records of other tests too: the tests look for their own by name
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { auditLog, documents, invoiceDocuments, invoices, rentalContracts, utilityStatements } from '../db/schema';
import { createRental } from './helpers/rental';
import { callApi, sendJson } from './helpers/auth';
import { idOf, insertInvoice } from './helpers/records';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { swissToday } from '../services/today';

type Cell = string | null;
type Export = {
	fileName: string;
	dataFile: string;
	data: {
		tenants: { id: string; lastName: string }[];
		buildings: {
			name: string;
			apartments: { number: string; contracts: { tenantId: string; file: string | null }[] }[];
			invoices: { billingEntityName: string; documents: { fileName: string; file: string }[] }[];
		}[];
		auditLog: { id: string; action: string }[];
	};
	logTable: string;
	tables: { path: string; rows: Cell[][] }[];
	files: { path: string; content: string }[];
};

const exportIn = async (language = 'de') =>
	(await (await callApi(`/api/v1/export?language=${language}`)).json()) as Export;
/** The rows of a table as objects by the names of its header */
const rowsOf = (exported: Export, path: string) => {
	const [head, ...rows] = exported.tables.find((table) => table.path === path)?.rows ?? [[]];
	return rows.map((row) => Object.fromEntries(head.map((column, index) => [column, row[index]])));
};

const pdf = (text: string) => Buffer.from(`%PDF-1.4 ${text}\n%%EOF\n`).toString('base64');
const generate = async (periodStart: string, periodEnd: string) =>
	idOf(await sendJson('POST', '/api/v1/statements/generate', { contractId: rental.contract, buildingId: rental.building, periodStart, periodEnd }));

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
// two tenants of the same name (V-7), each with a document
let namesake: string;
let statements: { carried: string; open: string };

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', monthlyAdvancePayment: '100' });
	await db.update(rentalContracts).set({ contractPdf: pdf('contract') }).where(eq(rentalContracts.id, rental.contract));
	await insertInvoice(rental.building, { billingEntityName: `Muster AG ${token}`, invoiceDate: '2024-03-31' });
	await insertInvoice(rental.building, { billingEntityName: `Muster AG ${token}`, invoiceDate: '2025-03-31' });
	const [invoice] = await db.select().from(invoices).where(eq(invoices.buildingId, rental.building));
	await db.insert(invoiceDocuments).values({ invoiceId: invoice.id, fileName: 'meier-q1.pdf', mimeType: 'application/pdf', content: pdf('beleg') });

	// example A of the domain review V-1: a refund with a Nachzahlung carried over, and example E: part payments
	const carried = await generate('2024-01-01', '2024-12-31');
	const open = await generate('2025-01-01', '2025-12-31');
	await db.update(utilityStatements).set({ status: 'paid', balance: '4.00' }).where(eq(utilityStatements.id, carried));
	await db
		.update(utilityStatements)
		.set({
			status: 'sent',
			carriedFromId: carried,
			totalCosts: '1030.00',
			totalAdvancePayments: '900.00',
			priorPayments: '100.00',
			balance: '34.00',
			paymentDeadline: '2026-05-31',
			payments: [{ date: '2026-05-15', amount: '20.00' }, { date: '2026-06-10', amount: '10.00' }],
			paidAmount: '30.00'
		})
		.where(eq(utilityStatements.id, open));
	statements = { carried, open };

	namesake = (await createTenant({ firstName: 'Anna', lastName: `Keller ${token}` })).id;
	for (const tenant of [rental.tenant, namesake])
		await sendJson('POST', `/api/v1/tenants/${tenant}/documents`, { title: 'Übergabeprotokoll', fileName: 'scan.pdf', content: pdf('upload') });
});

afterAll(async () => {
	for (const tenant of [rental.tenant, namesake]) await db.delete(documents).where(eq(documents.tenantId, tenant));
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await deleteTenant(namesake);
	await rental.remove();
});

describe('Alle Daten exportieren', () => {
	it('nennt den Export nach dem Tag und gibt das Gebäude mit Wohnung und Mietvertrag in Datendatei und Tabelle heraus', async () => {
		const exported = await exportIn();

		expect(exported.fileName).toBe(`Dwello-Daten-${swissToday()}.zip`);
		expect(exported.dataFile).toBe('daten.json');
		const building = exported.data.buildings.find((b) => b.name === `Ahornhof ${token}`);
		expect(building?.apartments.map((a) => [a.number, ...a.contracts.map((c) => c.tenantId)])).toEqual([['2.01', rental.tenant]]);
		expect(rowsOf(exported, 'tabellen/gebäude.csv').find((row) => row.Name === `Ahornhof ${token}`)).toMatchObject({
			ID: rental.building,
			Ort: 'Winterthur',
			Kanton: 'ZH'
		});
	});

	it('nennt Datei, Datendatei, Ordner und Spalten in der Sprache der Oberfläche', async () => {
		const exported = await exportIn('fr');

		expect(exported.fileName).toBe(`Dwello-Données-${swissToday()}.zip`);
		expect(exported.dataFile).toBe('données.json');
		expect(rowsOf(exported, 'tableaux/immeubles.csv').find((row) => row.Nom === `Ahornhof ${token}`)).toMatchObject({ Localité: 'Winterthur' });
	});

	it('gibt die Anleitung und je eine Tabelle für jede Art von Daten heraus', async () => {
		const exported = await exportIn();

		expect(exported.files[0].path).toBe('README.txt');
		expect(Buffer.from(exported.files[0].content, 'base64').toString()).toContain('Offener Betrag: Saldo minus die Teilzahlungen in zahlungen.csv.');
		expect(exported.tables.map((table) => table.path)).toEqual(
			['gebäude', 'wohnungen', 'mieter', 'mietverträge', 'akonto', 'vereinbarte-nebenkosten', 'rechnungen', 'belege', 'tankbestände', 'abrechnungen', 'abrechnungspositionen', 'zahlungen', 'dokumente', 'kategorien', 'verteilschlüssel', 'heizprofile', 'protokoll', 'einstellungen'].map((name) => `tabellen/${name}.csv`)
		);
	});

	it('legt den Beleg mit Datum und Rechnungssteller in den Ordner der Belege und nennt ihn bei der Rechnung', async () => {
		const exported = await exportIn();
		const path = `belege/2024-03-31 Muster AG ${token} meier-q1.pdf`;

		const building = exported.data.buildings.find((b) => b.name === `Ahornhof ${token}`)!;
		expect(building.invoices.flatMap((invoice) => invoice.documents)).toEqual([expect.objectContaining({ fileName: 'meier-q1.pdf', file: path })]);
		expect(rowsOf(exported, 'tabellen/belege.csv').filter((row) => row.Rechnungssteller === `Muster AG ${token}`)).toEqual([
			expect.objectContaining({ Dateiname: 'meier-q1.pdf', 'Datei im Export': path })
		]);
		expect(Buffer.from(exported.files.find((file) => file.path === path)!.content, 'base64').toString()).toContain('beleg');
	});

	it('lässt den Saldo aus Kostenanteil, Übertrag, Akontobeiträgen und Bereits bezahlt nachrechnen (Fachreview V-1)', async () => {
		const row = rowsOf(await exportIn(), 'tabellen/abrechnungen.csv').find((r) => r.ID === statements.open)!;

		expect(row).toMatchObject({
			'Kostenanteil (mit Verwaltungspauschale)': '1030.00',
			Übertrag: '4.00',
			Akontobeiträge: '900.00',
			'Bereits bezahlt': '100.00',
			Saldo: '34.00'
		});
		const [costs, carried, advances, prior] = ['Kostenanteil (mit Verwaltungspauschale)', 'Übertrag', 'Akontobeiträge', 'Bereits bezahlt'].map((c) => Number(row[c]));
		expect((costs + carried - advances - prior).toFixed(2)).toBe(row.Saldo);
	});

	it('nennt eine Abrechnung nach der Zahlungsfrist überfällig, mit dem offenen Betrag und jeder Teilzahlung (Fachreview V-1)', async () => {
		const exported = await exportIn();

		expect(rowsOf(exported, 'tabellen/abrechnungen.csv').find((r) => r.ID === statements.open)).toMatchObject({
			Status: 'Überfällig',
			'Bezahlter Betrag': '30.00',
			'Offener Betrag': '4.00'
		});
		expect(rowsOf(exported, 'tabellen/zahlungen.csv').filter((r) => r['Abrechnung-ID'] === statements.open)).toEqual([
			expect.objectContaining({ Datum: '2026-05-15', Betrag: '20.00' }),
			expect.objectContaining({ Datum: '2026-06-10', Betrag: '10.00' })
		]);
	});

	it('legt die Dokumente zweier Mieter gleichen Namens in zwei Ordner, mit dem PDF des Mietvertrags (Fachreview V-3, V-7)', async () => {
		const exported = await exportIn();
		const folder = `dokumente/Keller ${token} Anna`;
		const paths = exported.files.map((file) => file.path).filter((path) => path.includes(token));

		expect(paths).toEqual(
			expect.arrayContaining([
				`${folder}/2024-01-01 Mietvertrag Wohnung 2.01.pdf`,
				`${folder}/${swissToday()} Übergabeprotokoll.pdf`,
				`${folder} (2)/${swissToday()} Übergabeprotokoll.pdf`
			])
		);
		const contract = exported.data.buildings.find((b) => b.name === `Ahornhof ${token}`)!.apartments[0].contracts[0];
		expect(contract.file).toBe(`${folder}/2024-01-01 Mietvertrag Wohnung 2.01.pdf`);
	});

	it('gibt das Protokoll heraus; den Text des Eintrags setzt das BFF in der Sprache der Oberfläche ein', async () => {
		const [entry] = await db.insert(auditLog).values({ action: 'statement_corrected', details: { number: `NK-${token}` } }).returning();
		try {
			const exported = await exportIn();

			expect(exported.logTable).toBe('tabellen/protokoll.csv');
			expect(exported.data.auditLog).toContainEqual(expect.objectContaining({ id: entry.id, action: 'statement_corrected' }));
			expect(rowsOf(exported, 'tabellen/protokoll.csv').find((row) => row.ID === entry.id)).toMatchObject({
				Eintrag: null,
				Art: 'statement_corrected',
				'Angaben (JSON)': JSON.stringify({ number: `NK-${token}` })
			});
		} finally {
			await db.delete(auditLog).where(eq(auditLog.id, entry.id));
		}
	});

	it('gibt die Einstellungen mit den Namen des Formulars heraus', async () => {
		const settings = rowsOf(await exportIn(), 'tabellen/einstellungen.csv').map((row) => row.Einstellung);

		expect(settings).toEqual(expect.arrayContaining(['Firmenname', 'IBAN', 'Zahlungsfrist (Tage)']));
	});
});
