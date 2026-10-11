/**
 * The statement PDF of a real statement (real PostgreSQL): what the tenant reads and pays with
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, distributionKeys, fuelStocks, tenants, utilityStatements } from '../db/schema';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { createFuelStock } from '../services/fuel-stock.service';
import { getHeatingProfileByName } from '../services/heating-profile.service';
import { generateStatementPdf, getStatementPdf } from '../services/statement-pdf.service';
import { deleteStatement, generateStatement } from '../services/statement.service';
import { readPdf } from './helpers/pdf-text';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const company = { company_name: 'Muster Immobilien AG', company_address: 'Firmenweg 9', company_postal_code: '8001', company_city: 'Zürich', iban: 'CH4431999123000889012' } as const;
const saved: Partial<Record<keyof typeof company, string | null>> = {};
let rental: Awaited<ReturnType<typeof createRental>>;
let statementId: string;
let pdf: ReturnType<typeof readPdf>;

beforeAll(async () => {
	for (const [key, value] of Object.entries(company) as [keyof typeof company, string][]) {
		saved[key] = await getConfig(key);
		await setConfig(key, value);
	}
	// Moved in on 1 July with a small Akonto: the tenant pays the rest with the QR-bill
	rental = await createRental(crypto.randomUUID(), { startDate: '2025-07-01', monthlyAdvancePayment: '50' });
	await db.update(tenants).set({ address: 'Testgasse 5', postalCode: '8400', city: 'Winterthur' }).where(eq(tenants.id, rental.tenant));
	const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
	await insertInvoice(rental.building, { categoryId: heating.id, amount: '2400.00', description: 'Heizöl 2025' });
	await insertInvoice(rental.building);

	const [perArea] = await db.select().from(distributionKeys).where(eq(distributionKeys.name, 'Per Area (m²)'));
	const statement = await generateStatement({
		contractId: rental.contract,
		buildingId: rental.building,
		periodStart: '2025-01-01',
		periodEnd: '2025-12-31',
		heatingProfileId: (await getHeatingProfileByName('Heating Mittelland'))!.id,
		managementFeePercent: 3,
		managementFeeDistributionKeyId: perArea.id
	});
	statementId = statement.id;
	await generateStatementPdf(statementId, 'de');
	pdf = readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64'));
});

afterAll(async () => {
	await deleteStatement(statementId);
	await rental.remove();
	for (const [key, value] of Object.entries(saved) as [keyof typeof company, string | null][]) {
		if (value) await setConfig(key, value);
		else await deleteConfig(key);
	}
});

const occurrences = (text: string) => pdf.text.split(text).length - 1;

describe('PDF der Nebenkostenabrechnung', () => {
	// Fehler behoben: jede Zeile des Zahlteils landete auf einer eigenen Seite (11 Seiten)
	it('hat mit Nachzahlung zwei Seiten: Abrechnung und Zahlteil', () => {
		expect(pdf.pages).toBe(2);
	});

	// QR-Rechnung: die lesbaren Angaben entsprechen den Daten im QR-Code
	it('nennt auf Empfangsschein und Zahlteil die Adressen von Mieter und Vermieter', () => {
		expect(occurrences('Testgasse 5')).toBeGreaterThanOrEqual(3);
		expect(occurrences('8400 Winterthur')).toBeGreaterThanOrEqual(3);
		expect(occurrences('Firmenweg 9')).toBeGreaterThanOrEqual(3);
	});

	it('nennt die Mietdauer des Mieters in der Abrechnungsperiode', () => {
		expect(pdf.text).toContain('01.07.2025 – 31.12.2025');
	});

	// Juli bis Dezember im Mittelland: 0 + 0 + 1 + 10 + 13.5 + 17 = 41.5 %
	it('nennt das Heizprofil und den Anteil der Heizkosten aus den Monaten der Mietdauer', () => {
		expect(pdf.text).toContain('Heizung Mittelland');
		expect(pdf.text).toContain('41.50 %');
		expect(pdf.flowing).toContain('Anteile der Monate Ihres Mietverhältnisses: Jul 0 %, Aug 0 %, Sep 1 %, Okt 10 %, Nov 13.5 %, Dez 17 %');
	});

	// Periode Juli bis Dezember, ganz gemietet: das PDF nennt denselben Anteil, den die Abrechnung rechnet
	it('nennt bei einer Periode unter einem Jahr den Anteil an den Heizkosten der Periode', async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(rental.building, { categoryId: heating.id, amount: '600.00', invoiceDate: '2025-10-15' });
		const part = await generateStatement({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2025-07-01',
			periodEnd: '2025-12-31',
			heatingProfileId: (await getHeatingProfileByName('Heating Mittelland'))!.id,
			managementFeePercent: 3
		});
		await generateStatementPdf(part.id, 'de');
		const text = readPdf(Buffer.from((await getStatementPdf(part.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(part.id);

		expect(text).toContain('100.00 % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode');
	});

	// Verwaltungspauschale: 3 % der Nebenkosten der Liegenschaft (2400 + 1200), verteilt nach Fläche
	it('nennt die Grundlage der Verwaltungspauschale', () => {
		expect(pdf.text).toContain("3 % von CHF 3'600.00");
		expect(pdf.text).toContain('Pro Fläche (m²)');
	});

	// Eingezogen am 1. Juli: der Mieter trägt die Pauschale seiner Wohnung für 184 von 365 Tagen
	it('nennt bei einem Teil des Jahres die Mietstage, für die die Verwaltungspauschale gilt', () => {
		expect(pdf.flowing).toContain('für Ihre 184 von 365 Tagen');
	});

	// Einzige Wohnung des Gebäudes: Wohnungsanteil = Kosten der Liegenschaft; Hauswart nach Tagen 184 / 365
	it('nennt je Position den Verteilschlüssel, den Wohnungsanteil und den Zeitanteil', () => {
		expect(pdf.flowing).toContain('Verteilschlüssel');
		expect(pdf.flowing).toContain("Hauswart Pro Fläche (m²) 70.00 / 70.00 m² 1'200.00 1'200.00 184/365 Tage 604.93");
	});

	it('nummeriert die Seiten und nennt in der Kopfzeile Absender und Abrechnung', () => {
		expect(pdf.flowing).toContain('Seite 1 von 2');
		expect(pdf.flowing).toContain('Seite 2 von 2');
		expect(occurrences('Muster Immobilien AG · Firmenweg 9 · 8001 Zürich')).toBe(2);
	});

	// Der Mieter sieht zuerst, was er bezahlt, dann wie es zustande kommt
	it('zeigt die Nachzahlung vor der Kostenübersicht', () => {
		expect(pdf.flowing.indexOf('Nachzahlung')).toBeLessThan(pdf.flowing.indexOf('Kostenübersicht'));
	});

	it('nennt das Recht auf Belegeinsicht und auf die detaillierte Heizkostenabrechnung', () => {
		expect(pdf.flowing).toContain(
			'Sie oder eine bevollmächtigte Person können die Belege einsehen. Melden Sie sich dafür bei Muster Immobilien AG, Firmenweg 9, 8001 Zürich'
		);
		expect(pdf.flowing).toContain('detaillierte Abrechnung der Heiz- und Warmwasserkosten');
	});

	// SIX: gedruckt wird, was im QR-Code steht
	it('nennt im Zahlteil die Abrechnung als zusätzliche Information wie im QR-Code', () => {
		expect(pdf.flowing).toMatch(/Zusätzliche Informationen Nebenkostenabrechnung NK-[\w-]+/);
	});
});

// Heizöl im Tank: abgerechnet wird der Verbrauch, das PDF zeigt, wie er zustande kommt (Art. 5 und 8 VMWG)
describe('Tankbestand im PDF', () => {
	let tank: Awaited<ReturnType<typeof createRental>>;
	let text: string;
	let id: string;

	beforeAll(async () => {
		tank = await createRental(crypto.randomUUID(), { startDate: '2024-01-01', monthlyAdvancePayment: '200' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(tank.building, { categoryId: heating.id, amount: '1000.00', description: 'Heizöl', invoiceDate: '2025-06-15' });
		await createFuelStock(tank.building, { readingDate: '2024-12-31', amount: '600.00', categoryId: heating.id });
		await createFuelStock(tank.building, { readingDate: '2025-12-31', amount: '100.00', categoryId: heating.id });
		const statement = await generateStatement({
			contractId: tank.contract,
			buildingId: tank.building,
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31',
			managementFeePercent: 0
		});
		id = statement.id;
		await generateStatementPdf(id, 'de');
		text = readPdf(Buffer.from((await getStatementPdf(id)).pdfBlob!, 'base64')).flowing;
	});

	afterAll(async () => {
		await deleteStatement(id);
		await db.delete(fuelStocks).where(eq(fuelStocks.buildingId, tank.building));
		await tank.remove();
	});

	it('leitet die Heizkosten aus Anfangsbestand, Rechnungen und Endbestand her', () => {
		expect(text).toContain('Anfangsbestand am 31.12.2024 CHF 600.00');
		expect(text).toContain("Rechnungen «Heizung» in der Abrechnungsperiode CHF 1'000.00");
		expect(text).toContain('Endbestand am 31.12.2025 CHF 100.00');
		expect(text).toContain("Heizkosten nach Verbrauch CHF 1'500.00");
		expect(text).toContain('Über den Anfangs- und Endbestand des Heizmaterials erhalten Sie Auskunft');
	});

	// Ein später geänderter Stand ändert die Abrechnung nicht, also auch nicht ihre Herleitung im PDF
	it('zeigt die Stände, mit denen die Abrechnung erstellt wurde', async () => {
		await db.update(fuelStocks).set({ amount: '999.00' }).where(eq(fuelStocks.buildingId, tank.building));
		await generateStatementPdf(id, 'de');
		const again = readPdf(Buffer.from((await getStatementPdf(id)).pdfBlob!, 'base64')).flowing;

		expect(again).toContain('Anfangsbestand am 31.12.2024 CHF 600.00');
		expect(again).toContain('Endbestand am 31.12.2025 CHF 100.00');
	});
});

// Ohne Verteilschlüssel ist die Pauschale ein Prozentsatz der eigenen Nebenkosten
describe('Verwaltungspauschale ohne Verteilschlüssel im PDF', () => {
	let ownFee: ReturnType<typeof readPdf>;
	let id: string;

	beforeAll(async () => {
		const statement = await generateStatement({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31',
			managementFeePercent: 3
		});
		id = statement.id;
		await generateStatementPdf(id, 'de');
		ownFee = readPdf(Buffer.from((await getStatementPdf(id)).pdfBlob!, 'base64'));
	});

	afterAll(() => deleteStatement(id));

	it('nennt die eigenen Nebenkosten als Grundlage', () => {
		expect(ownFee.flowing).toMatch(/Verwaltungspauschale: 3 % der Zwischensumme von CHF [\d'.]+/);
	});
});

// Ein Entwurf wird mit dem PDF versendet: Datum und Zahlungsfrist gelten ab dem Tag, an dem das PDF entsteht
describe('PDF eines älteren Entwurfs', () => {
	it('datiert den Entwurf auf heute und gibt die volle Zahlungsfrist', async () => {
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 0 });
		await db.update(utilityStatements).set({ statementDate: '2026-01-15', paymentDeadline: '2026-02-14' }).where(eq(utilityStatements.id, statement.id));
		await generateStatementPdf(statement.id, 'de');
		const [after] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, statement.id));
		await deleteStatement(statement.id);

		const today = new Date().toLocaleDateString('sv-SE');
		expect(after.statementDate).toBe(today);
		expect(Date.parse(after.paymentDeadline!) - Date.parse(today)).toBe(30 * 86_400_000);
	});
});
