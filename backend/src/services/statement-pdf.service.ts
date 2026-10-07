/**
 * Statement PDF
 * Renders a statement with its QR-bill and stores the PDF with the statement
 */

import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { getTypedConfig } from './config.service';
import { generateStatementPDFBase64, type StatementPDFData, type Language } from './pdf.service';
import { generateQRReference, type QRBillConfig } from './qr-bill.service';
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

const tenantOf = (tenant: StatementWithDetails['tenant']) => ({
	firstName: tenant?.firstName || 'Unknown',
	lastName: tenant?.lastName || 'Tenant',
	email: tenant?.email || undefined,
	address: undefined, // Would need to get from tenant record
	postalCode: undefined,
	city: undefined
});

const apartmentOf = (apartment: StatementWithDetails['apartment']) => ({
	number: apartment?.number || 'N/A',
	floor: apartment?.floor || 0,
	area: apartment?.area || '0'
});

const buildingOf = (building: StatementWithDetails['building']) => ({
	name: building?.name || 'Building',
	address: building?.address || ''
});

function toPdfData(statement: StatementWithDetails): StatementPDFData {
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
		lineItems: statement.lineItems.map((item) => ({
			category: item.description,
			totalAmount: parseFloat(item.totalAmount),
			tenantShare: parseFloat(item.tenantShare),
			sharePercentage: item.sharePercentage ? parseFloat(item.sharePercentage) / 100 : 0
		})),
		subtotal,
		managementFee,
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

/** Render and store the PDF in the language asked for, otherwise the tenant's */
export async function generateStatementPdf(id: string, language?: string) {
	const statement = await getStatement(id);
	if (!statement) return 'not-found';

	const qrConfig = await qrBillConfig();
	if (!qrConfig) return 'no-iban';

	const pdfLanguage = (language || statement.tenant?.language || 'de') as Language;
	const pdfBase64 = await generateStatementPDFBase64(toPdfData(statement), qrConfig, pdfLanguage);
	const qrReference = generateQRReference(statement.id.replace(/-/g, '').slice(0, 20));

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
