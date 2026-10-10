/**
 * Statement PDF
 * Renders a statement with its QR-bill and stores the PDF with the statement
 */

import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, distributionKeys, rentalContracts, utilityStatements } from '../db/schema';
import { calculateHeatingShare, getHeatingProfile } from './heating-profile.service';
import { getTypedConfig } from './config.service';
import { generateStatementPDFBase64, type StatementPDFData, type Language } from './pdf.service';
import { isQRIBAN, statementQRReference, type QRBillConfig } from './qr-bill.service';
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

type Names = { name: string; nameDE: string | null; nameFR: string | null; nameIT: string | null; nameEN: string | null };

// A category, key or profile in the PDF's language; Romansh and missing translations fall back to German
const localName = (names: Names, language: Language) =>
	({ fr: names.nameFR, it: names.nameIT, en: names.nameEN })[language as 'fr' | 'it' | 'en'] || names.nameDE || names.name;

/** What the generation run used, as the PDF names it: the tenant's dates, the heating profile and the fee's key */
export interface RunDetails {
	rentalStart: string;
	rentalEnd: string;
	heating?: { profile: string; percent: number };
	managementFeeKey?: string;
}

/** The statement as the PDF prints it, with the category names in the given language */
export function toPdfData(
	statement: StatementWithDetails,
	categoryNames: Map<string, Names>,
	language: Language,
	run: RunDetails = { rentalStart: statement.periodStart, rentalEnd: statement.periodEnd }
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
		lineItems: statement.lineItems.map((item) => {
			const names = item.categoryId ? categoryNames.get(item.categoryId) : undefined;
			return {
				category: names ? localName(names, language) : item.description,
				totalAmount: parseFloat(item.totalAmount),
				tenantShare: parseFloat(item.tenantShare),
				sharePercentage: item.sharePercentage ? parseFloat(item.sharePercentage) / 100 : 0
			};
		}),
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
		paymentDeadline: statement.paymentDeadline || undefined
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
	const { percentage } = calculateHeatingShare(profile, new Date(rentalStart), new Date(rentalEnd), 100);
	return { heating: { profile: localName(profile, language), percent: percentage } };
}

async function feeKeyOf(statement: StatementWithDetails, language: Language) {
	if (!statement.managementFeeDistributionKeyId) return {};
	const [key] = await db.select().from(distributionKeys).where(eq(distributionKeys.id, statement.managementFeeDistributionKeyId));
	return key ? { managementFeeKey: localName(key, language) } : {};
}

// What the generation run used, for the PDF: the tenant's dates, the heating profile and the fee's key
async function runDetailsOf(statement: StatementWithDetails, language: Language, hasHeating: boolean): Promise<RunDetails> {
	const rental = await rentalDatesOf(statement);
	return {
		...rental,
		...(await heatingOf(statement, rental, language, hasHeating)),
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

/** Render and store the PDF in the language asked for, otherwise the tenant's */
export async function generateStatementPdf(id: string, language?: string) {
	const statement = await getStatement(id);
	if (!statement) return 'not-found';

	const qrConfig = await qrBillConfig();
	if (!qrConfig) return 'no-iban';

	const pdfLanguage = (language || statement.tenant?.language || 'de') as Language;
	const names = await categoryNamesOf(statement);
	const hasHeating = [...names.values()].some((category) => category.isHeatingCost);
	const pdfData = toPdfData(statement, names, pdfLanguage, await runDetailsOf(statement, pdfLanguage, hasHeating));
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
