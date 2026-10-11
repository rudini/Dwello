/**
 * Statement PDF
 * Renders a statement with its QR-bill and stores the PDF with the statement
 */

import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, distributionKeys, rentalContracts, utilityStatements } from '../db/schema';
import { getHeatingProfile } from './heating-profile.service';
import { roundToRappen } from './pdf-format';
import { handleMidYearMoves } from './prorating.service';
import { getTypedConfig } from './config.service';
import { generateStatementPDFBase64, type StatementPDFData, type Language } from './pdf.service';
import { isQRIBAN, statementQRReference, type QRBillConfig } from './qr-bill.service';
import { listApartments } from './apartment.service';
import { getStatement, type StatementWithDetails } from './statement.service';

// Creditor of the QR-bill from the company configuration; null without IBAN
async function qrBillConfig(): Promise<QRBillConfig | null> {
	const companyName = await getTypedConfig('company_name');
	const companyAddress = await getTypedConfig('company_address');
	const companyPostalCode = await getTypedConfig('company_postal_code');
	const companyCity = await getTypedConfig('company_city');
	const iban = await getTypedConfig('iban');
	if (!iban) return null;

	return {
		iban,
		companyName: companyName || 'Dwello Property Management',
		address: companyAddress || '',
		postalCode: companyPostalCode || '8000',
		city: companyCity || 'Zürich'
	};
}

// Name and postal address as stored; a statement without tenant prints no recipient
const tenantOf = (tenant: StatementWithDetails['tenant']) => tenant ?? { firstName: '', lastName: '' };

const apartmentOf = (apartment: StatementWithDetails['apartment']) => ({
	number: apartment?.number || '',
	floor: apartment?.floor || 0,
	area: apartment?.area || '0'
});

const buildingOf = (building: StatementWithDetails['building']) => ({
	name: building?.name || '',
	address: building?.address || '',
	place: [building?.postalCode, building?.city].filter(Boolean).join(' ')
});

type Names = { name: string; nameDE: string | null; nameFR: string | null; nameIT: string | null; nameEN: string | null; isHeatingCost?: boolean };

// A category, key or profile in the PDF's language; Romansh and missing translations fall back to German
const localName = (names: Names, language: Language) =>
	({ fr: names.nameFR, it: names.nameIT, en: names.nameEN })[language as 'fr' | 'it' | 'en'] || names.nameDE || names.name;

/** What the generation run used, as the PDF names it: the tenant's dates, the heating profile and the fee's key */
export interface RunDetails {
	rentalStart: string;
	rentalEnd: string;
	heating?: StatementPDFData['heating'];
	fuel?: StatementPDFData['fuel'];
	managementFeeKey?: string;
}

type LineNames = { categoryNames: Map<string, Names>; keyNames: Map<string, Names>; keyShares: Map<string, string> };

const amountOf = (value: string | null) => (value == null ? null : parseFloat(value));

// a mixed key (70 % area, 30 % units): the apartment's share as a percentage of the building's costs
const percentOf = (part: number | null, total: number) => (part == null || !total ? undefined : `${((part / total) * 100).toFixed(2)} %`);

const nameIn = (map: Map<string, Names>, id: string | null, language: Language) => {
	const names = id ? map.get(id) : undefined;
	return names && localName(names, language);
};

// One position as the PDF prints it: names in the language, the key with the apartment's part, the shares
function lineItemOf(item: StatementWithDetails['lineItems'][number], statement: StatementWithDetails, names: LineNames, language: Language) {
	const totalAmount = parseFloat(item.totalAmount);
	const apartmentShare = amountOf(item.apartmentShare);
	const heating = !!(item.categoryId && names.categoryNames.get(item.categoryId)?.isHeatingCost);
	return {
		category: nameIn(names.categoryNames, item.categoryId, language) ?? item.description,
		key: nameIn(names.keyNames, item.distributionKeyId, language),
		keyShare: names.keyShares.get(item.distributionKeyId ?? '') ?? percentOf(apartmentShare, totalAmount),
		totalAmount,
		apartmentShare,
		periodShare: amountOf(item.periodShare),
		byProfile: heating && !!statement.heatingProfileId,
		tenantShare: parseFloat(item.tenantShare)
	};
}

/** The statement as the PDF prints it, with the category names in the given language */
export function toPdfData(
	statement: StatementWithDetails,
	categoryNames: Map<string, Names>,
	language: Language,
	run: RunDetails = { rentalStart: statement.periodStart, rentalEnd: statement.periodEnd },
	keyNames = new Map<string, Names>(),
	keyShares = new Map<string, string>() // "75.50 / 492.50 m²" per simple key
): StatementPDFData {
	const managementFee = parseFloat(statement.managementFee || '0');
	const subtotal = parseFloat(statement.totalCosts) - managementFee;
	return {
		id: statement.id,
		statementNumber: statement.statementNumber,
		statementDate: statement.statementDate,
		periodStart: statement.periodStart,
		periodEnd: statement.periodEnd,
		rentalDays: statement.rentalDays,
		tenant: tenantOf(statement.tenant),
		apartment: apartmentOf(statement.apartment),
		building: buildingOf(statement.building),
		...run,
		periodDays: Math.round((Date.parse(statement.periodEnd) - Date.parse(statement.periodStart)) / 86_400_000) + 1,
		lineItems: statement.lineItems.map((item) => lineItemOf(item, statement, { categoryNames, keyNames, keyShares }, language)),
		subtotal,
		managementFee,
		// The fee is a percentage of the tenant's own costs, or with a key of the building's costs (the line items' totals)
		managementFeeBase: run.managementFeeKey
			? statement.lineItems.reduce((sum, item) => sum + parseFloat(item.totalAmount), 0)
			: subtotal,
		// Older statements have no stored rate; their fee was a percentage of the tenant's own costs
		managementFeePercent: statement.managementFeePercent
			? parseFloat(statement.managementFeePercent)
			: managementFee > 0
				? (managementFee / subtotal) * 100
				: 0,
		totalCosts: parseFloat(statement.totalCosts),
		totalAdvancePayments: parseFloat(statement.totalAdvancePayments),
		balance: parseFloat(statement.balance),
		paymentDeadline: statement.paymentDeadline || undefined,
		paidDate: (statement.status === 'paid' && statement.paidDate) || undefined
	};
}

// The tenant's part of the period: from moving in or the period start to moving out or the period end
async function rentalDatesOf(statement: StatementWithDetails) {
	const [contract] = await db
		.select({ startDate: rentalContracts.startDate, endDate: rentalContracts.endDate })
		.from(rentalContracts)
		.where(eq(rentalContracts.id, statement.contractId));
	const later = (a: string, b: string) => (a > b ? a : b);
	const earlier = (a: string, b: string) => (a < b ? a : b);
	return {
		rentalStart: later(contract?.startDate ?? statement.periodStart, statement.periodStart),
		rentalEnd: earlier(contract?.endDate ?? statement.periodEnd, statement.periodEnd)
	};
}

// The heating profile and its share of the months rented; the calculation applies it to heating and hot water costs
async function heatingOf(statement: StatementWithDetails, period: { rentalStart: string; rentalEnd: string }, language: Language, hasHeating: boolean) {
	const { rentalStart, rentalEnd } = period;
	const profile = hasHeating && statement.heatingProfileId ? await getHeatingProfile(statement.heatingProfileId) : null;
	if (!profile) return {};
	// the same share the calculation takes: the months rented against the months of the period
	const { percentage, monthBreakdown } = await handleMidYearMoves(
		profile.id,
		new Date(rentalStart),
		new Date(rentalEnd),
		new Date(statement.periodStart),
		new Date(statement.periodEnd),
		100
	);
	const months = monthBreakdown.map(({ month, percentage }) => ({ month, percentage: Math.round(percentage * 100) / 100 }));
	return { heating: { profile: localName(profile, language), percent: percentage, months } };
}

// A tank in the period: its category's costs are opening stock + the invoices – closing stock (Art. 5 Abs. 2 lit. a VMWG),
// with the readings the statement was created with; the invoices are its category's positions less the change
function fuelOf(statement: StatementWithDetails, names: Map<string, Names>, language: Language) {
	const stock = statement.fuelStock;
	const category = stock && names.get(stock.categoryId);
	if (!stock || !category) return {};
	const total = statement.lineItems
		.filter((item) => item.categoryId === stock.categoryId)
		.reduce((sum, item) => sum + parseFloat(item.totalAmount), 0);
	const [opening, closing] = [parseFloat(stock.opening), parseFloat(stock.closing)];
	return {
		fuel: {
			category: localName(category, language),
			openingDate: stock.openingDate,
			opening,
			invoices: roundToRappen(total - opening + closing),
			closingDate: stock.closingDate,
			closing,
			total: roundToRappen(total)
		}
	};
}

async function feeKeyOf(statement: StatementWithDetails, language: Language) {
	if (!statement.managementFeeDistributionKeyId) return {};
	const [key] = await db.select().from(distributionKeys).where(eq(distributionKeys.id, statement.managementFeeDistributionKeyId));
	return key ? { managementFeeKey: localName(key, language) } : {};
}

// What the generation run used, for the PDF: the tenant's dates, the heating profile and the fee's key
async function runDetailsOf(statement: StatementWithDetails, names: Map<string, Names>, language: Language, hasHeating: boolean): Promise<RunDetails> {
	const rental = await rentalDatesOf(statement);
	return {
		...rental,
		...(await heatingOf(statement, rental, language, hasHeating)),
		...fuelOf(statement, names, language),
		...(await feeKeyOf(statement, language))
	};
}

async function categoryNamesOf(statement: StatementWithDetails) {
	const ids = statement.lineItems.map((item) => item.categoryId).filter((id): id is string => !!id);
	const rows = ids.length
		? await db
				.select({
					id: categories.id,
					name: categories.name,
					nameDE: categories.nameDE,
					nameFR: categories.nameFR,
					nameIT: categories.nameIT,
					nameEN: categories.nameEN,
					isHeatingCost: categories.isHeatingCost
				})
				.from(categories)
				.where(inArray(categories.id, ids))
		: [];
	return new Map(rows.map(({ id, ...names }) => [id, names]));
}

async function keyNamesOf(statement: StatementWithDetails) {
	const ids = statement.lineItems.map((item) => item.distributionKeyId).filter((id): id is string => !!id);
	const rows = ids.length ? await db.select().from(distributionKeys).where(inArray(distributionKeys.id, ids)) : [];
	return new Map(rows.map((key) => [key.id, key as Names & { formula: string | null }]));
}

const UNITS: Record<string, Record<string, string>> = {
	area: { de: 'm²', fr: 'm²', it: 'm²', en: 'm²' },
	units: { de: 'Wohnungen', fr: 'logements', it: 'appartamenti', en: 'apartments' },
	rooms: { de: 'Zimmer', fr: 'pièces', it: 'locali', en: 'rooms' }
};

// The apartment's part by a simple key as the tenant can check it: own area / the building's area, 1 / all apartments
async function keySharesOf(statement: StatementWithDetails, keys: Map<string, Names & { formula: string | null }>, language: Language) {
	const { apartments } = statement.building ? await listApartments({ buildingId: statement.building.id, limit: 1000 }) : { apartments: [] };
	const value = (apartment: { area: string; rooms: string }, unit: string) =>
		unit === 'units' ? 1 : parseFloat(unit === 'area' ? apartment.area : apartment.rooms);
	const shown = (n: number, unit: string) => (unit === 'units' ? String(n) : unit === 'area' ? n.toFixed(2) : String(n));
	const own = apartments.find((a) => a.id === statement.apartmentId);
	const shares = new Map<string, string>();
	for (const [id, key] of keys) {
		const unit = key.formula?.trim().match(/^\{(area|units|rooms)\}$/)?.[1];
		if (!unit || !own) continue;
		const total = apartments.reduce((sum, a) => sum + value(a, unit), 0);
		shares.set(id, `${shown(value(own, unit), unit)} / ${shown(total, unit)} ${UNITS[unit][language] ?? UNITS[unit].de}`);
	}
	return shares;
}

// A draft goes out with its PDF: it is dated today and gets the full payment deadline (never a shorter one)
async function redate(statement: StatementWithDetails) {
	if (statement.status !== 'draft') return statement;
	const today = new Date().toLocaleDateString('sv-SE');
	const due = new Date(Date.parse(today) + (await getTypedConfig('payment_deadline_days')) * 86_400_000).toISOString().slice(0, 10);
	const paymentDeadline = statement.paymentDeadline && statement.paymentDeadline > due ? statement.paymentDeadline : due;
	await db.update(utilityStatements).set({ statementDate: today, paymentDeadline, updatedAt: new Date() }).where(eq(utilityStatements.id, statement.id));
	return { ...statement, statementDate: today, paymentDeadline };
}

/** Render and store the PDF in the language asked for, otherwise the tenant's */
export async function generateStatementPdf(id: string, language?: string) {
	const found = await getStatement(id);
	if (!found) return 'not-found';

	const qrConfig = await qrBillConfig();
	if (!qrConfig) return 'no-iban';
	const statement = await redate(found);

	const pdfLanguage = (language || statement.tenant?.language || 'de') as Language;
	const names = await categoryNamesOf(statement);
	const hasHeating = [...names.values()].some((category) => category.isHeatingCost);
	const run = await runDetailsOf(statement, names, pdfLanguage, hasHeating);
	const keys = await keyNamesOf(statement);
	const pdfData = toPdfData(statement, names, pdfLanguage, run, keys, await keySharesOf(statement, keys, pdfLanguage));
	const pdfBase64 = await generateStatementPDFBase64(pdfData, qrConfig, pdfLanguage);
	// Only a QR-IBAN carries a QR reference on the bill
	const qrReference = isQRIBAN(qrConfig.iban) ? statementQRReference(statement.id) : null;

	await db
		.update(utilityStatements)
		.set({
			pdfBlob: pdfBase64,
			pdfGeneratedAt: new Date(),
			qrBillReference: qrReference,
			updatedAt: new Date()
		})
		.where(eq(utilityStatements.id, id));

	return { qrReference, pdfSize: pdfBase64.length };
}

/** The stored PDF (Base64) with the statement number, or why there is none */
export async function getStatementPdf(id: string) {
	const [result] = await db
		.select({
			pdfBlob: utilityStatements.pdfBlob,
			statementNumber: utilityStatements.statementNumber
		})
		.from(utilityStatements)
		.where(eq(utilityStatements.id, id))
		.limit(1);
	if (!result) return { error: 'Statement not found' };
	if (!result.pdfBlob) return { error: 'PDF not generated yet. Call POST /:id/generate-pdf first.' };
	return { pdfBlob: result.pdfBlob, statementNumber: result.statementNumber };
}
