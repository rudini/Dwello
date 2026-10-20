/**
 * The statement PDF of a real statement (real PostgreSQL): what the tenant reads and pays with
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, fuelStocks, tenants, utilityStatements } from '../db/schema';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createFuelStock } from '../services/fuel-stock.service';
import { createHeatingProfile, deleteHeatingProfile, getHeatingProfileByName, updateHeatingProfile } from '../services/heating-profile.service';
import { generateStatementPdf, getStatementPdf } from '../services/statement-pdf.service';
import { deleteStatement, generateStatement, updateStatementStatus } from '../services/statement.service';
import { readPdf } from './helpers/pdf-text';
import { sendJson } from './helpers/auth';
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

	const statement = await generateStatement({
		contractId: rental.contract,
		buildingId: rental.building,
		periodStart: '2025-01-01',
		periodEnd: '2025-12-31',
		heatingProfileId: (await getHeatingProfileByName('Heating Mittelland'))!.id,
		managementFeePercent: 3
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

// #464: the PDF prints the Akonto lines the statement stored, below their total
describe('Akonto im PDF', () => {
	it('nennt das Akonto als Monate mal Betrag, wie die Abrechnung es gespeichert hat', () => {
		expect(pdf.flowing).toContain('Akontobeiträge – 300.00 6 Monate × CHF 50.00 (01.07.2025 – 31.12.2025) 300.00');
	});
});

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
		expect(pdf.flowing).toContain('Anteile der Monate Ihres Mietverhältnisses: Jul 0.00 %, Aug 0.00 %, Sep 1.00 %, Okt 10.00 %, Nov 13.50 %, Dez 17.00 %');
		expect(pdf.flowing).not.toContain('Die Monate der Abrechnungsperiode'); // a whole year: its months carry 100 % (#229, F-4)
	});

	// Periode Juli bis Dezember, ganz gemietet: kein Ein- oder Auszug, die Heizkosten gehen nach Mietstagen (Regel 5, #208)
	it('nennt bei einem Mietvertrag über die ganze Periode die Mietstage statt des Heizprofils', async () => {
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

		expect(text).toContain('Heizung Pro Fläche (m²) 70.00 / 70.00 m² 600.00 600.00 184/184 Tage 600.00');
		expect(text).not.toContain('Heizprofil');
		// the chosen profile, as it was named, and why it was not applied: for the detail page (#247)
		expect(part.heatingShare).toEqual({ byDays: true, reason: 'wholePeriod', names: { name: 'Heating Mittelland', nameDE: 'Heizung Mittelland', nameFR: 'Chauffage Plateau', nameIT: 'Riscaldamento Altipiano', nameEN: 'Heating Swiss Plateau' } });
		expect(text).toContain('detaillierte Abrechnung der Heiz- und Warmwasserkosten verlangen');
	});

	// Juni bis August: 0 % im Mittelland, die Heizkosten gehen nach Mietstagen (Einzug 1. Juli: 62 von 92 Tagen, #137)
	it('nennt bei einer Periode ohne Heizanteil im Heizprofil die Mietstage und kein Heizprofil', async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(rental.building, { categoryId: heating.id, amount: '300.00', invoiceDate: '2025-07-15' });
		const summer = await generateStatement({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2025-06-01',
			periodEnd: '2025-08-31',
			heatingProfileId: (await getHeatingProfileByName('Heating Mittelland'))!.id,
			managementFeePercent: 3
		});
		await generateStatementPdf(summer.id, 'de');
		const text = readPdf(Buffer.from((await getStatementPdf(summer.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(summer.id);

		expect(text).toMatch(/Heizung Pro Fläche \(m²\) 70\.00 \/ 70\.00 m² [\d'.]+ [\d'.]+ 62\/92 Tage/);
		expect(text).not.toContain('Heizprofil');
		expect(summer.heatingShare).toEqual({ byDays: true, reason: 'noHeatingMonths', names: { name: 'Heating Mittelland', nameDE: 'Heizung Mittelland', nameFR: 'Chauffage Plateau', nameIT: 'Riscaldamento Altipiano', nameEN: 'Heating Swiss Plateau' } });
		expect(text).toContain('detaillierte Abrechnung der Heiz- und Warmwasserkosten verlangen');
	});

	// Einzige Wohnung des Gebäudes: Wohnungsanteil = Kosten der Liegenschaft; Hauswart nach Tagen 184 / 365
	it('nennt je Position den Verteilschlüssel, den Wohnungsanteil und den Zeitanteil', () => {
		expect(pdf.flowing).toContain('Verteilschlüssel');
		expect(pdf.flowing).toContain("Hauswart Pro Fläche (m²) 70.00 / 70.00 m² 1'200.00 1'200.00 184/365 Tage 604.93");
	});

	// Der Bruch gehört zum Betrag, wie er beim Erstellen berechnet wurde, auch wenn später eine Wohnung dazukommt
	it('druckt den Bruch des Verteilschlüssels wie beim Erstellen der Abrechnung', async () => {
		const added = await createApartment({ buildingId: rental.building, number: '3.01', floor: 3, area: '30', rooms: '2' });
		await generateStatementPdf(statementId, 'de');
		const again = readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64'));
		await deleteApartment(added.id);

		expect(again.flowing).toContain('70.00 / 70.00 m²');
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

// Eine Rechnung mit Leistungszeitraum: Hauswart Juli bis September in der Periode Juni bis August (62 Tage darin),
// Mietvertrag 15. Juni bis 31. Juli: 31 Mietstage im Leistungszeitraum, 47 in der Periode (#208, D-3; Regel 5)
describe('Zeitanteil einer Rechnung mit Leistungszeitraum im PDF', () => {
	let shared: Awaited<ReturnType<typeof createRental>>;
	let text: string;

	beforeAll(async () => {
		shared = await createRental(crypto.randomUUID(), { startDate: '2025-06-15', endDate: '2025-07-31', monthlyAdvancePayment: '0' });
		await insertInvoice(shared.building, { amount: '900.00', invoiceDate: '2025-10-05', servicePeriodStart: '2025-07-01', servicePeriodEnd: '2025-09-30' });
		const statement = await generateStatement({
			contractId: shared.contract,
			buildingId: shared.building,
			periodStart: '2025-06-01',
			periodEnd: '2025-08-31',
			managementFeePercent: 0
		});
		await generateStatementPdf(statement.id, 'de');
		text = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
	});

	afterAll(async () => {
		await shared.remove();
	});

	it('druckt die Mietstage im Leistungszeitraum von dessen Tagen in der Periode', () => {
		expect(text).toContain('Hauswart Pro Fläche (m²) 70.00 / 70.00 m² 606.52 606.52 31/62 Tage 303.26');
	});

	it('erklärt den Bruch einer Rechnung mit Leistungszeitraum', () => {
		expect(text).toContain('Zeitanteil: Ihre Mietstage in der Abrechnungsperiode. Bei einer Rechnung mit Leistungszeitraum zählen Ihre Mietstage in diesem Zeitraum.');
		// no position with invoice lines: neither their sentence nor the rounding (#241, C-2)
		expect(text).not.toContain('Hat eine Abrechnungsposition');
		expect(text).not.toContain('Der Prozentwert ist gerundet');
	});

	// Zwei Hauswart-Rechnungen über verschiedene Tage: der Anteil ist nach Beträgen gewichtet, kein Bruch von Tagen (#226)
	it('druckt den Anteil in Prozent, wenn die Rechnungen einer Position verschiedene Tage abrechnen', async () => {
		await insertInvoice(shared.building, { amount: '600.00', invoiceDate: '2025-06-30', servicePeriodStart: '2025-06-01', servicePeriodEnd: '2025-06-30' });
		const statement = await generateStatement({
			contractId: shared.contract,
			buildingId: shared.building,
			periodStart: '2025-06-01',
			periodEnd: '2025-08-31',
			managementFeePercent: 0
		});
		await generateStatementPdf(statement.id, 'de');
		const mixed = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);

		expect(mixed).toMatch(/Hauswart Pro Fläche \(m²\) 70\.00 \/ 70\.00 m² 1'206\.52 1'206\.52 51\.66 % /);
		expect(mixed).toContain('Hat eine Abrechnungsposition Rechnungen über verschiedene Tage, steht die Berechnung darunter.');
		expect(mixed).toContain('Leistungszeitraum 01.06.2025 – 30.06.2025: CHF 600.00, Ihre Mietstage 16 von 30 Tagen');
		// #241 V-1: der Leistungszeitraum reicht über die Periode hinaus; die Zeile nennt ihn und den Betrag des Belegs
		expect(mixed).toContain("Leistungszeitraum 01.07.2025 – 30.09.2025 (Rechnung CHF 900.00), davon 01.07.2025 – 31.08.2025: CHF 606.52, Ihre Mietstage 31 von 62 Tagen");
		expect(mixed).toContain("Ihr Anteil: 1'206.52 × (600.00 × 16/30 + 606.52 × 31/62) / 1'206.52 = 623.26");
	});

	// Beträge im Verhältnis der Tage: der gewichtete Anteil ist zufällig genau Mietstage / Tage der Periode, 139/365;
	// gedruckt wird trotzdem der Anteil mit den Rechnungen, nicht «139/365 Tage» (#226, C-5 von #208)
	it('druckt bei Rechnungen über verschiedene Tage die Rechnungen, auch wenn der Anteil den Mietstagen entspricht', async () => {
		const august = await createRental(crypto.randomUUID(), { startDate: '2025-08-15', monthlyAdvancePayment: '0' });
		await insertInvoice(august.building, { amount: '1810.00', invoiceDate: '2025-07-05', servicePeriodStart: '2025-01-01', servicePeriodEnd: '2025-06-30' });
		await insertInvoice(august.building, { amount: '1840.00', invoiceDate: '2025-12-20', servicePeriodStart: '2025-07-01', servicePeriodEnd: '2025-12-31' });
		const statement = await generateStatement({ contractId: august.contract, buildingId: august.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 0 });
		await generateStatementPdf(statement.id, 'de');
		const text = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await august.remove();

		expect(text).toContain("Ihr Anteil: 3'650.00 × (1'810.00 × 0/181 + 1'840.00 × 139/184) / 3'650.00 = 1'390.00");
		expect(text).not.toMatch(/Hauswart .* 139\/365 Tage/);
	});

	// Eine Rechnung ohne Leistungszeitraum rechnet die ganze Periode ab, ihre Zeile nennt deren Tage (#226, V-12)
	it('nennt eine Rechnung ohne Leistungszeitraum unter der Position mit den Tagen der Periode', async () => {
		const mixed = await createRental(crypto.randomUUID(), { startDate: '2025-08-15', monthlyAdvancePayment: '0' });
		await insertInvoice(mixed.building, { amount: '365.00', invoiceDate: '2025-05-05' });
		await insertInvoice(mixed.building, { amount: '900.00', invoiceDate: '2025-10-05', servicePeriodStart: '2025-07-01', servicePeriodEnd: '2025-09-30' });
		const statement = await generateStatement({ contractId: mixed.contract, buildingId: mixed.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 0 });
		await generateStatementPdf(statement.id, 'de');
		const text = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await mixed.remove();

		// #241 V-1: eine Rechnung ohne Leistungszeitraum heisst nicht «Leistungszeitraum»
		expect(text).toContain('Ohne Leistungszeitraum: CHF 365.00, Ihre Mietstage 139 von 365 Tagen der Abrechnungsperiode');
		expect(text).toContain("Ihr Anteil: 1'265.00 × (365.00 × 139/365 + 900.00 × 47/92) / 1'265.00 = 598.78");
	});

	// Daten und Betrag ordnen eine Zeile keinem Beleg zu: eine Rechnung ohne Leistungszeitraum (ihre Daten sind die der
	// Periode) und zwei über denselben Leistungszeitraum und Betrag nennen ihre Rechnung, die eindeutige nicht (#236)
	it('nennt die Rechnung, wenn Daten und Betrag ihre Zeile keinem Beleg zuordnen', async () => {
		const twins = await createRental(crypto.randomUUID(), { startDate: '2025-08-15', monthlyAdvancePayment: '0' });
		await insertInvoice(twins.building, { amount: '765.00', invoiceDate: '2025-09-30', description: 'Hauswartung Q3' });
		await insertInvoice(twins.building, { amount: '600.00', invoiceDate: '2025-07-05', servicePeriodStart: '2025-04-01', servicePeriodEnd: '2025-06-30', description: 'Hauswartung Q2' });
		await insertInvoice(twins.building, { amount: '900.00', invoiceDate: '2025-10-05', servicePeriodStart: '2025-07-01', servicePeriodEnd: '2025-09-30', description: 'Gartenpflege' });
		await insertInvoice(twins.building, { amount: '900.00', invoiceDate: '2025-10-06', servicePeriodStart: '2025-07-01', servicePeriodEnd: '2025-09-30', description: 'Treppenhausreinigung' });
		const statement = await generateStatement({ contractId: twins.contract, buildingId: twins.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 0 });
		await generateStatementPdf(statement.id, 'de');
		const text = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await twins.remove();

		expect(text).toContain('Ohne Leistungszeitraum: CHF 765.00, Ihre Mietstage 139 von 365 Tagen der Abrechnungsperiode (Rechnung «Hauswartung Q3»)');
		expect(text).toContain('Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 900.00, Ihre Mietstage 47 von 92 Tagen (Rechnung «Gartenpflege»)');
		expect(text).toContain('Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 900.00, Ihre Mietstage 47 von 92 Tagen (Rechnung «Treppenhausreinigung»)');
		expect(text).not.toContain('Hauswartung Q2');
	});

	// Eine Gutschrift hebt die Rechnung auf: die Position hat keinen Anteil, den die Rechnungen ergeben könnten (#226, V-6)
	it('druckt keine Rechnungen unter einer Position, deren Rechnungen zusammen null ergeben', async () => {
		const credit = await createRental(crypto.randomUUID(), { startDate: '2025-08-15', monthlyAdvancePayment: '0' });
		await insertInvoice(credit.building, { amount: '900.00', invoiceDate: '2025-10-05', servicePeriodStart: '2025-07-01', servicePeriodEnd: '2025-09-30' });
		await insertInvoice(credit.building, { amount: '-900.00', invoiceDate: '2025-07-05', servicePeriodStart: '2025-04-01', servicePeriodEnd: '2025-06-30' });
		const statement = await generateStatement({ contractId: credit.contract, buildingId: credit.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 0 });
		await generateStatementPdf(statement.id, 'de');
		const text = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await credit.remove();

		expect(text).toContain('Hauswart');
		expect(text).not.toContain('47/92 Tage');
	});

	// Mietvertrag über die ganze Periode: der Mieter trägt alle Tage jeder Rechnung, der Anteil ist 92/92 (Regel 5)
	it('druckt bei einem Mietvertrag über die ganze Periode auch eine Position über verschiedene Tage in Tagen', async () => {
		const whole = await createRental(crypto.randomUUID(), { startDate: '2025-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(whole.building, { amount: '900.00', invoiceDate: '2025-10-05', servicePeriodStart: '2025-07-01', servicePeriodEnd: '2025-09-30' });
		await insertInvoice(whole.building, { amount: '600.00', invoiceDate: '2025-06-30', servicePeriodStart: '2025-06-01', servicePeriodEnd: '2025-06-30' });
		const statement = await generateStatement({
			contractId: whole.contract,
			buildingId: whole.building,
			periodStart: '2025-06-01',
			periodEnd: '2025-08-31',
			managementFeePercent: 0
		});
		await generateStatementPdf(statement.id, 'de');
		const text = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await whole.remove();

		expect(text).toContain("Hauswart Pro Fläche (m²) 70.00 / 70.00 m² 1'206.52 1'206.52 92/92 Tage 1'206.52");
		expect(text).not.toContain('Leistungszeitraum 01.06.2025'); // no invoice lines: he bears every day of each (V-12)
	});
});

// Ein eigenes Heizprofil wird nach dem Erstellen der Abrechnung geändert: Einzug am 1. Juli, Juli bis Dezember
// 0 + 0 + 0 + 10 + 20 + 20 = 50 % beim Erstellen, nach der Änderung wären es 40 % (#209)
describe('Heizanteil, mit dem die Abrechnung erstellt wurde', () => {
	const shares = (pct: number[]) =>
		Object.fromEntries(['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].map((month, i) => [`${month}Pct`, String(pct[i])])) as unknown as Omit<Parameters<typeof createHeatingProfile>[0], 'name'>;
	let moved: Awaited<ReturnType<typeof createRental>>;
	let profileId: string;
	let text: string;

	beforeAll(async () => {
		moved = await createRental(crypto.randomUUID(), { startDate: '2025-07-01', monthlyAdvancePayment: '0' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(moved.building, { categoryId: heating.id, amount: '1000.00', description: 'Heizöl 2025' });
		profileId = (await createHeatingProfile({ name: `Eigenes ${crypto.randomUUID()}`, type: 'custom', ...shares([10, 10, 10, 10, 10, 0, 0, 0, 0, 10, 20, 20]) })).id;
		const statement = await generateStatement({
			contractId: moved.contract,
			buildingId: moved.building,
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31',
			heatingProfileId: profileId,
			managementFeePercent: 0
		});
		await updateHeatingProfile(profileId, shares([20, 10, 10, 10, 10, 0, 0, 0, 0, 30, 5, 5]));
		await generateStatementPdf(statement.id, 'de');
		text = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
	});

	afterAll(async () => {
		await moved.remove();
		await deleteHeatingProfile(profileId);
	});

	it('druckt den Anteil und die Monate, mit denen die Abrechnung gerechnet ist', () => {
		expect(text).toContain('Heizung Pro Fläche (m²) 70.00 / 70.00 m² 1\'000.00 1\'000.00 50.00 % 500.00');
		expect(text).toContain('50.00 % der Heizkosten');
		expect(text).toContain('Okt 10.00 %, Nov 20.00 %, Dez 20.00 %');
	});

	// Periode Januar bis Juni, Einzug 1. März: März bis Juni 10 + 10 + 10 + 0 = 30 % von Januar bis Juni 10 + 10 + 10 + 10
	// + 10 + 0 = 50 %, also 60 % der Heizkosten der Periode; das PDF nennt die Monate beider Summen und die Teilung (#229,
	// F-6; #232, F-7)
	it('nennt bei einer Periode unter einem Jahr die Monate der Periode und die Teilung', async () => {
		const march = await createRental(crypto.randomUUID(), { startDate: '2025-03-01', monthlyAdvancePayment: '0' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(march.building, { categoryId: heating.id, amount: '1000.00', description: 'Heizöl 2025', invoiceDate: '2025-04-30' });
		const own = (await createHeatingProfile({ name: `Halbjahr ${crypto.randomUUID()}`, type: 'custom', ...shares([10, 10, 10, 10, 10, 0, 0, 0, 0, 10, 20, 20]) })).id;
		const statement = await generateStatement({
			contractId: march.contract,
			buildingId: march.building,
			periodStart: '2025-01-01',
			periodEnd: '2025-06-30',
			heatingProfileId: own,
			managementFeePercent: 0
		});
		await generateStatementPdf(statement.id, 'de');
		const half = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		// stored under #229: the months of the period were not stored, the PDF keeps the sums without the division
		const stored = statement.heatingShare as Extract<NonNullable<typeof statement.heatingShare>, { byDays: false }>;
		await db.update(utilityStatements).set({ heatingShare: { ...stored, periodMonths: undefined } }).where(eq(utilityStatements.id, statement.id));
		await generateStatementPdf(statement.id, 'de');
		const earlier = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await march.remove();
		await deleteHeatingProfile(own);

		expect(half).toContain('60.00 % der Heizkosten');
		expect(half).toContain(
			'Mär 10.00 %, Apr 10.00 %, Mai 10.00 %, Jun 0.00 %; zusammen 30.00 %. Anteile der Monate der Abrechnungsperiode im Heizprofil: Jan 10.00 %, Feb 10.00 %, Mär 10.00 %, Apr 10.00 %, Mai 10.00 %, Jun 0.00 %; zusammen 50.00 %. Anteil nach Heizprofil: 30.00 % / 50.00 % = 60.00 %.'
		);
		expect(earlier).toContain('zusammen 30.00 %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen 50.00 %.');
	});

	// #71, Fachreview 2 M-4: die einzige Heizrechnung liegt in Monaten mit 0 % (Juni bis August) und wird nach Tagen
	// geteilt, 920 × 62/92 = 620.00; der Satz zum Heizprofil nennt den Anteil des Laufs, Juli bis Dezember im geänderten
	// Profil 0 + 0 + 0 + 30 + 5 + 5 = 40 %, nicht den der Position
	it('nennt bei einer Heizposition nach Tagen im Leistungszeitraum den Anteil nach Heizprofil des Laufs', async () => {
		const july = await createRental(crypto.randomUUID(), { startDate: '2025-07-01', monthlyAdvancePayment: '0' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(july.building, { categoryId: heating.id, amount: '920.00', description: 'Fernwärme Sommer', invoiceDate: '2025-09-30', servicePeriodStart: '2025-06-01', servicePeriodEnd: '2025-08-31' });
		const statement = await generateStatement({ contractId: july.contract, buildingId: july.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', heatingProfileId: profileId, managementFeePercent: 0 });
		await generateStatementPdf(statement.id, 'de');
		const summer = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await july.remove();

		expect(summer).toContain('Leistungszeitraum 01.06.2025 – 31.08.2025: CHF 920.00, Ihre Mietstage 62 von 92 Tagen');
		expect(summer).toContain('40.00 % für eine Rechnung ohne Leistungszeitraum');
		expect(summer).not.toContain('67.39 % der Heizkosten');
		expect(summer).toContain('Haben diese Monate im Heizprofil zusammen 0 %, zählen stattdessen Ihre Mietstage darin.');
	});

	// Code-Review 2, C-1: eine Heizposition mit eigenen Tagen, die zusammen null ergibt, gibt den Satz zum Heizprofil
	// nicht vor; er nennt den Anteil des Laufs, Mai bis Dezember im geänderten Profil 10 + 0 + 0 + 0 + 0 + 30 + 5 + 5 = 50 %
	it('nennt bei einer Heizposition, die zusammen null ergibt, den Anteil nach Heizprofil des Laufs', async () => {
		const may = await createRental(crypto.randomUUID(), { startDate: '2025-05-01', monthlyAdvancePayment: '0' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(may.building, { categoryId: heating.id, amount: '1000.00', description: 'Fernwärme Q1', invoiceDate: '2025-03-31', servicePeriodStart: '2025-01-01', servicePeriodEnd: '2025-03-31' });
		await insertInvoice(may.building, { categoryId: heating.id, amount: '-1000.00', description: 'Gutschrift', invoiceDate: '2025-04-30' });
		const statement = await generateStatement({ contractId: may.contract, buildingId: may.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', heatingProfileId: profileId, managementFeePercent: 0 });
		await generateStatementPdf(statement.id, 'de');
		const zero = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await may.remove();

		expect(zero).toContain('50.00 % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode');
	});

	// Februar 13.9 × 7/28 = 3.475 % genau auf der Hälfte, gerundet 3.48 % (#232): Erläuterung und Position zeigen denselben
	// Wert (#229, Rundung)
	it('nennt in der Erläuterung denselben Anteil wie in der Position', async () => {
		const feb = await createRental(crypto.randomUUID(), { startDate: '2025-02-22', monthlyAdvancePayment: '0' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(feb.building, { categoryId: heating.id, amount: '1000.00', description: 'Heizöl 2025' });
		const own = (await createHeatingProfile({ name: `Halb ${crypto.randomUUID()}`, type: 'custom', ...shares([18.6, 13.9, 11.2, 6.1, 2.3, 0, 0, 0.08, 1.8, 7.7, 13.4, 24.92]) })).id;
		const statement = await generateStatement({
			contractId: feb.contract,
			buildingId: feb.building,
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31',
			heatingProfileId: own,
			managementFeePercent: 0
		});
		await generateStatementPdf(statement.id, 'de');
		const rounded = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await feb.remove();
		await deleteHeatingProfile(own);

		expect(rounded).toContain("1'000.00 1'000.00 70.98 %");
		expect(rounded).toContain('70.98 % der Heizkosten');
	});

	// Gespeichert wie gedruckt, auf zwei Stellen: «Heizung + Warmwasser» Juli bis Dezember 3.7 + 3.6 + 3.7 + 9.5 + 10.7 + 13
	// = 44.2 %, als Summe von Kommazahlen 44.199999… (Datenprüfung #209, D-1)
	it('speichert den Anteil nach dem Heizprofil auf zwei Stellen', async () => {
		const statement = await generateStatement({
			contractId: moved.contract,
			buildingId: moved.building,
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31',
			heatingProfileId: (await getHeatingProfileByName('Heating + Hot Water'))!.id,
			managementFeePercent: 0
		});
		await deleteStatement(statement.id);

		expect(statement.heatingShare).toMatchObject({ byDays: false, percent: 44.2 });
	});

	// Vor #209 erstellt: kein Anteil gespeichert; die Abrechnung wird nicht neu gerechnet, das PDF nennt kein Heizprofil
	// mit Anteil und Monaten (#232, C-5), erklärt aber den Prozentwert der Heizposition (Fachprüfung w4-2, M-5)
	it('nennt bei einer vor #209 erstellten Abrechnung keinen Anteil nach Heizprofil', async () => {
		const statement = await generateStatement({
			contractId: moved.contract,
			buildingId: moved.building,
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31',
			heatingProfileId: profileId,
			managementFeePercent: 0
		});
		await db.update(utilityStatements).set({ heatingShare: null }).where(eq(utilityStatements.id, statement.id));
		await generateStatementPdf(statement.id, 'de');
		const older = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);

		expect(older).toContain("Heizung Pro Fläche (m²) 70.00 / 70.00 m² 1'000.00 1'000.00 40.00 % 400.00");
		expect(older).not.toContain('Heizkosten nach Heizprofil');
		// the position's percent is still the profile's, not the days rented: the explanation says so (Fachprüfung M-5)
		expect(older).toContain('Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.');
	});

	// Unter #209 gespeichert: Anteil auf zwei Stellen gerundet (70.97 %), ohne Summe der Periode; die Erläuterung nimmt den
	// Anteil der Position (70.98 %) (#229, Fachprüfung V-1)
	it('nennt bei einer unter #209 gespeicherten Abrechnung den Anteil der Position', async () => {
		const feb = await createRental(crypto.randomUUID(), { startDate: '2025-02-22', monthlyAdvancePayment: '0' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(feb.building, { categoryId: heating.id, amount: '1000.00', description: 'Heizöl 2025' });
		const own = (await createHeatingProfile({ name: `Halb ${crypto.randomUUID()}`, type: 'custom', ...shares([18.6, 13.9, 11.2, 6.1, 2.3, 0, 0, 0.08, 1.8, 7.7, 13.4, 24.92]) })).id;
		const statement = await generateStatement({ contractId: feb.contract, buildingId: feb.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', heatingProfileId: own, managementFeePercent: 0 });
		const stored = statement.heatingShare as Extract<NonNullable<typeof statement.heatingShare>, { byDays: false }>;
		await db.update(utilityStatements).set({ heatingShare: { ...stored, percent: 70.97, periodPercent: undefined } }).where(eq(utilityStatements.id, statement.id));
		await generateStatementPdf(statement.id, 'de');
		const earlier = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await feb.remove();
		await deleteHeatingProfile(own);

		expect(earlier).toContain('70.98 % der Heizkosten');
	});

	// F-1: ein eigenes Heizprofil lässt sich umbenennen und löschen, die Abrechnung nennt es weiter
	it('nennt das Heizprofil auch nach dem Umbenennen und Löschen, wie es beim Erstellen hiess', async () => {
		const name = `Eigenes ${crypto.randomUUID()}`;
		const own = (await createHeatingProfile({ name, type: 'custom', ...shares([10, 10, 10, 10, 10, 0, 0, 0, 0, 10, 20, 20]) })).id;
		const statement = await generateStatement({
			contractId: moved.contract,
			buildingId: moved.building,
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31',
			heatingProfileId: own,
			managementFeePercent: 0
		});
		await updateHeatingProfile(own, { name: `Umbenannt ${crypto.randomUUID()}` });
		await deleteHeatingProfile(own);
		await generateStatementPdf(statement.id, 'de');
		const after = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);

		expect(after).toContain(name);
		expect(after).toContain('50.00 % der Heizkosten');
	});

	// F-2: im Sommer tragen die Monate der Periode 0 %, geteilt wird nach Tagen; das bleibt so, wenn das Profil danach dem
	// Juli einen Anteil gibt (Einzug 1. Juli, Juni bis August: 62/92 Tage)
	it('bleibt bei den Mietstagen, wenn das Heizprofil später den Monaten der Periode einen Anteil gibt', async () => {
		const own = (await createHeatingProfile({ name: `Sommer ${crypto.randomUUID()}`, type: 'custom', ...shares([20, 20, 20, 10, 10, 0, 0, 0, 0, 0, 10, 10]) })).id;
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(moved.building, { categoryId: heating.id, amount: '300.00', invoiceDate: '2025-07-15' });
		const statement = await generateStatement({
			contractId: moved.contract,
			buildingId: moved.building,
			periodStart: '2025-06-01',
			periodEnd: '2025-08-31',
			heatingProfileId: own,
			managementFeePercent: 0
		});
		await updateHeatingProfile(own, shares([20, 20, 15, 10, 10, 0, 5, 0, 0, 0, 10, 10]));
		await generateStatementPdf(statement.id, 'de');
		const after = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await deleteHeatingProfile(own);

		expect(after).toContain('62/92 Tage');
		expect(after).not.toContain('Heizprofil');
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

	// #239 (Code-Review C-1 von #241): eine Heizposition nach Tagen mit einer Lieferung über einen Leistungszeitraum;
	// die Veränderung des Tankbestands ist keine Rechnung und heisst so, nicht «Leistungszeitraum»
	it('nennt die Veränderung des Tankbestands unter einer Heizposition nach Tagen als solche', async () => {
		const august = await createRental(crypto.randomUUID(), { startDate: '2025-08-15', monthlyAdvancePayment: '0' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(august.building, { categoryId: heating.id, amount: '900.00', description: 'Heizöl', invoiceDate: '2025-10-05', servicePeriodStart: '2025-07-01', servicePeriodEnd: '2025-09-30' });
		await createFuelStock(august.building, { readingDate: '2024-12-31', amount: '600.00', categoryId: heating.id });
		await createFuelStock(august.building, { readingDate: '2025-12-31', amount: '100.00', categoryId: heating.id });
		const statement = await generateStatement({ contractId: august.contract, buildingId: august.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 0 });
		await generateStatementPdf(statement.id, 'de');
		const stock = readPdf(Buffer.from((await getStatementPdf(statement.id)).pdfBlob!, 'base64')).flowing;
		await deleteStatement(statement.id);
		await db.delete(fuelStocks).where(eq(fuelStocks.buildingId, august.building));
		await august.remove();

		expect(stock).toContain('Veränderung Tankbestand 01.01.2025 – 31.12.2025: CHF 500.00, Ihre Mietstage 139 von 365 Tagen');
		expect(stock).not.toContain('Leistungszeitraum 01.01.2025 – 31.12.2025');
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

// Die Pauschale ist ein Prozentsatz der eigenen Nebenkosten
describe('Verwaltungspauschale im PDF', () => {
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

		const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
		expect(after.statementDate).toBe(today);
		expect(Date.parse(after.paymentDeadline!) - Date.parse(today)).toBe(30 * 86_400_000);
	});
});

// Im März angesehen, im Mai versendet: sonst ginge die Abrechnung mit abgelaufener Frist hinaus und wäre sofort überfällig
describe('Versand einer früher erstellten Abrechnung', () => {
	const sentWith = async (dates: { statementDate: string; paymentDeadline: string }) => {
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 0 });
		await generateStatementPdf(statement.id, 'de');
		await db.update(utilityStatements).set(dates).where(eq(utilityStatements.id, statement.id));
		await updateStatementStatus(statement.id, 'sent');
		const [after] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, statement.id));
		await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, statement.id));
		await deleteStatement(statement.id);
		return after;
	};
	const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

	it('datiert sie auf den Versandtag, gibt die volle Frist und verwirft das alte PDF', async () => {
		const after = await sentWith({ statementDate: '2026-03-02', paymentDeadline: '2026-04-01' });

		expect(after.statementDate).toBe(today);
		expect(Date.parse(after.paymentDeadline!) - Date.parse(today)).toBe(30 * 86_400_000);
		expect(after.pdfBlob).toBeNull();
	});

	// Eine vereinbarte längere Frist, z. B. für eine Ratenzahlung, bleibt
	it('behält eine spätere Zahlungsfrist', async () => {
		expect((await sentWith({ statementDate: '2026-03-02', paymentDeadline: '2099-06-30' })).paymentDeadline).toBe('2099-06-30');
	});
});

// Was man herunterlädt, ist das, was der Mieter erhält: ein Entwurf von heute, nach Versand und Zahlung neu erstellt
describe('PDF zum Herunterladen', () => {
	const pdfOf = async (id: string) => readPdf(Buffer.from((await getStatementPdf(id)).pdfBlob!, 'base64')).flowing;
	const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
	const swiss = (iso: string) => iso.split('-').reverse().join('.');

	it('erstellt das PDF eines Entwurfs von einem früheren Tag neu, mit dem heutigen Datum', async () => {
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 0 });
		await generateStatementPdf(statement.id, 'de');
		await db.update(utilityStatements).set({ statementDate: '2026-03-02', paymentDeadline: '2026-04-01' }).where(eq(utilityStatements.id, statement.id));
		const text = await pdfOf(statement.id);
		const [after] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, statement.id));
		await deleteStatement(statement.id);

		expect(text).toContain(`Abrechnungsdatum ${swiss(today)}`);
		expect(after.statementDate).toBe(today); // made again, not the PDF of 2 March
	});

	// Das zugestellte PDF bleibt nach der Zahlung, wie der Mieter es erhalten hat (Archiv)
	it('behält nach der Zahlung das PDF, wie es versendet wurde', async () => {
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 0 });
		await generateStatementPdf(statement.id, 'de');
		await updateStatementStatus(statement.id, 'sent');
		const sent = await pdfOf(statement.id);
		await updateStatementStatus(statement.id, 'paid', { paidDate: today });
		const text = await pdfOf(statement.id);
		await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, statement.id));
		await deleteStatement(statement.id);

		expect(text).toBe(sent);
		expect(text).toContain('Zahlteil');
	});

	it('erstellt ein fehlendes PDF beim Herunterladen, eine bezahlte Abrechnung ohne Zahlteil', async () => {
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 0 });
		await updateStatementStatus(statement.id, 'sent');
		await updateStatementStatus(statement.id, 'paid', { paidDate: today });
		const text = await pdfOf(statement.id);
		await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, statement.id));
		await deleteStatement(statement.id);

		expect(text).toContain(`Bezahlt am ${swiss(today)}`);
		expect(text).not.toContain('Zahlteil');
	});
});

// Persona Anna (W3c P-1): the PDF of a draft goes to the Korrespondenzadresse as it is now, also one made before the
// landlord entered the new address after a move-out (A-5, #114)
describe('PDF eines Entwurfs nach einer Änderung bei Mieter oder Einstellungen', () => {
	it('nennt die neue Adresse, auch wenn das PDF vorher erstellt wurde', async () => {
		await generateStatementPdf(statementId, 'de');
		await sendJson('PUT', `/api/v1/tenants/${rental.tenant}`, { address: 'Neugasse 7', postalCode: '8401', city: 'Winterthur' });

		const text = readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64')).text;
		expect(text).toContain('Neugasse 7\n8401 Winterthur');
		expect(text).not.toContain('Testgasse 5');
	});

	// Persona Helga (W3c P-2): a new account in the settings reaches the draft's payment part
	it('nennt die IBAN, die jetzt in den Einstellungen steht', async () => {
		await generateStatementPdf(statementId, 'de');
		await setConfig('iban', 'CH9300762011623852957'); // SIX sample IBAN

		const text = readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64')).text;
		expect(text).toContain('CH93 0076 2011 6238 5295 7');
	});

	// #351: switched to French on the day its German PDF was made, the draft's next PDF is French
	it('folgt der geänderten Sprache des Mieters, auch am selben Tag', async () => {
		await generateStatementPdf(statementId);
		await sendJson('PUT', `/api/v1/tenants/${rental.tenant}`, { language: 'fr' });

		const text = readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64')).text;
		await sendJson('PUT', `/api/v1/tenants/${rental.tenant}`, { language: 'de' });
		expect(text).toContain('Décompte des charges');
	});

	// #351: the PDF as sent follows the same rule
	it('versendet das PDF in der Sprache des Mieters beim Versand', async () => {
		await generateStatementPdf(statementId);
		await sendJson('PUT', `/api/v1/tenants/${rental.tenant}`, { language: 'fr' });
		await sendJson('PUT', `/api/v1/statements/${statementId}/status`, { status: 'sent' });

		const text = readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64')).text;
		await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, statementId));
		await sendJson('PUT', `/api/v1/tenants/${rental.tenant}`, { language: 'de' });
		expect(text).toContain('Décompte des charges');
	});

	// Review C-9: sent on the day its PDF was made, the PDF as sent still has the address of today
	it('versendet das PDF mit der Adresse beim Versand', async () => {
		await generateStatementPdf(statementId, 'de');
		await sendJson('PUT', `/api/v1/tenants/${rental.tenant}`, { address: 'Endgasse 9' });
		await updateStatementStatus(statementId, 'sent');

		const text = readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64')).text;
		await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, statementId)); // removable again (review C-17)
		expect(text).toContain('Endgasse 9');
	});

	// Closing review C-1: the PDF as sent is made when sending, so later changes do not reach it and it stays to download
	it('erstellt das PDF beim Versand', async () => {
		await sendJson('PUT', `/api/v1/tenants/${rental.tenant}`, { address: 'Versandweg 2' });
		await sendJson('PUT', `/api/v1/statements/${statementId}/status`, { status: 'sent' });
		const [sent] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, statementId));
		await sendJson('PUT', `/api/v1/tenants/${rental.tenant}`, { address: 'Spaeterweg 3' });

		const text = readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64')).text;
		await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, statementId));
		expect(sent.pdfGeneratedAt).not.toBeNull();
		expect(text).toContain('Versandweg 2');
	});

	// Closing review C-3: a Saldo of 0 is settled when sent; its PDF as sent is made then too
	it('erstellt das PDF auch beim Versand einer Abrechnung mit Saldo 0', async () => {
		const [{ balance }] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, statementId));
		await db.update(utilityStatements).set({ balance: '0.00' }).where(eq(utilityStatements.id, statementId));
		await sendJson('PUT', `/api/v1/statements/${statementId}/status`, { status: 'sent' });
		const [settled] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, statementId));
		await db.update(utilityStatements).set({ status: 'draft', balance, paidDate: null, paidAmount: null, paymentRecordedAt: null }).where(eq(utilityStatements.id, statementId));

		expect(settled.status).toBe('settled'); // «Erledigt» (#448)
		expect(settled.pdfGeneratedAt).not.toBeNull();
	});
});
