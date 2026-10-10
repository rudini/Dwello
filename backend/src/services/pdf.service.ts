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
 * Translation strings for each language; Romansh falls back to German for texts without a translation
 * TODO(fachlich prüfen): "Zeitanteil", "Anfangsbestand", "Endbestand" and "Heizmaterial" are not in the glossary
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
		heatingNote: 'Heizkosten nach Heizprofil «{profile}»: {percent} % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode',
		feeBase: '{percent} % von CHF {base}',
		feeKey: 'verteilt nach {key}',
		daysUnit: 'Mietstage',
		feeDays: ', für Ihre {days} von {total} Tagen',
		feeOwn: '{percent} % Ihrer Nebenkosten von CHF {base}',
		sqm: 'm²',
		keyColumn: 'Verteilschlüssel',
		apartmentShareColumn: 'Wohnungsanteil',
		timeShareColumn: 'Zeitanteil',
		yourCosts: 'Ihre Nebenkosten',
		pageOf: 'Seite {page} von {pages}',
		tenancyLine: 'Ihre Mietdauer: {start} – {end} ({days} Mietstage von {total} Tagen)',
		payBy: 'Bitte bezahlen Sie den Betrag bis {date} mit dem Zahlteil.',
		payNoDate: 'Bitte bezahlen Sie den Betrag mit dem Zahlteil.',
		refundNote: 'Wir zahlen Ihnen den Betrag zurück. Teilen Sie uns dafür Ihre Kontoverbindung mit, falls wir sie nicht kennen.',
		sharesNote: 'Wohnungsanteil: Kosten der Liegenschaft nach dem Verteilschlüssel. Zeitanteil: Ihre Mietstage in der Abrechnungsperiode, bei Heizkosten der Anteil nach dem Heizprofil.',
		heatingSection: 'Heiz- und Warmwasserkosten',
		fuelIntro: 'Abgerechnet wird das verbrauchte Heizmaterial, nicht der Einkauf.',
		fuelOpening: 'Anfangsbestand am {date}',
		fuelInvoices: '+ Rechnungen {category} in der Abrechnungsperiode',
		fuelClosing: '– Endbestand am {date}',
		fuelTotal: '= Heizkosten nach Verbrauch',
		notes: 'Hinweise',
		noteReceipts: 'Sie können die Belege einsehen. Melden Sie sich dafür bei {contact} (Art. 257b Abs. 2 OR).',
		noteHeating: 'Sie können eine detaillierte Abrechnung der Heizkosten und Auskunft über den Anfangs- und Endbestand des Heizmaterials verlangen (Art. 8 VMWG).',
		separate: 'Vor der Einzahlung abzutrennen',
		additionalInfo: 'Zusätzliche Informationen'
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
		payableTo: 'Payable à',
		payableBy: 'Payable par',
		acceptancePoint: 'Point de dépôt',
		statementNumber: 'N° de décompte',
		statementDate: 'Date du décompte',
		rentalPeriod: 'Votre période de location',
		heatingNote: 'Frais de chauffage selon le profil «{profile}» : {percent} % des frais de chauffage de votre logement pour la période de décompte',
		feeBase: '{percent} % de CHF {base}',
		feeKey: 'réparti selon {key}',
		daysUnit: 'jours',
		feeDays: ', pour vos {days} jours sur {total}',
		feeOwn: '{percent} % de vos frais accessoires de CHF {base}',
		sqm: 'm²',
		keyColumn: 'Clé de répartition',
		apartmentShareColumn: 'Part du logement',
		timeShareColumn: 'Part temporelle',
		yourCosts: 'Vos frais accessoires',
		pageOf: 'Page {page} sur {pages}',
		tenancyLine: 'Votre durée de bail : {start} – {end} ({days} jours sur {total})',
		payBy: 'Veuillez payer le montant d’ici au {date} avec la section paiement.',
		payNoDate: 'Veuillez payer le montant avec la section paiement.',
		refundNote: 'Nous vous remboursons le montant. Communiquez-nous vos coordonnées bancaires si nous ne les connaissons pas.',
		sharesNote: 'Part du logement : frais de l’immeuble selon la clé de répartition. Part temporelle : vos jours de location dans la période de décompte, pour le chauffage la part selon le profil de chauffage.',
		heatingSection: 'Frais de chauffage et d’eau chaude',
		fuelIntro: 'Est décompté le combustible consommé, non l’achat.',
		fuelOpening: 'Stock initial au {date}',
		fuelInvoices: '+ Factures {category} de la période de décompte',
		fuelClosing: '– Stock final au {date}',
		fuelTotal: '= Frais de chauffage selon la consommation',
		notes: 'Remarques',
		noteReceipts: 'Vous pouvez consulter les pièces justificatives. Adressez-vous à {contact} (art. 257b al. 2 CO).',
		noteHeating: 'Vous pouvez demander un décompte détaillé des frais de chauffage et des renseignements sur le stock initial et final de combustible (art. 8 OBLF).',
		separate: 'À détacher avant le versement',
		additionalInfo: 'Informations supplémentaires'
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
		payableTo: 'Pagabile a',
		payableBy: 'Pagabile da',
		acceptancePoint: 'Punto di accettazione',
		statementNumber: 'N. conteggio',
		statementDate: 'Data del conteggio',
		rentalPeriod: 'Il suo periodo di locazione',
		heatingNote: 'Spese di riscaldamento secondo il profilo «{profile}»: {percent} % delle spese di riscaldamento del suo appartamento nel periodo di conteggio',
		feeBase: '{percent} % di CHF {base}',
		feeKey: 'ripartito secondo {key}',
		daysUnit: 'giorni',
		feeDays: ', per i suoi {days} giorni su {total}',
		feeOwn: '{percent} % delle sue spese accessorie di CHF {base}',
		sqm: 'm²',
		keyColumn: 'Chiave di riparto',
		apartmentShareColumn: 'Quota appartamento',
		timeShareColumn: 'Quota temporale',
		yourCosts: 'Le sue spese accessorie',
		pageOf: 'Pagina {page} di {pages}',
		tenancyLine: 'Durata della sua locazione: {start} – {end} ({days} giorni su {total})',
		payBy: 'La preghiamo di pagare l’importo entro il {date} con la sezione pagamento.',
		payNoDate: 'La preghiamo di pagare l’importo con la sezione pagamento.',
		refundNote: 'Le rimborsiamo l’importo. Ci comunichi le sue coordinate bancarie se non le conosciamo.',
		sharesNote: 'Quota appartamento: spese dell’immobile secondo la chiave di riparto. Quota temporale: i suoi giorni di locazione nel periodo di conteggio, per il riscaldamento la quota secondo il profilo di riscaldamento.',
		heatingSection: 'Spese di riscaldamento e acqua calda',
		fuelIntro: 'Si conteggia il combustibile consumato, non l’acquisto.',
		fuelOpening: 'Scorta iniziale al {date}',
		fuelInvoices: '+ Fatture {category} del periodo di conteggio',
		fuelClosing: '– Scorta finale al {date}',
		fuelTotal: '= Spese di riscaldamento secondo il consumo',
		notes: 'Avvertenze',
		noteReceipts: 'Può consultare i giustificativi. Si rivolga a {contact} (art. 257b cpv. 2 CO).',
		noteHeating: 'Può chiedere un conteggio dettagliato delle spese di riscaldamento e informazioni sulla scorta iniziale e finale di combustibile (art. 8 OLAL).',
		separate: 'Da staccare prima del versamento',
		additionalInfo: 'Informazioni supplementari'
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
		heatingNote: 'Custs da stgaudament tenor il profil «{profile}»: {percent} % dals custs da stgaudament da Vossa abitaziun en la perioda da quint',
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
		qrBillSection: 'Payment part',
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
		heatingNote: 'Heating costs by heating profile «{profile}»: {percent}% of the heating costs of your apartment in the billing period',
		feeBase: '{percent}% of CHF {base}',
		feeKey: 'split by {key}',
		daysUnit: 'days',
		feeDays: ', for your {days} of {total} days',
		feeOwn: '{percent}% of your utility costs of CHF {base}',
		sqm: 'm²',
		keyColumn: 'Distribution key',
		apartmentShareColumn: 'Apartment share',
		timeShareColumn: 'Time share',
		yourCosts: 'Your utility costs',
		pageOf: 'Page {page} of {pages}',
		tenancyLine: 'Your tenancy: {start} – {end} ({days} of {total} days)',
		payBy: 'Please pay the amount by {date} using the payment part.',
		payNoDate: 'Please pay the amount using the payment part.',
		refundNote: 'We will refund the amount. Please send us your bank details if we do not have them.',
		sharesNote: 'Apartment share: the building’s costs by the distribution key. Time share: your days rented in the billing period, for heating the share by the heating profile.',
		heatingSection: 'Heating and hot water costs',
		fuelIntro: 'The fuel consumed is billed, not the fuel purchased.',
		fuelOpening: 'Opening stock on {date}',
		fuelInvoices: '+ Invoices {category} in the billing period',
		fuelClosing: '– Closing stock on {date}',
		fuelTotal: '= Heating costs by consumption',
		notes: 'Notes',
		noteReceipts: 'You may inspect the receipts. Please contact {contact} (Art. 257b para. 2 CO).',
		noteHeating: 'You may request a detailed heating cost statement and information on the opening and closing stock of fuel (Art. 8 VMWG).',
		separate: 'Separate before paying in',
		additionalInfo: 'Additional information'
	}
};

/**
 * Statement line item
 */
export interface LineItem {
	category: string;
	key?: string; // the distribution key, in the PDF's language
	totalAmount: number;
	apartmentShare?: number | null; // the apartment's part of the total by the key; none on older statements
	periodShare?: number | null; // 0-1: days rented, or the heating profile's share
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
	// A tank: the heating costs of its category are opening stock + invoices – closing stock
	fuel?: { category: string; openingDate: string; opening: number; invoices: number; closingDate: string; closing: number; total: number };
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

/** 1234.5 → 1 234.50: the amount in the payment part (SIX: space between thousands) */
const qrAmount = (amount: number) => formatCHF(amount).replace(/'/g, ' ');

/** 0.6694 → 66.94 % */
const formatShare = (share: number) => `${String(Math.round(share * 10000) / 100)} %`;

/** The floor as tenants write it: EG / 1. OG / 1. UG, RDC / 1er étage, PT / 1° piano, GF / 1st floor */
function formatFloor(floor: number, lang: Language): string {
	const n = Math.abs(floor);
	if (lang === 'fr') return floor === 0 ? 'rez-de-chaussée' : floor < 0 ? `${n}e sous-sol` : n === 1 ? '1er étage' : `${n}e étage`;
	if (lang === 'it') return floor === 0 ? 'pianterreno' : floor < 0 ? `${n}° piano interrato` : `${n}° piano`;
	if (lang === 'en') return floor === 0 ? 'ground floor' : floor < 0 ? `basement ${n}` : `floor ${n}`;
	return floor === 0 ? 'EG' : floor < 0 ? `${n}. UG` : `${n}. OG`;
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

const fill = (text: string, values: Record<string, string | number>) =>
	Object.entries(values).reduce((result, [key, value]) => result.split(`{${key}}`).join(String(value)), text);

// A4 in points; 20 mm margins left and right, the payment part takes the bottom 105 mm (SIX)
const PAGE = { width: 595.28, height: 841.89, left: 56.69, right: 538.59, top: 96, bottom: 790 };
const MM = 72 / 25.4;
const PAYMENT_PART = 105 * MM;
const COLORS = { ink: '#111318', muted: '#4b5563', line: '#9ca3af' };

type Doc = InstanceType<typeof PDFDocument>;
type Page = { doc: Doc; t: Record<string, string>; data: StatementPDFData; config: QRBillConfig; language: Language };

// Moves to a new page when the next block of this height does not fit; returns where it starts
function room(doc: Doc, y: number, height: number) {
	if (y + height <= PAGE.bottom) return y;
	doc.addPage();
	return PAGE.top;
}

function heading(doc: Doc, text: string, y: number) {
	const top = room(doc, y, 40);
	doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink).text(text, PAGE.left, top);
	return doc.y + 6;
}

// Recipient in the address field (right window, 45 mm from the top), the property and the apartment on the left
function addresses({ doc, t, data, language }: Page) {
	const top = 45 * MM;
	const tenant = [
		`${data.tenant.firstName} ${data.tenant.lastName}`.trim(),
		data.tenant.address,
		[data.tenant.postalCode, data.tenant.city].filter(Boolean).join(' ')
	].filter(Boolean) as string[];
	doc.font('Helvetica').fontSize(10).fillColor(COLORS.ink).text(tenant.join('\n'), 118 * MM, top, { width: 82 * MM });
	const apartment = `${t.apartment} ${data.apartment.number}, ${formatFloor(data.apartment.floor, language)}, ${data.apartment.area} ${t.sqm}`;
	doc
		.fontSize(9)
		.font('Helvetica-Bold')
		.text(t.building, PAGE.left, top)
		.font('Helvetica')
		.text([data.building.name, data.building.address, data.building.place, apartment].filter(Boolean).join('\n'), { width: 82 * MM });
	return Math.max(doc.y, top + 60) + 24;
}

// Title with the period, number and date, the tenant's days in the period
function title({ doc, t, data }: Page, y: number) {
	doc
		.font('Helvetica-Bold')
		.fontSize(16)
		.fillColor(COLORS.ink)
		.text(`${t.title} ${formatDate(data.periodStart)} – ${formatDate(data.periodEnd)}`, PAGE.left, y, { width: PAGE.right - PAGE.left });
	doc
		.font('Helvetica')
		.fontSize(9)
		.fillColor(COLORS.muted)
		.text(`${t.statementNumber} ${data.statementNumber} · ${t.statementDate} ${formatDate(data.statementDate)}`)
		.fillColor(COLORS.ink)
		.text(fill(t.tenancyLine, { start: formatDate(data.rentalStart), end: formatDate(data.rentalEnd), days: data.rentalDays, total: data.periodDays }));
	return doc.y + 14;
}

// The result first: what the tenant pays or gets back, and how it comes about
function balanceBox({ doc, t, data }: Page, y: number) {
	const isRefund = data.balance < 0;
	const width = PAGE.right - PAGE.left;
	const what = isRefund
		? t.refundNote
		: data.paymentDeadline
			? fill(t.payBy, { date: formatDate(data.paymentDeadline) })
			: t.payNoDate;
	const how = `${t.yourCosts} ${formatCurrency(data.totalCosts)} – ${t.advancePayments} ${formatCurrency(data.totalAdvancePayments)}`;
	doc.font('Helvetica').fontSize(9);
	const height = 46 + doc.heightOfString(what, { width: width - 24 }) + doc.heightOfString(how, { width: width - 24 });
	doc.lineWidth(1.5).strokeColor(COLORS.ink).rect(PAGE.left, y, width, height).stroke();
	doc
		.font('Helvetica-Bold')
		.fontSize(13)
		.text(isRefund ? t.refund : t.amountDue, PAGE.left + 12, y + 12)
		.text(formatCurrency(data.balance), PAGE.left + 12, y + 12, { width: width - 24, align: 'right' });
	doc
		.font('Helvetica')
		.fontSize(9)
		.text(what, PAGE.left + 12, y + 34, { width: width - 24 })
		.fillColor(COLORS.muted)
		.text(how, { width: width - 24 })
		.fillColor(COLORS.ink);
	return y + height + 20;
}

// Category | key | building's costs | apartment's share | time share | tenant's share
const COLUMNS = [
	{ x: PAGE.left, width: 118 },
	{ x: PAGE.left + 122, width: 92 },
	{ x: PAGE.left + 218, width: 66, align: 'right' as const },
	{ x: PAGE.left + 288, width: 66, align: 'right' as const },
	{ x: PAGE.left + 358, width: 52, align: 'right' as const },
	{ x: PAGE.left + 414, width: 67.9, align: 'right' as const }
];

function row(doc: Doc, cells: string[], y: number, bold = false) {
	doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5).fillColor(COLORS.ink);
	const height = Math.max(...cells.map((cell, i) => doc.heightOfString(cell, { width: COLUMNS[i].width })));
	const top = room(doc, y, height + 6);
	cells.forEach((cell, i) => doc.text(cell, COLUMNS[i].x, top, { width: COLUMNS[i].width, align: COLUMNS[i].align }));
	return top + height + 6;
}

function rule(doc: Doc, y: number, width = 0.5) {
	doc.lineWidth(width).strokeColor(COLORS.line).moveTo(PAGE.left, y).lineTo(PAGE.right, y).stroke();
}

function tableHeader({ doc, t }: Page, y: number) {
	doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.muted);
	const labels = [t.category, t.keyColumn, t.totalAmount, t.apartmentShareColumn, t.timeShareColumn, t.yourShare];
	const top = room(doc, y, 60);
	labels.forEach((label, i) => doc.text(label, COLUMNS[i].x, top, { width: COLUMNS[i].width, align: COLUMNS[i].align }));
	const bottom = top + Math.max(...labels.map((label, i) => doc.heightOfString(label, { width: COLUMNS[i].width }))) + 4;
	rule(doc, bottom);
	return bottom + 6;
}

// One line per category: how the building's costs come to the tenant
function costTable(page: Page, y: number) {
	const { doc, t, data } = page;
	let top = tableHeader(page, heading(doc, `${t.costBreakdown} (CHF)`, y));
	for (const item of data.lineItems) {
		const shares = [
			item.apartmentShare == null ? '–' : formatCHF(item.apartmentShare),
			item.periodShare == null ? '–' : formatShare(item.periodShare)
		];
		top = row(doc, [item.category, item.key ?? '–', formatCHF(item.totalAmount), ...shares, formatCHF(item.tenantShare)], top);
	}
	rule(doc, top - 2);
	top = row(doc, [t.subtotal, '', '', '', '', formatCHF(data.subtotal)], top + 2, true);
	if (data.managementFee > 0) {
		const width = COLUMNS[4].x + COLUMNS[4].width - PAGE.left;
		doc.font('Helvetica').fontSize(8.5);
		const height = doc.heightOfString(`${t.managementFee}: ${feeBasis(data, t)}`, { width });
		const at = room(doc, top, height + 6);
		doc.text(`${t.managementFee}: ${feeBasis(data, t)}`, PAGE.left, at, { width });
		doc.text(formatCHF(data.managementFee), COLUMNS[5].x, at, { width: COLUMNS[5].width, align: 'right' });
		top = at + height + 6;
	}
	rule(doc, top - 2, 1);
	top = row(doc, [t.yourCosts, '', '', '', '', formatCHF(data.totalCosts)], top + 2, true);
	top = row(doc, [t.advancePayments, '', '', '', '', `– ${formatCHF(data.totalAdvancePayments)}`], top);
	rule(doc, top - 2, 1);
	top = row(doc, [data.balance < 0 ? t.refund : t.amountDue, '', '', '', '', formatCHF(Math.abs(data.balance))], top + 2, true);
	doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.muted).text(t.sharesNote, PAGE.left, room(doc, top + 4, 30), { width: PAGE.right - PAGE.left });
	return doc.y + 18;
}

function amountLine(doc: Doc, label: string, amount: string, y: number, bold = false) {
	const top = room(doc, y, 16);
	doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(9).fillColor(COLORS.ink);
	doc.text(label, PAGE.left, top, { width: 340 }).text(amount, PAGE.right - 120, top, { width: 120, align: 'right' });
	return top + 15;
}

// Heating profile, and for a tank the consumption: opening stock + invoices – closing stock (Art. 5 VMWG)
function heatingSection({ doc, t, data }: Page, y: number) {
	if (!data.heating && !data.fuel) return y;
	let top = heading(doc, t.heatingSection, y);
	if (data.heating) {
		const percent = String(Math.round(data.heating.percent * 100) / 100);
		doc.font('Helvetica').fontSize(9).fillColor(COLORS.ink);
		doc.text(fill(t.heatingNote, { profile: data.heating.profile, percent }), PAGE.left, top, { width: PAGE.right - PAGE.left });
		top = doc.y + 8;
	}
	const fuel = data.fuel;
	if (!fuel) return top + 10;
	doc.font('Helvetica').fontSize(9).text(t.fuelIntro, PAGE.left, room(doc, top, 30), { width: PAGE.right - PAGE.left });
	top = doc.y + 6;
	top = amountLine(doc, fill(t.fuelOpening, { date: formatDate(fuel.openingDate) }), formatCurrency(fuel.opening), top);
	top = amountLine(doc, fill(t.fuelInvoices, { category: fuel.category }), formatCurrency(fuel.invoices), top);
	top = amountLine(doc, fill(t.fuelClosing, { date: formatDate(fuel.closingDate) }), formatCurrency(fuel.closing), top);
	return amountLine(doc, t.fuelTotal, formatCurrency(fuel.total), top, true) + 12;
}

// What the tenant may ask for: the receipts (Art. 257b Abs. 2 OR), the detailed heating statement (Art. 8 VMWG)
function notes({ doc, t, data, config }: Page, y: number) {
	const contact = `${config.companyName}, ${config.address}, ${config.postalCode} ${config.city}`;
	const lines = [fill(t.noteReceipts, { contact }), ...(data.heating || data.fuel ? [t.noteHeating] : [])];
	let top = heading(doc, t.notes, y);
	for (const line of lines) {
		doc.font('Helvetica').fontSize(9).fillColor(COLORS.ink);
		top = room(doc, top, doc.heightOfString(line, { width: PAGE.right - PAGE.left }) + 6);
		doc.text(line, PAGE.left, top, { width: PAGE.right - PAGE.left });
		top = doc.y + 6;
	}
	return top;
}

type QRResult = Awaited<ReturnType<typeof generateQRBillForStatement>>;

// One block of the payment part: heading and its lines (sizes: receipt 6/8 pt, payment part 8/10 pt)
function qrBlocks(doc: Doc, blocks: [string, (string | null | undefined)[]][], x: number, y: number, sizes: [number, number], width: number) {
	let top = y;
	for (const [label, lines] of blocks) {
		const printed = lines.filter(Boolean) as string[];
		if (printed.length === 0) continue;
		doc.font('Helvetica-Bold').fontSize(sizes[0]).text(label, x, top, { width, lineBreak: false });
		top += sizes[0] + 3;
		doc.font('Helvetica').fontSize(sizes[1]);
		for (const line of printed) {
			doc.text(line, x, top, { width, lineBreak: false });
			top += sizes[1] + 1.5;
		}
		top += sizes[1] * 0.6;
	}
}

function swissCross(doc: Doc, x: number, y: number) {
	const size = 7 * MM;
	const bar = size * 0.6;
	const thick = size * 0.19;
	doc.rect(x, y, size, size).fillColor('white').fill();
	doc.rect(x + size * 0.05, y + size * 0.05, size * 0.9, size * 0.9).fillColor('black').fill();
	doc.rect(x + (size - bar) / 2, y + (size - thick) / 2, bar, thick).fillColor('white').fill();
	doc.rect(x + (size - thick) / 2, y + (size - bar) / 2, thick, bar).fillColor('white').fill();
	doc.fillColor(COLORS.ink);
}

// Swiss QR-bill (SIX): receipt 62 mm and payment part 148 mm across the bottom 105 mm of the page
function paymentPart({ doc, t, data, config }: Page, qr: QRResult) {
	const top = PAGE.height - PAYMENT_PART;
	const receiptWidth = 62 * MM;
	doc.page.margins.bottom = 0; // printing down to the edge, or pdfkit breaks each line onto a new page
	doc.font('Helvetica').fontSize(7).fillColor(COLORS.ink).text(t.separate, 0, top - 12, { width: PAGE.width, align: 'center' });
	doc.lineWidth(0.5).strokeColor(COLORS.ink).dash(3, { space: 2 });
	doc.moveTo(0, top).lineTo(PAGE.width, top).stroke();
	doc.moveTo(receiptWidth, top).lineTo(receiptWidth, PAGE.height).stroke().undash();

	const creditor = [formatIBANForDisplay(config.iban), config.companyName, config.address, `${config.postalCode} ${config.city}`];
	const debtor = [
		`${data.tenant.firstName} ${data.tenant.lastName}`.trim(),
		data.tenant.address,
		[data.tenant.postalCode, data.tenant.city].filter(Boolean).join(' ')
	];
	const reference = qr.reference ? [formatQRReferenceForDisplay(qr.reference)] : [];
	const amount = qrAmount(data.balance);

	// Receipt
	const left = 5 * MM;
	doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink).text(t.receiptSection, left, top + 5 * MM, { lineBreak: false });
	qrBlocks(doc, [[`${t.account} / ${t.payableTo}`, creditor], [t.reference, reference], [t.payableBy, debtor]], left, top + 12 * MM, [6, 8], 52 * MM);
	doc.font('Helvetica-Bold').fontSize(6).text(t.currency, left, top + 68 * MM).text(t.amount, left + 12 * MM, top + 68 * MM);
	doc.font('Helvetica').fontSize(8).text('CHF', left, top + 71 * MM).text(amount, left + 12 * MM, top + 71 * MM, { lineBreak: false });
	doc.font('Helvetica-Bold').fontSize(6).text(t.acceptancePoint, left, top + 82 * MM, { width: 52 * MM, align: 'right' });

	// Payment part: title, QR code with the Swiss cross, amount; the details on the right
	const x = receiptWidth + 5 * MM;
	doc.font('Helvetica-Bold').fontSize(11).text(t.qrBillSection, x, top + 5 * MM, { lineBreak: false });
	doc.image(qr.qrCodeImage, x, top + 17 * MM, { width: 46 * MM, height: 46 * MM });
	swissCross(doc, x + 19.5 * MM, top + 36.5 * MM);
	doc.font('Helvetica-Bold').fontSize(8).text(t.currency, x, top + 68 * MM).text(t.amount, x + 14 * MM, top + 68 * MM);
	doc.font('Helvetica').fontSize(10).text('CHF', x, top + 72 * MM).text(amount, x + 14 * MM, top + 72 * MM, { lineBreak: false });
	qrBlocks(
		doc,
		[
			[`${t.account} / ${t.payableTo}`, creditor],
			[t.reference, reference],
			[t.additionalInfo, [`${t.title} ${data.statementNumber}`]],
			[t.payableBy, debtor]
		],
		receiptWidth + 56 * MM,
		top + 5 * MM,
		[8, 10],
		87 * MM
	);
}

// Without a QR code (it could not be made): the account to pay to
function paymentInfo({ doc, t, data, config }: Page, y: number) {
	let top = heading(doc, t.paymentInfo, y);
	top = amountLine(doc, t.account, formatIBANForDisplay(config.iban), top);
	return amountLine(doc, t.amount, formatCurrency(data.balance), top);
}

// Sender and page on every page; the property and period at the foot of pages without the payment part
function frame({ doc, t, data, config }: Page, qrPage: number | null) {
	const { start, count } = doc.bufferedPageRange();
	for (let i = start; i < start + count; i++) {
		doc.switchToPage(i);
		doc.page.margins.bottom = 0;
		doc.font('Helvetica').fontSize(8).fillColor(COLORS.muted);
		doc.text(`${config.companyName} · ${config.address} · ${config.postalCode} ${config.city}`, PAGE.left, 40, { width: 300, lineBreak: false });
		doc.text(`${data.statementNumber} · ${fill(t.pageOf, { page: i + 1, pages: count })}`, PAGE.right - 180, 40, { width: 180, align: 'right' });
		doc.lineWidth(0.5).strokeColor(COLORS.line).moveTo(PAGE.left, 54).lineTo(PAGE.right, 54).stroke();
		if (i === qrPage) continue;
		doc.text(`${data.building.name} · ${t.period} ${formatDate(data.periodStart)} – ${formatDate(data.periodEnd)}`, PAGE.left, PAGE.height - 40, {
			width: PAGE.right - PAGE.left,
			lineBreak: false
		});
	}
}

async function qrCodeFor(data: StatementPDFData, config: QRBillConfig): Promise<QRResult | null> {
	if (data.balance <= 0) return null;
	try {
		return await generateQRBillForStatement(
			{ id: data.id, statementNumber: data.statementNumber, balance: data.balance.toString(), tenant: data.tenant },
			config
		);
	} catch (qrError) {
		console.error('Failed to generate QR code:', qrError);
		return null;
	}
}

/**
 * Generate utility statement PDF: A4, header and footer on every page, the balance first, then how each cost is
 * shared, the heating costs and the tenant's rights; the QR-bill at the bottom of the last page for an amount due
 */
async function generateStatementPDF(data: StatementPDFData, config: QRBillConfig, language: Language = 'de'): Promise<Buffer> {
	const t = { ...translations.de, ...translations[language] };
	const qr = await qrCodeFor(data, config);

	return new Promise((resolve, reject) => {
		try {
			const doc = new PDFDocument({
				size: 'A4',
				bufferPages: true,
				margins: { top: PAGE.top, bottom: PAGE.height - PAGE.bottom, left: PAGE.left, right: PAGE.width - PAGE.right },
				info: { Title: `${t.title} ${data.statementNumber}` }
			});
			const chunks: Buffer[] = [];
			doc.on('data', (chunk: Buffer) => chunks.push(chunk));
			doc.on('end', () => resolve(Buffer.concat(chunks)));
			doc.on('error', reject);

			const page: Page = { doc, t, data, config, language };
			let y = title(page, addresses(page));
			y = balanceBox(page, y);
			y = costTable(page, y);
			y = heatingSection(page, y);
			y = notes(page, y);
			let qrPage: number | null = null;
			if (data.balance > 0 && qr) {
				if (y > PAGE.height - PAYMENT_PART - 24) doc.addPage();
				qrPage = doc.bufferedPageRange().count - 1;
				paymentPart(page, qr);
			} else if (data.balance > 0) {
				paymentInfo(page, y);
			}
			frame(page, qrPage);
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
