/**
 * Statement PDF
 * Renders a statement with its QR-bill and stores the PDF with the statement
 */

import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, distributionKeys, utilityStatements, type KeyValues } from '../db/schema';
import { belowMinimum, roundToRappen } from './pdf-format';
import { getTypedConfig } from './config.service';
import { generateStatementPDFBase64, type StatementPDFData, type Language } from './pdf.service';
import { isQRIBAN, statementQRReference, type QRBillConfig } from './qr-bill.service';
import { datedToday, getStatement, keyValuesOf, updateStatementStatus, type StatementWithDetails } from './statement.service';
import { refusal } from './coded-error';
import { billingStart, getContract } from './contract.service';

// Creditor of the QR-bill from the company configuration, as entered (#450); null without IBAN
export async function qrBillConfig(): Promise<QRBillConfig | null> {
	const companyName = await getTypedConfig('company_name');
	const companyAddress = await getTypedConfig('company_address');
	const companyPostalCode = await getTypedConfig('company_postal_code');
	const companyCity = await getTypedConfig('company_city');
	const iban = await getTypedConfig('iban');
	if (!iban) return null;

	return { iban, companyName, address: companyAddress, postalCode: companyPostalCode, city: companyCity };
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

// A category, key or profile in the PDF's language; missing translations fall back to German
const localName = (names: Names, language: Language) =>
	({ fr: names.nameFR, it: names.nameIT, en: names.nameEN })[language as 'fr' | 'it' | 'en'] || names.nameDE || names.name;

/** What the generation run used, as the PDF names it: the tenant's dates and the heating profile */
export interface RunDetails {
	rentalStart: string;
	rentalEnd: string;
	billed?: StatementPDFData['billed'];
	heating?: StatementPDFData['heating'];
	fuel?: StatementPDFData['fuel'];
}

type LineNames = { categoryNames: Map<string, Names>; keyNames: Map<string, Names>; keyShares: Map<string, string> };

const amountOf = (value: string | null) => (value == null ? null : parseFloat(value));

// a mixed key (70 % area, 30 % units): the apartment's share as a percentage of the building's costs
const percentOf = (part: number | null, total: number) => (part == null || !total ? undefined : `${((part / total) * 100).toFixed(2)} %`);

// '' names a position without key (keyNamesOf)
const nameIn = (map: Map<string, Names>, id: string | null, language: Language) => {
	const names = map.get(id ?? '');
	return names && localName(names, language);
};

// A line shared by the days rented: its own days (#137), or the days of the contract in the period
const byDaysRented = (item: StatementWithDetails['lineItems'][number], daysShare: number) =>
	!!item.billedDays || Math.abs(parseFloat(item.periodShare ?? '1') - daysShare) < 0.00005;

// One position as the PDF prints it: names in the language, the key with the apartment's part, the shares
function lineItemOf(item: StatementWithDetails['lineItems'][number], byProfile: boolean, names: LineNames, language: Language) {
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
		shareDays: item.billedDays ? { days: item.positionRentalDays ?? 0, total: item.billedDays } : undefined,
		// each part with the description of its invoice, in the same order (#236)
		invoiceParts: item.invoiceParts?.map((part, i) => ({ ...part, description: item.invoices?.[i]?.description })),
		byProfile: heating && byProfile,
		heating,
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
	const periodDays = Math.round((Date.parse(statement.periodEnd) - Date.parse(statement.periodStart)) / 86_400_000) + 1;
	const legacyProfile = !statement.heatingShare && !!statement.heatingProfileId; // created before #209
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
		periodDays,
		// by the profile only where the calculation shared the heating costs by it (run.heating), not by days (#137); a
		// statement created before #209 stores no share: by the profile where its line is not the days rented (M-5)
		lineItems: statement.lineItems.map((item) =>
			lineItemOf(item, !!run.heating || (legacyProfile && !byDaysRented(item, statement.rentalDays / periodDays)), { categoryNames, keyNames, keyShares }, language)
		),
		subtotal,
		managementFee,
		managementFeePercent: parseFloat(statement.managementFeePercent ?? '0'), // rate chosen for the generation run
		totalCosts: parseFloat(statement.totalCosts),
		totalAdvancePayments: parseFloat(statement.totalAdvancePayments),
		advanceLines: statement.advanceLines, // as calculated (#464); null before: the total only
		balance: parseFloat(statement.balance),
		paymentDeadline: statement.paymentDeadline || undefined,
		paidDate: (statement.status === 'paid' && statement.paidDate) || undefined,
		// the agreed categories it bills, as its positions name them (#91, domain review M-2); not next to a position
		// without a category, which no contract agrees (round 2 M-1)
		agreedCosts:
			statement.agreedCategoryIds && statement.lineItems.every((item) => item.categoryId)
				? [...new Set(statement.lineItems.flatMap((item) => nameIn(categoryNames, item.categoryId, language) ?? []))]
				: undefined,
		...minimumOf(statement),
		...(statement.carriedFrom && {
			carryOver: { statementNumber: statement.carriedFrom.statementNumber, amount: parseFloat(statement.carriedFrom.balance) }
		}),
		notes: statement.notes || undefined,
		...(statement.replaces && {
			replaces: {
				statementNumber: statement.replaces.statementNumber,
				statementDate: statement.replaces.statementDate,
				paidOn: statement.priorPaidOn ?? [],
				priorPayments: parseFloat(statement.priorPayments),
				offsetWith: (statement.offsetWith ?? []).map((o) => ({ statementNumber: o.statementNumber, amount: parseFloat(o.amount) }))
			}
		})
	};
}

// #448: a Saldo below CHF 5 is carried over, except on a Schlussabrechnung; one settled under #94 (paid with 0.00) keeps
// what the tenant was told
function minimumOf(statement: StatementWithDetails) {
	const balance = parseFloat(statement.balance);
	if (!belowMinimum(balance) || balance === 0) return {};
	if (statement.paidDate && Number(statement.paidAmount) === 0) return { waived: true };
	// settled stays settled, also when the contract's end moves into the period afterwards (Fachreview 448-2 V-17)
	return statement.final && statement.status !== 'settled' ? {} : { carried: true };
}

// The heating profile and its share of the months rented; the calculation applies it to heating and hot water costs
function heatingOf(statement: StatementWithDetails, language: Language, hasHeating: boolean, lineShare?: string | null) {
	// as the statement was calculated, also after the profile changed (#209); one created before gets no note (#232, C-5)
	const stored = statement.heatingShare;
	if (!hasHeating || !stored || stored.byDays) return {};
	// the heating position's share where there is one: shares stored under #209 were rounded differently (#229)
	const percent = lineShare == null ? stored.percent : parseFloat(lineShare) * 100;
	const { months, periodPercent, periodMonths } = stored;
	return { heating: { profile: localName(stored.names, language), percent, months, periodPercent, periodMonths } };
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

// #133: the statement bills from the day after «Abgerechnet bis», the tenancy in the period started before
async function billedOf(statement: StatementWithDetails) {
	const contract = statement.contractId ? await getContract(statement.contractId) : null;
	if (!contract?.billedUntil || billingStart(contract) !== statement.rentalStart) return {};
	const tenancyStart = [contract.startDate, statement.periodStart].sort()[1];
	return tenancyStart < statement.rentalStart ? { billed: { until: contract.billedUntil, tenancyStart } } : {};
}

// What the generation run used, for the PDF: the tenant's dates and the heating profile
async function runDetailsOf(statement: StatementWithDetails, names: Map<string, Names>, language: Language, hasHeating: boolean): Promise<RunDetails> {
	// the tenant's part of the period, as billed: from moving in or the period start to moving out or the period end
	const rental = { rentalStart: statement.rentalStart, rentalEnd: statement.rentalEnd, ...(await billedOf(statement)) };
	// a position with invoices by their own days has its own share, not the run's, and one summing to zero none (#71)
	const heatingLine = statement.lineItems.find((item) => item.categoryId && names.get(item.categoryId)?.isHeatingCost && !item.invoiceParts && parseFloat(item.totalAmount) !== 0);
	return {
		...rental,
		...heatingOf(statement, language, hasHeating, heatingLine?.periodShare),
		...fuelOf(statement, names, language)
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

// A position without key (an invoice recorded before the key was required, #379) is shared evenly per apartment: the
// PDF names it «Pro Einheit», under '' (the key of a position without one)
async function keyNamesOf(statement: StatementWithDetails) {
	const ids = statement.lineItems.map((item) => item.distributionKeyId).filter((id): id is string => !!id);
	const rows = ids.length ? await db.select().from(distributionKeys).where(inArray(distributionKeys.id, ids)) : [];
	const keys = new Map(rows.map((key) => [key.id, key as Names & { formula: string | null }]));
	if (statement.lineItems.some((item) => !item.distributionKeyId)) {
		const [perUnit] = await db.select().from(distributionKeys).where(eq(distributionKeys.name, 'Per Unit'));
		if (perUnit) keys.set('', perUnit);
	}
	return keys;
}

const UNITS: Record<string, Record<string, string>> = {
	area: { de: 'm²', fr: 'm²', it: 'm²', en: 'm²' },
	units: { de: 'Wohnungen', fr: 'logements', it: 'appartamenti', en: 'apartments' },
	rooms: { de: 'Zimmer', fr: 'pièces', it: 'locali', en: 'rooms' }
};

const shown = (n: number, unit: string) => (unit === 'area' ? n.toFixed(2) : String(n));
const term = /^(?:([\d.]+)\s*\*\s*)?\{(area|units|rooms)\}(\s*\/\s*\{\2_total\})?$/;

/** The apartment's part by the key as the tenant can check it: "75.50 / 492.50 m²", a mixed key as its sum of fractions */
export function keyShareOf(formula: string | null, values: KeyValues, language: Language) {
	const terms = (formula ?? '').split('+').map((part) => part.trim().match(term));
	if (!terms.length || terms.some((match) => !match)) return undefined;
	const fraction = ([, , unit]: RegExpMatchArray) => {
		const [own, total] = values[unit as keyof KeyValues];
		return `${shown(own, unit)} / ${shown(total, unit)} ${UNITS[unit][language] ?? UNITS[unit].de}`;
	};
	if (terms.length === 1) return fraction(terms[0]!);
	// Only fractions of the totals whose weights make 100 % split as written; anything else the app normalises
	const weights = terms.map((match) => (match![3] ? parseFloat(match![1] ?? '1') : NaN));
	if (!(Math.abs(weights.reduce((sum, weight) => sum + weight, 0) - 1) < 1e-9)) return undefined; // NaN: a term without its total
	return terms.map((match, i) => `${Math.round(weights[i] * 10000) / 100} % × ${fraction(match!)}`).join('\n+ ');
}

// The fractions as the statement was created; older statements take the building's apartments as they are now
async function keySharesOf(statement: StatementWithDetails, keys: Map<string, Names & { formula: string | null }>, language: Language) {
	const values = statement.keyValues ?? (statement.building ? await keyValuesOf(statement.building.id, statement.apartmentId) : null);
	const shares = new Map<string, string>();
	for (const [id, key] of keys) {
		const share = values && keyShareOf(key.formula, values, language);
		if (share) shares.set(id, share);
	}
	return shares;
}

/** Render and store the PDF in the language asked for, otherwise the tenant's; the PDF and what it prints for e-mailing it */
export async function generateStatementPdf(id: string, language?: string) {
	const found = await getStatement(id);
	if (!found) return 'not-found';

	const qrConfig = await qrBillConfig();
	if (!qrConfig) return 'no-iban';
	// A draft's PDF shows the statement as if sent today; sending dates it again
	const dates = found.status === 'draft' ? await datedToday(found.paymentDeadline) : {};
	const statement = { ...found, ...dates };

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
			...dates,
			pdfBlob: pdfBase64,
			pdfGeneratedAt: new Date(),
			qrBillReference: qrReference,
			updatedAt: new Date()
		})
		.where(eq(utilityStatements.id, id));

	return { qrReference, pdfSize: pdfBase64.length, pdf: pdfBase64, data: pdfData, language: pdfLanguage };
}

const storedPdf = async (id: string) =>
	(
		await db
			.select({
				pdfBlob: utilityStatements.pdfBlob,
				statementNumber: utilityStatements.statementNumber,
				status: utilityStatements.status
			})
			.from(utilityStatements)
			.where(eq(utilityStatements.id, id))
			.limit(1)
	)[0];

/**
 * The PDF the tenant gets (Base64) with the statement number, or why there is none: a draft's made afresh, as if sent
 * today with the tenant's address and the settings as they are now (personas W3c P-1, P-2), and one discarded by
 * sending or paying made again
 */
export async function getStatementPdf(id: string) {
	let result = await storedPdf(id);
	if (!result) return { status: 404, refusal: refusal('STATEMENT_NOT_FOUND', 'Statement not found') };
	if (!result.pdfBlob || result.status === 'draft') {
		if ((await generateStatementPdf(id)) === 'no-iban')
			return { status: 400, refusal: refusal('IBAN_MISSING', 'IBAN not configured. Please set up company configuration first.') };
		result = (await storedPdf(id))!;
	}
	return { pdfBlob: result.pdfBlob!, statementNumber: result.statementNumber };
}

/** A status change; when sent, the PDF as sent is made at that moment and kept (closing review C-1) */
export async function changeStatementStatus(...[id, status, data]: Parameters<typeof updateStatementStatus>) {
	const statement = await updateStatementStatus(id, status, data);
	// also when a Saldo of 0 makes it paid at once (review C-3); sent stays sent when the PDF cannot be made now (no
	// IBAN, a failure): it is made on its first request then
	if (statement && status === 'sent')
		await generateStatementPdf(id).catch((error) => console.warn('PDF as sent not made:', error));
	return statement;
}
