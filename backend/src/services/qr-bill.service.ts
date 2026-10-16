/**
 * Swiss QR-Bill Service
 * Generates Swiss QR-bills according to ISO 20022 and Swiss Payment Standards
 *
 * References:
 * - Swiss Implementation Guidelines for QR-bill (SIX)
 * - ISO 20022 Pain.001
 */

import QRCode from 'qrcode';
import { CodedError } from './coded-error';

/**
 * QR-Bill data structure per Swiss standard
 */
export interface QRBillData {
	// Header
	qrType: 'SPC'; // Swiss Payments Code
	version: '0200'; // Version 2.0
	coding: '1'; // UTF-8

	// Creditor (Payment recipient)
	creditorIBAN: string;
	creditorName: string;
	creditorStreet?: string;
	creditorHouseNumber?: string;
	creditorPostalCode: string;
	creditorCity: string;
	creditorCountry: string; // 2-letter code, e.g., "CH"

	// Ultimate Creditor (optional)
	ultimateCreditorName?: string;
	ultimateCreditorStreet?: string;
	ultimateCreditorHouseNumber?: string;
	ultimateCreditorPostalCode?: string;
	ultimateCreditorCity?: string;
	ultimateCreditorCountry?: string;

	// Payment amount
	amount?: string; // Optional, 0.01 - 999999999.99
	currency: 'CHF' | 'EUR';

	// Ultimate Debtor (Payer)
	debtorName?: string;
	debtorStreet?: string;
	debtorHouseNumber?: string;
	debtorPostalCode?: string;
	debtorCity?: string;
	debtorCountry?: string;

	// Reference
	referenceType: 'QRR' | 'SCOR' | 'NON'; // QR-Reference, Creditor Reference, or none
	reference?: string; // 27 chars for QRR, up to 25 for SCOR

	// Additional information
	unstructuredMessage?: string;
	trailer: 'EPD'; // End Payment Data
	billingInfo?: string; // Alternative procedure info
}

/**
 * Statement data for QR-bill generation
 */
export interface StatementForQRBill {
	id: string;
	statementNumber: string;
	title?: string; // the message reads "{title} {number}", in the PDF's language
	balance: string;
	tenant: {
		firstName: string;
		lastName: string;
		address?: string | null;
		postalCode?: string | null;
		city?: string | null;
		country?: string | null;
	};
}

/**
 * Company configuration for QR-bill
 */
export interface QRBillConfig {
	iban: string;
	companyName: string;
	address: string;
	postalCode: string;
	city: string;
	country?: string;
}

/**
 * Validate a Swiss or Liechtenstein IBAN
 * Swiss IBANs: CH + 2 check digits + 5 bank code + 12 account number = 21 chars
 * Liechtenstein: LI + 2 check digits + 5 bank code + 12 account number = 21 chars
 */
export function validateIBAN(iban: string): { valid: boolean; error?: string } {
	// Remove spaces and convert to uppercase
	const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();

	// Check length for Swiss/Liechtenstein IBAN
	if (!cleanIBAN.startsWith('CH') && !cleanIBAN.startsWith('LI')) {
		return { valid: false, error: 'IBAN must be Swiss (CH) or Liechtenstein (LI)' };
	}

	if (cleanIBAN.length !== 21) {
		return { valid: false, error: 'Swiss/LI IBAN must be exactly 21 characters' };
	}

	// Check format: 2 letters + 2 digits + 17 alphanumeric
	if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{17}$/.test(cleanIBAN)) {
		return { valid: false, error: 'Invalid IBAN format' };
	}

	// Validate checksum using MOD-97 algorithm
	if (!validateIBANChecksum(cleanIBAN)) {
		return { valid: false, error: 'Invalid IBAN checksum' };
	}

	return { valid: true };
}

/**
 * Validate IBAN checksum using MOD-97 (ISO 7064)
 */
function validateIBANChecksum(iban: string): boolean {
	// Move first 4 chars to end
	const rearranged = iban.slice(4) + iban.slice(0, 4);

	// Convert letters to numbers (A=10, B=11, ..., Z=35)
	let numericString = '';
	for (const char of rearranged) {
		if (char >= 'A' && char <= 'Z') {
			numericString += (char.charCodeAt(0) - 55).toString();
		} else {
			numericString += char;
		}
	}

	// Calculate MOD-97
	let remainder = 0;
	for (let i = 0; i < numericString.length; i++) {
		remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
	}

	return remainder === 1;
}

/**
 * Validate QR-IBAN (special IBAN for QR-bills with QR-Reference)
 * QR-IBANs have specific IID ranges: 30000-31999
 */
export function isQRIBAN(iban: string): boolean {
	const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();

	if (!cleanIBAN.startsWith('CH') && !cleanIBAN.startsWith('LI')) {
		return false;
	}

	// IID (Institution ID) is positions 5-9 (0-indexed: 4-8)
	const iid = parseInt(cleanIBAN.slice(4, 9));
	return iid >= 30000 && iid <= 31999;
}

/**
 * Generate QR-Reference (QRR) - 27 digits
 * Format: Reference number (26 digits) + check digit (1 digit using MOD 10 recursive)
 */
function generateQRReference(baseNumber: string): string {
	// Pad or truncate to 26 digits
	let reference = baseNumber.replace(/\D/g, '').slice(0, 26).padStart(26, '0');

	// Calculate MOD 10 recursive check digit
	const checkDigit = calculateMod10Recursive(reference);
	return reference + checkDigit;
}

/** QR-Reference of a statement: the first 80 bits of its UUID as a decimal number (at most 25 digits) */
export function statementQRReference(statementId: string): string {
	return generateQRReference(BigInt('0x' + statementId.replace(/-/g, '').slice(0, 20)).toString());
}

/**
 * Calculate MOD 10 recursive (Swiss standard)
 */
function calculateMod10Recursive(value: string): string {
	const table = [0, 9, 4, 6, 8, 2, 7, 1, 3, 5];
	let carry = 0;

	for (const char of value) {
		carry = table[(carry + parseInt(char)) % 10];
	}

	return ((10 - carry) % 10).toString();
}

/**
 * Validate QR-Reference format
 */
export function validateQRReference(reference: string): { valid: boolean; error?: string } {
	const clean = reference.replace(/\s/g, '');

	if (clean.length !== 27) {
		return { valid: false, error: 'QR-Reference must be exactly 27 digits' };
	}

	if (!/^\d{27}$/.test(clean)) {
		return { valid: false, error: 'QR-Reference must contain only digits' };
	}

	// Validate check digit
	const base = clean.slice(0, 26);
	const checkDigit = clean.slice(26);
	const calculatedCheck = calculateMod10Recursive(base);

	if (checkDigit !== calculatedCheck) {
		return { valid: false, error: 'Invalid QR-Reference check digit' };
	}

	return { valid: true };
}

/**
 * Format amount for QR-bill (max 2 decimal places, no thousands separator)
 */
function formatAmount(amount: number): string {
	if (amount <= 0) return '';
	return amount.toFixed(2);
}

// An optional field of the payload, cut to its length (empty if not given)
const field = (value: string | undefined, max = Infinity) => (value ?? '').slice(0, max);

// Ultimate Debtor Address (type S = structured), only complete: SIX requires postal code and town with a name
function debtorLines(data: QRBillData) {
	if (!(data.debtorName && data.debtorPostalCode && data.debtorCity)) return ['', '', '', '', '', '', ''];
	return [
		'S',
		data.debtorName.slice(0, 70),
		field(data.debtorStreet, 70),
		field(data.debtorHouseNumber, 16),
		data.debtorPostalCode.slice(0, 16),
		data.debtorCity.slice(0, 35),
		field(data.debtorCountry, 2)
	];
}

/**
 * Generate QR-bill data string according to Swiss standard
 */
function generateQRDataString(data: QRBillData): string {
	const lines: string[] = [
		data.qrType, // SPC
		data.version, // 0200
		data.coding, // 1

		// Creditor Account
		data.creditorIBAN.replace(/\s/g, ''),

		// Creditor Address (type S = structured)
		'S',
		data.creditorName.slice(0, 70),
		field(data.creditorStreet, 70),
		field(data.creditorHouseNumber, 16),
		data.creditorPostalCode.slice(0, 16),
		data.creditorCity.slice(0, 35),
		data.creditorCountry.slice(0, 2),

		// Ultimate Creditor (empty if not used)
		'',
		field(data.ultimateCreditorName, 70),
		field(data.ultimateCreditorStreet, 70),
		field(data.ultimateCreditorHouseNumber, 16),
		field(data.ultimateCreditorPostalCode, 16),
		field(data.ultimateCreditorCity, 35),
		field(data.ultimateCreditorCountry, 2),

		// Payment Amount
		field(data.amount),
		data.currency,

		...debtorLines(data),

		// Reference
		data.referenceType,
		field(data.reference),

		// Additional information
		field(data.unstructuredMessage, 140),
		data.trailer,
		field(data.billingInfo, 140)
	];

	return lines.join('\n');
}

/**
 * Generate QR code image from QR-bill data
 */
async function generateQRCodeImage(
	qrDataString: string,
	options?: { width?: number; margin?: number }
): Promise<Buffer> {
	// 10 pixels per module: printed at 46 mm every module keeps the same width (166 px made them uneven)
	const qrOptions = {
		type: 'png' as const,
		...(options?.width ? { width: options.width } : { scale: 10 }),
		margin: options?.margin || 0,
		errorCorrectionLevel: 'M' as const // Medium error correction
	};

	return QRCode.toBuffer(qrDataString, qrOptions);
}

/**
 * Generate complete QR-bill data for a statement
 */
export async function generateQRBillForStatement(
	statement: StatementForQRBill,
	config: QRBillConfig
): Promise<{
	qrData: QRBillData;
	qrDataString: string;
	qrCodeImage: Buffer;
	reference: string;
}> {
	// Validate IBAN
	const ibanValidation = validateIBAN(config.iban);
	if (!ibanValidation.valid) {
		throw new CodedError('IBAN_INVALID', `Invalid IBAN: ${ibanValidation.error}`);
	}

	// Determine reference type based on IBAN type
	const useQRReference = isQRIBAN(config.iban);

	const reference = useQRReference ? statementQRReference(statement.id) : undefined;

	// Parse balance amount (positive = tenant owes money)
	const balanceAmount = parseFloat(statement.balance);
	const amount = balanceAmount > 0 ? formatAmount(balanceAmount) : undefined;

	const qrData: QRBillData = {
		qrType: 'SPC',
		version: '0200',
		coding: '1',

		creditorIBAN: config.iban,
		creditorName: config.companyName,
		creditorStreet: config.address,
		creditorPostalCode: config.postalCode,
		creditorCity: config.city,
		creditorCountry: config.country || 'CH',

		amount,
		currency: 'CHF',

		debtorName: `${statement.tenant.firstName} ${statement.tenant.lastName}`,
		debtorStreet: statement.tenant.address ?? undefined,
		debtorPostalCode: statement.tenant.postalCode ?? undefined,
		debtorCity: statement.tenant.city ?? undefined,
		debtorCountry: statement.tenant.country ?? 'CH',

		referenceType: useQRReference ? 'QRR' : 'NON',
		reference,

		unstructuredMessage: `${statement.title ?? 'Nebenkostenabrechnung'} ${statement.statementNumber}`,
		trailer: 'EPD'
	};

	const qrDataString = generateQRDataString(qrData);
	const qrCodeImage = await generateQRCodeImage(qrDataString);

	return {
		qrData,
		qrDataString,
		qrCodeImage,
		reference: reference || ''
	};
}

/**
 * Format QR-Reference for display (groups of 5)
 */
export function formatQRReferenceForDisplay(reference: string): string {
	// SIX: blocks of five from the right, "21 00000 00003 13947 14300 09017"
	const clean = reference.replace(/\s/g, '');
	return clean.replace(/\B(?=(.{5})+$)/g, ' ') || reference;
}

/**
 * Format IBAN for display (groups of 4)
 */
export function formatIBANForDisplay(iban: string): string {
	const clean = iban.replace(/\s/g, '');
	return clean.match(/.{1,4}/g)?.join(' ') || iban;
}
