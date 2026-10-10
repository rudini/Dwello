/**
 * PDF Generation Service
 * Generates professional utility statement PDFs with Swiss QR-bills
 *
 * Features:
 * - Multi-language support (DE, FR, IT, RM, EN)
 * - Swiss QR-bill integration
 * - Professional formatting
 * - Cost breakdown by category
 */

import PDFDocument from 'pdfkit';
import {
	generateQRBillForStatement,
	formatIBANForDisplay,
	formatQRReferenceForDisplay,
	type QRBillConfig,
	type StatementForQRBill
} from './qr-bill.service';
import { formatCHF, formatSwissDate } from './pdf-format';

/**
 * Supported languages
 */
export type Language = 'de' | 'fr' | 'it' | 'rm' | 'en';

/**
 * Translation strings for each language
 */
const translations: Record<Language, Record<string, string>> = {
	de: {
		title: 'Nebenkostenabrechnung',
		period: 'Abrechnungsperiode',
		tenant: 'Mieter',
		apartment: 'Wohnung',
		building: 'Liegenschaft',
		address: 'Adresse',
		floor: 'Stockwerk',
		area: 'Fläche',
		rentalDays: 'Mietstage',
		costBreakdown: 'Kostenübersicht',
		category: 'Kategorie',
		totalAmount: 'Kosten Liegenschaft',
		yourShare: 'Ihr Anteil',
		sharePercent: 'Anteil %',
		subtotal: 'Zwischensumme',
		managementFee: 'Verwaltungspauschale',
		totalCosts: 'Gesamtkosten',
		advancePayments: 'Geleistete Akontobeiträge',
		balance: 'Saldo',
		amountDue: 'Nachzahlung',
		refund: 'Rückerstattung',
		paymentDeadline: 'Zahlungsfrist',
		paymentInfo: 'Zahlungsinformationen',
		qrBillSection: 'Zahlteil',
		receiptSection: 'Empfangsschein',
		currency: 'Währung',
		amount: 'Betrag',
		account: 'Konto',
		reference: 'Referenz',
		payableTo: 'Zahlbar an',
		payableBy: 'Zahlbar durch',
		acceptancePoint: 'Annahmestelle',
		statementNumber: 'Abrechnungsnr.',
		statementDate: 'Abrechnungsdatum',
		rentalPeriod: 'Ihre Mietdauer',
		heatingNote: 'Heizkosten nach Heizprofil «{profile}»: {percent} % der Jahreskosten Ihrer Wohnung',
		feeBase: '{percent} % von CHF {base}',
		feeKey: 'verteilt nach {key}',
		daysUnit: 'Mietstage',
		feeDays: ', für Ihre {days} von {total} Tagen',
		feeOwn: '{percent} % Ihrer Nebenkosten von CHF {base}',
		sqm: 'm²'
	},
	fr: {
		title: 'Décompte des charges',
		period: 'Période de décompte',
		tenant: 'Locataire',
		apartment: 'Appartement',
		building: 'Immeuble',
		address: 'Adresse',
		floor: 'Étage',
		area: 'Surface',
		rentalDays: 'Durée de location (jours)',
		costBreakdown: 'Aperçu des coûts',
		category: 'Catégorie',
		totalAmount: 'Coûts de l\'immeuble',
		yourShare: 'Votre part',
		sharePercent: 'Part %',
		subtotal: 'Sous-total',
		managementFee: 'Frais de gestion',
		totalCosts: 'Coûts totaux',
		advancePayments: 'Acomptes versés',
		balance: 'Solde',
		amountDue: 'Montant à payer',
		refund: 'Remboursement',
		paymentDeadline: 'Délai de paiement',
		paymentInfo: 'Informations de paiement',
		qrBillSection: 'Section paiement',
		receiptSection: 'Récépissé',
		currency: 'Monnaie',
		amount: 'Montant',
		account: 'Compte',
		reference: 'Référence',
		payableTo: 'En faveur de',
		payableBy: 'Payable par',
		acceptancePoint: 'Point de dépôt',
		statementNumber: 'N° de décompte',
		statementDate: 'Date du décompte',
		rentalPeriod: 'Votre période de location',
		heatingNote: 'Frais de chauffage selon le profil «{profile}» : {percent} % des frais annuels de votre logement',
		feeBase: '{percent} % de CHF {base}',
		feeKey: 'réparti selon {key}',
		daysUnit: 'jours',
		feeDays: ', pour vos {days} jours sur {total}',
		feeOwn: '{percent} % de vos frais accessoires de CHF {base}',
		sqm: 'm²'
	},
	it: {
		title: 'Conteggio spese accessorie',
		period: 'Periodo di conteggio',
		tenant: 'Inquilino',
		apartment: 'Appartamento',
		building: 'Immobile',
		address: 'Indirizzo',
		floor: 'Piano',
		area: 'Superficie',
		rentalDays: 'Durata dell\'affitto (giorni)',
		costBreakdown: 'Riepilogo costi',
		category: 'Categoria',
		totalAmount: 'Costi edificio',
		yourShare: 'Quota',
		sharePercent: 'Quota %',
		subtotal: 'Subtotale',
		managementFee: 'Spese di gestione',
		totalCosts: 'Costi totali',
		advancePayments: 'Acconti versati',
		balance: 'Saldo',
		amountDue: 'Importo dovuto',
		refund: 'Rimborso',
		paymentDeadline: 'Termine di pagamento',
		paymentInfo: 'Informazioni di pagamento',
		qrBillSection: 'Sezione pagamento',
		receiptSection: 'Ricevuta',
		currency: 'Valuta',
		amount: 'Importo',
		account: 'Conto',
		reference: 'Riferimento',
		payableTo: 'A favore di',
		payableBy: 'Pagabile da',
		acceptancePoint: 'Punto di accettazione',
		statementNumber: 'N. conteggio',
		statementDate: 'Data del conteggio',
		rentalPeriod: 'Il suo periodo di locazione',
		heatingNote: 'Spese di riscaldamento secondo il profilo «{profile}»: {percent} % delle spese annue del suo appartamento',
		feeBase: '{percent} % di CHF {base}',
		feeKey: 'ripartito secondo {key}',
		daysUnit: 'giorni',
		feeDays: ', per i suoi {days} giorni su {total}',
		feeOwn: '{percent} % delle sue spese accessorie di CHF {base}',
		sqm: 'm²'
	},
	rm: {
		title: 'Rendaquint dals custs supplementars',
		period: 'Perioda da rendaquint',
		tenant: 'Affittader',
		apartment: 'Abitaziun',
		building: 'Bajetg',
		address: 'Adressa',
		floor: 'Plaun',
		area: 'Surfatscha',
		rentalDays: 'Durada da locaziun (dis)',
		costBreakdown: 'Survista dals custs',
		category: 'Categoria',
		totalAmount: 'Custs dal bajetg',
		yourShare: 'Vossa part',
		sharePercent: 'Part %',
		subtotal: 'Subtotal',
		managementFee: 'Custs d\'administraziun',
		totalCosts: 'Custs totals',
		advancePayments: 'Pajaments anticips',
		balance: 'Saldo',
		amountDue: 'Sum da pajar',
		refund: 'Remburs',
		paymentDeadline: 'Termin da pajament',
		paymentInfo: 'Infurmaziuns da pajament',
		qrBillSection: 'Secziun da pajament',
		receiptSection: 'Quittanza',
		currency: 'Valuta',
		amount: 'Import',
		account: 'Conto',
		reference: 'Referenza',
		payableTo: 'Pajabel a',
		payableBy: 'Pajabel da',
		acceptancePoint: 'Lieu d\'acceptaziun',
		statementNumber: 'Nr. rendaquint',
		statementDate: 'Data dal rendaquint',
		rentalPeriod: 'Vossa durada da locaziun',
		heatingNote: 'Custs da stgaudament tenor il profil «{profile}»: {percent} % dals custs annuals da Vossa abitaziun',
		feeBase: '{percent} % da CHF {base}',
		feeKey: 'repartì tenor {key}',
		daysUnit: 'dis',
		feeDays: ', per Voss {days} da {total} dis',
		feeOwn: '{percent} % da Voss custs supplementars da CHF {base}',
		sqm: 'm²'
	},
	en: {
		title: 'Utility Cost Statement',
		period: 'Billing Period',
		tenant: 'Tenant',
		apartment: 'Apartment',
		building: 'Building',
		address: 'Address',
		floor: 'Floor',
		area: 'Area',
		rentalDays: 'Rental Duration (days)',
		costBreakdown: 'Cost Overview',
		category: 'Category',
		totalAmount: 'Building Costs',
		yourShare: 'Your Share',
		sharePercent: 'Share %',
		subtotal: 'Subtotal',
		managementFee: 'Management Fee',
		totalCosts: 'Total Costs',
		advancePayments: 'Advance Payments Made',
		balance: 'Balance',
		amountDue: 'Amount Due',
		refund: 'Refund',
		paymentDeadline: 'Payment Deadline',
		paymentInfo: 'Payment Information',
		qrBillSection: 'Payment Section',
		receiptSection: 'Receipt',
		currency: 'Currency',
		amount: 'Amount',
		account: 'Account',
		reference: 'Reference',
		payableTo: 'Payable to',
		payableBy: 'Payable by',
		acceptancePoint: 'Acceptance point',
		statementNumber: 'Statement No.',
		statementDate: 'Statement Date',
		rentalPeriod: 'Your rental period',
		heatingNote: 'Heating costs by heating profile «{profile}»: {percent}% of the annual costs of your apartment',
		feeBase: '{percent}% of CHF {base}',
		feeKey: 'split by {key}',
		daysUnit: 'days',
		feeDays: ', for your {days} of {total} days',
		feeOwn: '{percent}% of your utility costs of CHF {base}',
		sqm: 'm²'
	}
};

/**
 * Statement line item
 */
export interface LineItem {
	category: string;
	totalAmount: number;
	tenantShare: number;
	sharePercentage: number;
}

/**
 * Full statement data for PDF generation
 */
export interface StatementPDFData {
	id: string;
	statementNumber: string;
	statementDate: string;
	periodStart: string;
	periodEnd: string;
	rentalDays: number;

	// Tenant info
	tenant: {
		firstName: string;
		lastName: string;
		address?: string | null;
		postalCode?: string | null;
		city?: string | null;
	};

	// Apartment info
	apartment: {
		number: string;
		floor: number;
		area: string;
	};

	// Building info
	building: {
		name: string;
		address: string;
		place: string;
	};

	// Cost breakdown
	lineItems: LineItem[];

	// The tenant's part of the period and what the generation run used
	rentalStart: string;
	rentalEnd: string;
	periodDays: number; // days of the Abrechnungsperiode, the base of the Mietstage
	heating?: { profile: string; percent: number };
	managementFeeKey?: string;

	// Totals
	subtotal: number;
	managementFee: number;
	managementFeePercent: number;
	managementFeeBase: number; // the building's utility costs the percentage applies to
	totalCosts: number;
	totalAdvancePayments: number;
	balance: number; // Positive = tenant owes, negative = refund

	// Payment info
	paymentDeadline?: string;
}

/** CHF 1'234.56 */
const formatCurrency = (amount: number) => `CHF ${formatCHF(Math.abs(amount))}`;

const formatDate = formatSwissDate;

/**
 * Format percentage (12.50%)
 */
function formatPercentage(value: number): string {
	return `${(value * 100).toFixed(2)}%`;
}

/**
 * Get floor display text
 */
function formatFloor(floor: number, lang: Language): string {
	if (floor === 0) {
		return lang === 'de' || lang === 'rm' ? 'EG' : lang === 'fr' ? 'RDC' : lang === 'it' ? 'PT' : 'GF';
	}
	if (floor < 0) {
		return `UG${Math.abs(floor)}`;
	}
	return `${floor}.${lang === 'de' || lang === 'rm' ? 'OG' : lang === 'en' ? 'F' : 'E'}`;
}

// The base of the management fee: the tenant's own costs, or the building's costs split by a key for the tenant's days
function feeBasis(data: StatementPDFData, t: Record<string, string>) {
	const fill = (text: string) =>
		text.replace('{percent}', String(data.managementFeePercent)).replace('{base}', formatCHF(data.managementFeeBase));
	if (!data.managementFeeKey) return fill(t.feeOwn);
	const days =
		data.rentalDays < data.periodDays
			? t.feeDays.replace('{days}', String(data.rentalDays)).replace('{total}', String(data.periodDays))
			: '';
	return `${fill(t.feeBase)}, ${t.feeKey.replace('{key}', data.managementFeeKey)}${days}`;
}

/**
 * Generate utility statement PDF
 */
async function generateStatementPDF(
	data: StatementPDFData,
	config: QRBillConfig,
	language: Language = 'de'
): Promise<Buffer> {
	const t = translations[language];

	// Pre-generate QR code if needed (to avoid async in Promise executor)
	let qrResult: Awaited<ReturnType<typeof generateQRBillForStatement>> | null = null;
	if (data.balance > 0) {
		try {
			const statementForQR: StatementForQRBill = {
				id: data.id,
				statementNumber: data.statementNumber,
				balance: data.balance.toString(),
				tenant: data.tenant
			};
			qrResult = await generateQRBillForStatement(statementForQR, config);
		} catch (qrError) {
			console.error('Failed to generate QR code:', qrError);
		}
	}

	return new Promise((resolve, reject) => {
		try {
			// Create PDF document (A4 size)
			const doc = new PDFDocument({
				size: 'A4',
				margins: { top: 50, bottom: 50, left: 50, right: 50 },
				info: { Title: `${t.title} ${data.statementNumber}` }
			});

			const chunks: Buffer[] = [];
			doc.on('data', (chunk: Buffer) => chunks.push(chunk));
			doc.on('end', () => resolve(Buffer.concat(chunks)));
			doc.on('error', reject);

			// Page dimensions
			const pageWidth = 595.28; // A4 width in points
			const _contentWidth = pageWidth - 100; // Minus margins (reserved for future use)

			// Colors
			const primaryColor = '#135bec';
			const textDark = '#111318';
			const textSecondary = '#616f89';
			const borderColor = '#dbdfe6';

			// ============= HEADER =============
			// Company info (top right)
			doc
				.fontSize(10)
				.fillColor(textSecondary)
				.text(config.companyName, 350, 50, { width: 195, align: 'right' })
				.text(config.address, 350, 65, { width: 195, align: 'right' })
				.text(`${config.postalCode} ${config.city}`, 350, 80, { width: 195, align: 'right' });

			// Title
			doc
				.fontSize(24)
				.fillColor(textDark)
				.font('Helvetica-Bold')
				.text(t.title, 50, 50);

			// Statement info
			doc
				.fontSize(10)
				.fillColor(textSecondary)
				.font('Helvetica')
				.text(`${t.statementNumber}: ${data.statementNumber}`, 50, 85)
				.text(`${t.statementDate}: ${formatDate(data.statementDate)}`, 50, 100);

			// Horizontal line
			doc
				.strokeColor(borderColor)
				.lineWidth(1)
				.moveTo(50, 125)
				.lineTo(545, 125)
				.stroke();

			// ============= TENANT & APARTMENT INFO =============
			let yPos = 145;

			// Tenant section
			doc
				.fontSize(12)
				.fillColor(primaryColor)
				.font('Helvetica-Bold')
				.text(t.tenant, 50, yPos);

			yPos += 20;
			doc
				.fontSize(10)
				.fillColor(textDark)
				.font('Helvetica')
				.text(`${data.tenant.firstName} ${data.tenant.lastName}`, 50, yPos);

			if (data.tenant.address) {
				yPos += 15;
				doc.text(data.tenant.address, 50, yPos);
			}
			if (data.tenant.postalCode && data.tenant.city) {
				yPos += 15;
				doc.text(`${data.tenant.postalCode} ${data.tenant.city}`, 50, yPos);
			}

			// Apartment/Building section (right column)
			let yPosRight = 145;
			doc
				.fontSize(12)
				.fillColor(primaryColor)
				.font('Helvetica-Bold')
				.text(t.apartment, 300, yPosRight);

			yPosRight += 20;
			doc
				.fontSize(10)
				.fillColor(textDark)
				.font('Helvetica')
				.text(`${t.apartment} ${data.apartment.number}`, 300, yPosRight)
				.text(`${t.floor}: ${formatFloor(data.apartment.floor, language)}`, 300, yPosRight + 15)
				.text(`${t.area}: ${data.apartment.area} ${t.sqm}`, 300, yPosRight + 30);

			yPosRight += 60;
			doc
				.fontSize(10)
				.fillColor(textSecondary)
				.text(data.building.name, 300, yPosRight)
				.text(data.building.address, 300, yPosRight + 15)
				.text(data.building.place, 300, yPosRight + 30);

			// ============= PERIOD INFO =============
			yPos = Math.max(yPos, yPosRight) + 65;

			doc
				.fontSize(12)
				.fillColor(primaryColor)
				.font('Helvetica-Bold')
				.text(t.period, 50, yPos);

			yPos += 20;
			doc
				.fontSize(10)
				.fillColor(textDark)
				.font('Helvetica')
				.text(`${formatDate(data.periodStart)} – ${formatDate(data.periodEnd)}`, 50, yPos)
				.text(
					`${t.rentalPeriod}: ${formatDate(data.rentalStart)} – ${formatDate(data.rentalEnd)} (${data.rentalDays} ${t.daysUnit})`,
					50,
					yPos + 15
				);
			yPos += 15;

			// ============= COST BREAKDOWN TABLE =============
			yPos += 40;

			doc
				.fontSize(12)
				.fillColor(primaryColor)
				.font('Helvetica-Bold')
				.text(t.costBreakdown, 50, yPos);

			yPos += 25;

			// Table header
			const col1 = 50;
			const col2 = 250;
			const col3 = 350;
			const col4 = 450;

			doc
				.fontSize(8)
				.fillColor(textSecondary)
				.font('Helvetica-Bold')
				.text(t.category, col1, yPos)
				.text(t.totalAmount, col2, yPos)
				.text(t.sharePercent, col3, yPos)
				.text(t.yourShare, col4, yPos, { width: 95, align: 'right' });

			// Header line
			yPos += 15;
			doc
				.strokeColor(borderColor)
				.moveTo(50, yPos)
				.lineTo(545, yPos)
				.stroke();

			yPos += 10;

			// Table rows
			doc.font('Helvetica').fontSize(9).fillColor(textDark);

			for (const item of data.lineItems) {
				doc
					.text(item.category, col1, yPos, { width: 190 })
					.text(formatCurrency(item.totalAmount), col2, yPos)
					.text(formatPercentage(item.sharePercentage), col3, yPos)
					.text(formatCurrency(item.tenantShare), col4, yPos, { width: 95, align: 'right' });

				yPos += 20;

				// Check for page break
				if (yPos > 650) {
					doc.addPage();
					yPos = 50;
				}
			}

			// The heating profile shares the heating costs by the months rented
			if (data.heating) {
				const percent = String(Math.round(data.heating.percent * 100) / 100);
				doc
					.fontSize(8)
					.fillColor(textSecondary)
					.text(t.heatingNote.replace('{profile}', data.heating.profile).replace('{percent}', percent), col1, yPos, { width: 495 });
				yPos = doc.y + 8;
				doc.fontSize(9).fillColor(textDark);
			}

			// Subtotal line
			doc
				.strokeColor(borderColor)
				.moveTo(50, yPos)
				.lineTo(545, yPos)
				.stroke();

			yPos += 10;
			doc
				.font('Helvetica-Bold')
				.text(t.subtotal, col1, yPos)
				.text(formatCurrency(data.subtotal), col4, yPos, { width: 95, align: 'right' });

			// Management fee
			if (data.managementFee > 0) {
				yPos += 20;
				doc
					.font('Helvetica')
					.text(formatCurrency(data.managementFee), col4, yPos, { width: 95, align: 'right' })
					.text(`${t.managementFee}: ${feeBasis(data, t)}`, col1, yPos, { width: 390 });
				yPos = doc.y - 10;
			}

			// Total costs
			yPos += 25;
			doc
				.strokeColor(textDark)
				.lineWidth(2)
				.moveTo(350, yPos)
				.lineTo(545, yPos)
				.stroke();

			yPos += 10;
			doc
				.fontSize(11)
				.font('Helvetica-Bold')
				.text(t.totalCosts, col1, yPos)
				.text(formatCurrency(data.totalCosts), col4, yPos, { width: 95, align: 'right' });

			// ============= BALANCE CALCULATION =============
			yPos += 40;

			doc
				.fontSize(10)
				.font('Helvetica')
				.fillColor(textDark)
				.text(t.advancePayments, col1, yPos)
				.text(`- ${formatCurrency(data.totalAdvancePayments)}`, col4, yPos, { width: 95, align: 'right' });

			yPos += 25;
			doc
				.strokeColor(primaryColor)
				.lineWidth(2)
				.moveTo(350, yPos)
				.lineTo(545, yPos)
				.stroke();

			yPos += 10;

			const isRefund = data.balance < 0;
			doc
				.fontSize(14)
				.font('Helvetica-Bold')
				.fillColor(isRefund ? '#10b981' : primaryColor)
				.text(isRefund ? t.refund : t.amountDue, col1, yPos)
				.text(formatCurrency(Math.abs(data.balance)), col4, yPos, { width: 95, align: 'right' });

			// Payment deadline
			if (data.paymentDeadline && !isRefund) {
				yPos += 30;
				doc
					.fontSize(10)
					.fillColor(textSecondary)
					.font('Helvetica')
					.text(`${t.paymentDeadline}: ${formatDate(data.paymentDeadline)}`, col1, yPos);
			}

			// ============= QR-BILL SECTION =============
			// Only include QR-bill if there's an amount due (positive balance)
			if (data.balance > 0) {
				// Add new page for QR-bill if not enough space
				if (yPos > 500) {
					doc.addPage();
				}

				// QR-bill starts at bottom of page or new page
				const qrBillY = 650;

				if (qrResult) {
					// The payment part fills the bottom of the page: no bottom margin, or pdfkit breaks every line onto a new page
					doc.page.margins.bottom = 0;

					// Perforation line
					doc
						.strokeColor(borderColor)
						.lineWidth(0.5)
						.dash(3, { space: 3 })
						.moveTo(0, qrBillY)
						.lineTo(pageWidth, qrBillY)
						.stroke()
						.undash();

					// Receipt section (left side, 62mm wide)
					const receiptX = 20;
					const receiptWidth = 176; // 62mm in points

					doc.fontSize(11).font('Helvetica-Bold').fillColor(textDark).text(t.receiptSection, receiptX, qrBillY + 15);

					// Headings and lines as in the QR code (SIX): creditor with IBAN, reference, debtor with address
					const creditor = [formatIBANForDisplay(config.iban), config.companyName, config.address, `${config.postalCode} ${config.city}`];
					const debtor = [
						`${data.tenant.firstName} ${data.tenant.lastName}`,
						data.tenant.address,
						[data.tenant.postalCode, data.tenant.city].filter(Boolean).join(' ')
					];
					const reference = qrResult.reference ? [formatQRReferenceForDisplay(qrResult.reference)] : [];
					const details = (x: number) => {
						let y = qrBillY + 35;
						for (const [heading, lines] of [
							[`${t.account} / ${t.payableTo}`, creditor],
							[t.reference, reference],
							[t.payableBy, debtor]
						] as const) {
							const printed = lines.filter(Boolean) as string[];
							if (printed.length === 0) continue;
							doc.fontSize(6).font('Helvetica-Bold').text(heading, x, y);
							y += 9;
							doc.fontSize(8).font('Helvetica');
							for (const line of printed) {
								doc.text(line, x, y, { lineBreak: false });
								y += 10;
							}
							y += 6;
						}
					};
					details(receiptX);

					doc.fontSize(6).font('Helvetica-Bold').text(t.currency, receiptX, qrBillY + 160).text(t.amount, receiptX + 40, qrBillY + 160);

					doc
						.fontSize(10)
						.font('Helvetica')
						.text('CHF', receiptX, qrBillY + 170)
						.text(data.balance.toFixed(2), receiptX + 40, qrBillY + 170);

					doc.fontSize(6).font('Helvetica-Bold').text(t.acceptancePoint, receiptX + 80, qrBillY + 183);

					// Vertical separator
					doc
						.strokeColor(borderColor)
						.lineWidth(0.5)
						.dash(3, { space: 3 })
						.moveTo(receiptX + receiptWidth, qrBillY)
						.lineTo(receiptX + receiptWidth, 842)
						.stroke()
						.undash();

					// Payment section (right side)
					const paymentX = receiptX + receiptWidth + 20;

					doc.fontSize(11).font('Helvetica-Bold').fillColor(textDark).text(t.qrBillSection, paymentX, qrBillY + 15);

					// QR code (46x46mm = ~130x130 points)
					doc.image(qrResult.qrCodeImage, paymentX, qrBillY + 35, { width: 130, height: 130 });

					// Swiss cross in center of QR (7x7mm)
					const qrCenterX = paymentX + 65 - 10;
					const qrCenterY = qrBillY + 35 + 65 - 10;
					doc
						.rect(qrCenterX, qrCenterY, 20, 20)
						.fillColor('white')
						.fill()
						.rect(qrCenterX + 2, qrCenterY + 2, 16, 16)
						.fillColor('black')
						.fill()
						.rect(qrCenterX + 4, qrCenterY + 7, 12, 6)
						.fillColor('white')
						.fill()
						.rect(qrCenterX + 7, qrCenterY + 4, 6, 12)
						.fillColor('white')
						.fill();

					// Amount below the QR code, the details on its right
					doc
						.fontSize(8)
						.fillColor(textDark)
						.font('Helvetica-Bold')
						.text(t.currency, paymentX, qrBillY + 170)
						.text(t.amount, paymentX + 50, qrBillY + 170)
						.font('Helvetica')
						.fontSize(10)
						.text('CHF', paymentX, qrBillY + 180)
						.text(data.balance.toFixed(2), paymentX + 50, qrBillY + 180);
					details(paymentX + 145);
				} else {
					// QR code generation failed - show basic payment info
					doc
						.fontSize(10)
						.fillColor(textSecondary)
						.text(t.paymentInfo, 50, qrBillY + 20)
						.text(`${t.account}: ${formatIBANForDisplay(config.iban)}`, 50, qrBillY + 40)
						.text(`${t.amount}: ${formatCurrency(data.balance)}`, 50, qrBillY + 55);
				}
			}

			// Finalize PDF
			doc.end();
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Generate PDF and return as Base64 string
 */
export async function generateStatementPDFBase64(
	data: StatementPDFData,
	config: QRBillConfig,
	language: Language = 'de'
): Promise<string> {
	const pdfBuffer = await generateStatementPDF(data, config, language);
	return pdfBuffer.toString('base64');
}
