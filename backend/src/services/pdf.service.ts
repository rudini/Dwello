/**
 * PDF Generation Service
 * Generates professional utility statement PDFs with Swiss QR-bills
 *
 * Features:
 * - Multi-language support (DE, FR, IT, EN)
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
import { formatCHF, formatSwissDate, roundToRappen } from './pdf-format';
import { CodedError } from './coded-error';
import { countryLine, qrTown } from './postal-address';
import type { InvoicePart } from '../db/schema';

/**
 * Supported languages
 */
export type Language = 'de' | 'fr' | 'it' | 'en';


/**
 * Translation strings for each language (the languages SIX provides for the payment part)
 */
const translations: Record<Language, Record<string, string>> = {
	de: {
		title: 'Nebenkostenabrechnung',
		period: 'Abrechnungsperiode',
		apartment: 'Wohnung',
		building: 'Liegenschaft',
		costBreakdown: 'Kostenübersicht',
		category: 'Kategorie',
		totalAmount: 'Kosten Liegenschaft',
		yourShare: 'Ihr Anteil',
		subtotal: 'Zwischensumme',
		managementFee: 'Verwaltungspauschale',
		colon: ': ',
		advancePayments: 'Geleistete Akontobeiträge',
		rounding: 'Rundung auf 5 Rappen',
		beforeRounding: 'vor Rundung',
		roundedNote: 'auf 5 Rappen gerundet',
		amountDue: 'Nachzahlung',
		refund: 'Rückerstattung',
		balanced: 'Ausgeglichen',
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
		replacesNote: 'Diese Abrechnung ersetzt die Abrechnung {number} vom {date}. Diese gilt nicht mehr.',
		replacesPay: ': Bezahlen Sie nur noch den Saldo dieser Abrechnung.',
		priorPaid: 'Bereits bezahlt auf {numbers}',
		priorRefunded: 'Bereits zurückerstattet auf {numbers}',
		priorPaidShort: 'bereits bezahlt',
		priorRefundedShort: 'bereits zurückerstattet',
		and: 'und',
		heatingNote: 'Heizkosten nach Heizprofil «{profile}»: {percent} % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode',
		heatingMonths: 'Anteile der Monate Ihres Mietverhältnisses: {months}',
		heatingPeriodSums: '; zusammen {tenant}\u00a0%. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen {period}\u00a0%.',
		heatingPeriodMonths: '; zusammen {tenant}\u00a0%. Anteile der Monate der Abrechnungsperiode im Heizprofil: {months}; zusammen {period}\u00a0%. Anteil nach Heizprofil: {tenant}\u00a0% / {period}\u00a0% = {percent}\u00a0%.',
		months: 'Jan,Feb,Mär,Apr,Mai,Jun,Jul,Aug,Sep,Okt,Nov,Dez',
		feeOwn: '{percent} % der Zwischensumme von CHF {base}',
		sqm: 'm²',
		keyColumn: 'Verteilschlüssel',
		apartmentShareColumn: 'Wohnungsanteil',
		timeShareColumn: 'Zeitanteil',
		days: '{days}/{total} Tage',
		partNoPeriod: 'Ohne Leistungszeitraum{colon}CHF {amount}, Ihre Mietstage {days} von {total} Tagen der Abrechnungsperiode',
		partBeyond: 'Leistungszeitraum {wholeStart} – {wholeEnd} (Rechnung CHF {wholeAmount}), davon {start} – {end}{colon}CHF {amount}, Ihre Mietstage {days} von {total} Tagen',
		partStock: 'Veränderung Tankbestand {start} – {end}{colon}CHF {amount}, Ihre Mietstage {days} von {total} Tagen',
		partLine: 'Leistungszeitraum {start} – {end}{colon}CHF {amount}, Ihre Mietstage {days} von {total} Tagen',
		partShare: 'Ihr Anteil{colon}{apartment} × ({sum}) / {costs} = {share}',
		yourCosts: 'Ihre Nebenkosten',
		pageOf: 'Seite {page} von {pages}',
		tenancyLine: 'Ihr Mietverhältnis in dieser Periode: {start} – {end} ({days} Mietstage von {total} Tagen)',
		payBy: 'Bitte bezahlen Sie den Betrag bis {date} mit dem Zahlteil.',
		payNoDate: 'Bitte bezahlen Sie den Betrag mit dem Zahlteil.',
		paidOn: 'Bezahlt am {date}. Vielen Dank.',
		refundPaidOn: 'Überwiesen am {date}.',
		refundBy: 'Wir überweisen Ihnen den Betrag bis {date}.',
		refundNoDate: 'Wir überweisen Ihnen den Betrag.',
		refundAccount: 'Teilen Sie uns dafür Ihre IBAN mit, falls Sie das noch nicht getan haben.',
		balancedNote: 'Ihre Nebenkosten und Ihre Akontobeiträge sind gleich hoch. Sie müssen nichts bezahlen.',
		balancedRounded: 'Nach der Rundung auf 5 Rappen müssen Sie nichts bezahlen und erhalten nichts zurück.',
		sharesNote: 'Kosten Liegenschaft: die Rechnungen der Abrechnungsperiode; eine Rechnung mit Leistungszeitraum zählt mit den Tagen, die in die Periode fallen. Wohnungsanteil: Kosten der Liegenschaft nach dem Verteilschlüssel. Zeitanteil: Ihre Mietstage in der Abrechnungsperiode.{days}{parts} Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil.{rounded}{heating}',
		sharesNoteDays: ' Bei einer Rechnung mit Leistungszeitraum zählen Ihre Mietstage in diesem Zeitraum.',
		sharesNoteParts: ' Hat eine Abrechnungsposition Rechnungen über verschiedene Tage, steht die Berechnung darunter.',
		sharesNoteRounded: ' Der Prozentwert ist gerundet; Ihr Anteil folgt aus der Berechnung unter der Position.',
		sharesNoteHeating: ' Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.',
		sharesNoteFuel: 'Kosten Liegenschaft bei Heizmaterial aus dem Tank: der Verbrauch (siehe Heiz- und Warmwasserkosten).',
		heatingSection: 'Heiz- und Warmwasserkosten',
		fuelIntro: 'Abgerechnet wird das verbrauchte Heizmaterial, nicht der Einkauf.',
		fuelOpening: 'Anfangsbestand am {date}',
		fuelInvoices: '+ Rechnungen «{category}» in der Abrechnungsperiode',
		fuelClosing: '– Endbestand am {date}',
		fuelTotal: '= Heizkosten nach Verbrauch',
		notes: 'Hinweise',
		noteReceipts: 'Sie oder eine bevollmächtigte Person können die Belege einsehen. Melden Sie sich dafür bei {contact} (Art. 257b Abs. 2 OR).',
		noteHeating: 'Sie können eine detaillierte Abrechnung der Heiz- und Warmwasserkosten verlangen (Art. 8 Abs. 1 VMWG).',
		noteStock: 'Über den Anfangs- und Endbestand des Heizmaterials erhalten Sie Auskunft (Art. 8 Abs. 2 VMWG).',
		separate: 'Vor der Einzahlung abzutrennen',
		additionalInfo: 'Zusätzliche Informationen'
	},
	fr: {
		title: 'Décompte des charges',
		period: 'Période de décompte',
		apartment: 'Appartement',
		building: 'Immeuble',
		costBreakdown: 'Aperçu des coûts',
		category: 'Catégorie',
		totalAmount: 'Coûts de l’immeuble',
		yourShare: 'Votre part',
		subtotal: 'Sous-total',
		managementFee: 'Frais de gestion',
		colon: '\u00a0: ',
		advancePayments: 'Acomptes versés',
		rounding: 'Arrondi à 5 centimes',
		beforeRounding: 'avant arrondi',
		roundedNote: 'arrondi à 5 centimes',
		amountDue: 'Montant à payer',
		refund: 'Remboursement',
		balanced: 'Solde nul',
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
		replacesNote: 'Ce décompte remplace le décompte {number} du {date}. Celui-ci n’est plus valable.',
		replacesPay: '\u00a0: payez uniquement le solde du présent décompte.',
		priorPaid: 'Déjà payé sur {numbers}',
		priorRefunded: 'Déjà remboursé sur {numbers}',
		priorPaidShort: 'déjà payé',
		priorRefundedShort: 'déjà remboursé',
		and: 'et',
		heatingNote: 'Frais de chauffage selon le profil «\u00a0{profile}\u00a0»\u00a0: {percent}\u00a0% des frais de chauffage de votre logement pour la période de décompte',
		heatingMonths: 'Parts des mois de votre bail\u00a0: {months}',
		heatingPeriodSums: '\u00a0; au total {tenant}\u00a0%. Les mois de la période de décompte totalisent {period}\u00a0% dans le profil de chauffage.',
		heatingPeriodMonths: '\u00a0; au total {tenant}\u00a0%. Parts des mois de la période de décompte dans le profil de chauffage\u00a0: {months}\u00a0; au total {period}\u00a0%. Part selon le profil de chauffage\u00a0: {tenant}\u00a0% / {period}\u00a0% = {percent}\u00a0%.',
		months: 'janv.,févr.,mars,avr.,mai,juin,juil.,août,sept.,oct.,nov.,déc.',
		feeOwn: '{percent}\u00a0% du sous-total de CHF {base}',
		keyColumn: 'Clé de répartition',
		apartmentShareColumn: 'Part du logement',
		timeShareColumn: 'Part temporelle',
		days: '{days}/{total} jours',
		partNoPeriod: 'Sans période de prestation{colon}CHF {amount}, vos jours de location {days} sur {total} jours de la période de décompte',
		partBeyond: 'Période de prestation {wholeStart} – {wholeEnd} (facture CHF {wholeAmount}), dont {start} – {end}{colon}CHF {amount}, vos jours de location {days} sur {total}',
		partStock: 'Variation du stock de combustible {start} – {end}{colon}CHF {amount}, vos jours de location {days} sur {total}',
		partLine: 'Période de prestation {start} – {end}{colon}CHF {amount}, vos jours de location {days} sur {total}',
		partShare: 'Votre part{colon}{apartment} × ({sum}) / {costs} = {share}',
		yourCosts: 'Vos frais accessoires',
		pageOf: 'Page {page} sur {pages}',
		tenancyLine: 'Votre bail pendant la période : {start} – {end} ({days} jours sur {total})',
		payBy: 'Veuillez payer le montant au plus tard le {date} au moyen de la section paiement.',
		payNoDate: 'Veuillez payer le montant au moyen de la section paiement.',
		paidOn: 'Payé le {date}. Merci.',
		refundPaidOn: 'Versé le {date}.',
		refundBy: 'Nous vous verserons le montant au plus tard le {date}.',
		refundNoDate: 'Nous vous verserons le montant.',
		refundAccount: 'Pour ce faire, veuillez nous communiquer votre IBAN si vous ne l’avez pas encore fait.',
		balancedNote: 'Vos frais accessoires et vos acomptes sont égaux. Vous n’avez rien à payer.',
		balancedRounded: 'Après l’arrondi à 5 centimes, vous n’avez rien à payer et ne recevez rien.',
		sharesNote: 'Coûts de l’immeuble\u00a0: les factures de la période de décompte\u00a0; une facture avec période de prestation compte pour les jours compris dans la période. Part du logement\u00a0: coûts de l’immeuble selon la clé de répartition. Part temporelle\u00a0: vos jours de location dans la période de décompte.{days}{parts} Votre part est la part du logement multipliée par la part temporelle.{rounded}{heating}',
		sharesNoteDays: ' Pour une facture avec période de prestation, ce sont vos jours de location dans cette période qui comptent.',
		sharesNoteParts: ' Si un poste du décompte comporte des factures sur des jours différents, le calcul figure en dessous.',
		sharesNoteRounded: ' Le pourcentage est arrondi\u00a0; votre part découle du calcul sous le poste.',
		sharesNoteHeating: ' Pour les frais de chauffage, la part temporelle est la part selon le profil de chauffage.',
		sharesNoteFuel: 'Coûts de l’immeuble pour le combustible en citerne\u00a0: la consommation (voir «\u00a0Frais de chauffage et d’eau chaude\u00a0»).',
		heatingSection: 'Frais de chauffage et d’eau chaude',
		fuelIntro: 'Le décompte porte sur le combustible consommé et non sur les achats.',
		fuelOpening: 'Stock initial au {date}',
		fuelInvoices: '+ Factures «\u00a0{category}\u00a0» de la période de décompte',
		fuelClosing: '– Stock final au {date}',
		fuelTotal: '= Frais de chauffage selon la consommation',
		notes: 'Remarques',
		noteReceipts: 'Vous-même ou une personne mandatée pouvez consulter les pièces justificatives. Adressez-vous à {contact} (art. 257b al. 2 CO).',
		noteHeating: 'Vous pouvez demander un décompte détaillé des frais de chauffage et d’eau chaude (art. 8 al. 1 OBLF).',
		noteStock: 'Vous pouvez obtenir des renseignements sur les stocks initial et final de combustible (art. 8 al. 2 OBLF).',
		separate: 'À détacher avant le versement',
		additionalInfo: 'Informations supplémentaires'
	},
	it: {
		title: 'Conteggio spese accessorie',
		period: 'Periodo di conteggio',
		apartment: 'Appartamento',
		building: 'Immobile',
		costBreakdown: 'Riepilogo costi',
		category: 'Categoria',
		totalAmount: 'Costi immobile',
		yourShare: 'La sua quota',
		subtotal: 'Subtotale',
		managementFee: 'Spese di gestione',
		colon: ': ',
		advancePayments: 'Acconti versati',
		rounding: 'Arrotondamento a 5 centesimi',
		beforeRounding: 'prima dell’arrotondamento',
		roundedNote: 'arrotondato a 5 centesimi',
		amountDue: 'Importo dovuto',
		refund: 'Rimborso',
		balanced: 'In pareggio',
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
		replacesNote: 'Questo conteggio sostituisce il conteggio {number} del {date}. Quest’ultimo non è più valido.',
		replacesPay: ': paghi solo il saldo di questo conteggio.',
		priorPaid: 'Già pagato su {numbers}',
		priorRefunded: 'Già rimborsato su {numbers}',
		priorPaidShort: 'già pagato',
		priorRefundedShort: 'già rimborsato',
		and: 'e',
		heatingNote: 'Spese di riscaldamento secondo il profilo «{profile}»: {percent} % delle spese di riscaldamento del suo appartamento nel periodo di conteggio',
		heatingMonths: 'Quote dei mesi della sua locazione: {months}',
		heatingPeriodSums: '; in totale {tenant}\u00a0%. I mesi del periodo di conteggio totalizzano {period}\u00a0% nel profilo di riscaldamento.',
		heatingPeriodMonths: '; in totale {tenant}\u00a0%. Quote dei mesi del periodo di conteggio nel profilo di riscaldamento: {months}; in totale {period}\u00a0%. Quota secondo il profilo di riscaldamento: {tenant}\u00a0% / {period}\u00a0% = {percent}\u00a0%.',
		months: 'gen,feb,mar,apr,mag,giu,lug,ago,set,ott,nov,dic',
		feeOwn: '{percent} % del subtotale di CHF {base}',
		keyColumn: 'Chiave di riparto',
		apartmentShareColumn: 'Quota appartamento',
		timeShareColumn: 'Quota temporale',
		days: '{days}/{total} giorni',
		partNoPeriod: 'Senza periodo di prestazione{colon}CHF {amount}, i suoi giorni di locazione {days} su {total} giorni del periodo di conteggio',
		partBeyond: 'Periodo di prestazione {wholeStart} – {wholeEnd} (fattura CHF {wholeAmount}), di cui {start} – {end}{colon}CHF {amount}, i suoi giorni di locazione {days} su {total}',
		partStock: 'Variazione della scorta di combustibile {start} – {end}{colon}CHF {amount}, i suoi giorni di locazione {days} su {total}',
		partLine: 'Periodo di prestazione {start} – {end}{colon}CHF {amount}, i suoi giorni di locazione {days} su {total}',
		partShare: 'La sua quota{colon}{apartment} × ({sum}) / {costs} = {share}',
		yourCosts: 'Le sue spese accessorie',
		pageOf: 'Pagina {page} di {pages}',
		tenancyLine: 'La sua locazione in questo periodo: {start} – {end} ({days} giorni su {total})',
		payBy: 'La preghiamo di pagare l’importo entro il {date} tramite la sezione pagamento.',
		payNoDate: 'La preghiamo di pagare l’importo tramite la sezione pagamento.',
		paidOn: 'Pagato il {date}. Grazie.',
		refundPaidOn: 'Bonificato il {date}.',
		refundBy: 'Le bonifichiamo l’importo entro il {date}.',
		refundNoDate: 'Le bonifichiamo l’importo.',
		refundAccount: 'Ci comunichi il suo IBAN, se non l’ha già fatto.',
		balancedNote: 'Le sue spese accessorie corrispondono ai suoi acconti. Non deve pagare nulla.',
		balancedRounded: 'Dopo l’arrotondamento a 5 centesimi non deve pagare nulla né riceve alcun rimborso.',
		sharesNote: 'Costi immobile: le fatture del periodo di conteggio; una fattura con periodo di prestazione conta per i giorni compresi nel periodo. Quota appartamento: costi dell’immobile secondo la chiave di riparto. Quota temporale: i suoi giorni di locazione nel periodo di conteggio.{days}{parts} La sua quota è la quota appartamento moltiplicata per la quota temporale.{rounded}{heating}',
		sharesNoteDays: ' Per una fattura con periodo di prestazione contano i suoi giorni di locazione in tale periodo.',
		sharesNoteParts: ' Se una voce del conteggio comprende fatture su giorni diversi, il calcolo figura sotto.',
		sharesNoteRounded: ' La percentuale è arrotondata; la sua quota risulta dal calcolo sotto la voce.',
		sharesNoteHeating: ' Per le spese di riscaldamento la quota temporale è la quota secondo il profilo di riscaldamento.',
		sharesNoteFuel: 'Costi immobile per il combustibile in cisterna: il consumo (vedi spese di riscaldamento e acqua calda).',
		heatingSection: 'Spese di riscaldamento e acqua calda',
		fuelIntro: 'Si conteggia il combustibile consumato, non quello acquistato.',
		fuelOpening: 'Scorta iniziale al {date}',
		fuelInvoices: '+ Fatture «{category}» del periodo di conteggio',
		fuelClosing: '– Scorta finale al {date}',
		fuelTotal: '= Spese di riscaldamento secondo il consumo',
		notes: 'Osservazioni',
		noteReceipts: 'Lei o una persona da lei incaricata può consultare i giustificativi. Si rivolga a {contact} (art. 257b cpv. 2 CO).',
		noteHeating: 'Può chiedere un conteggio dettagliato delle spese di riscaldamento e acqua calda (art. 8 cpv. 1 OLAL).',
		noteStock: 'Può ottenere informazioni sulla scorta iniziale e finale di combustibile (art. 8 cpv. 2 OLAL).',
		separate: 'Da staccare prima del versamento',
		additionalInfo: 'Informazioni supplementari'
	},
	en: {
		title: 'Utility Cost Statement',
		period: 'Billing period',
		apartment: 'Apartment',
		building: 'Building',
		costBreakdown: 'Cost overview',
		category: 'Category',
		totalAmount: 'Building costs',
		yourShare: 'Your share',
		subtotal: 'Subtotal',
		managementFee: 'Management fee',
		colon: ': ',
		advancePayments: 'Advance payments made',
		rounding: 'Rounding to 5 centimes',
		beforeRounding: 'before rounding',
		roundedNote: 'rounded to 5 centimes',
		amountDue: 'Amount due',
		refund: 'Refund',
		balanced: 'Nil balance',
		paymentInfo: 'Payment information',
		qrBillSection: 'Payment part',
		receiptSection: 'Receipt',
		currency: 'Currency',
		amount: 'Amount',
		account: 'Account',
		reference: 'Reference',
		payableTo: 'Payable to',
		payableBy: 'Payable by',
		acceptancePoint: 'Acceptance point',
		statementNumber: 'Statement no.',
		statementDate: 'Statement date',
		replacesNote: 'This statement replaces statement {number} of {date}. That statement no longer applies.',
		replacesPay: ': pay only the balance of this statement.',
		priorPaid: 'Already paid on {numbers}',
		priorRefunded: 'Already refunded on {numbers}',
		priorPaidShort: 'already paid',
		priorRefundedShort: 'already refunded',
		and: 'and',
		heatingNote: 'Heating costs under the heating profile ‘{profile}’: {percent} % of your apartment’s heating costs for the billing period',
		heatingMonths: 'Monthly shares during your tenancy: {months}',
		heatingPeriodSums: '; in total {tenant}\u00a0%. The months of the billing period total {period}\u00a0% in the heating profile.',
		heatingPeriodMonths: '; in total {tenant}\u00a0%. Monthly shares of the billing period in the heating profile: {months}; in total {period}\u00a0%. Share under the heating profile: {tenant}\u00a0% / {period}\u00a0% = {percent}\u00a0%.',
		months: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec',
		feeOwn: '{percent} % of the subtotal of CHF {base}',
		keyColumn: 'Distribution key',
		apartmentShareColumn: 'Apartment share',
		timeShareColumn: 'Time share',
		days: '{days}/{total} days',
		partNoPeriod: 'Without a service period{colon}CHF {amount}, your days rented {days} of {total} days of the billing period',
		partBeyond: 'Service period {wholeStart} – {wholeEnd} (invoice CHF {wholeAmount}), of which {start} – {end}{colon}CHF {amount}, your days rented {days} of {total}',
		partStock: 'Change in fuel stock {start} – {end}{colon}CHF {amount}, your days rented {days} of {total}',
		partLine: 'Service period {start} – {end}{colon}CHF {amount}, your days rented {days} of {total}',
		partShare: 'Your share{colon}{apartment} × ({sum}) / {costs} = {share}',
		yourCosts: 'Your utility costs',
		pageOf: 'Page {page} of {pages}',
		tenancyLine: 'Your tenancy in this period: {start} – {end} ({days} of {total} days)',
		payBy: 'Please pay the amount by {date} using the payment part.',
		payNoDate: 'Please pay the amount using the payment part.',
		paidOn: 'Paid on {date}. Thank you.',
		refundPaidOn: 'Transferred on {date}.',
		refundBy: 'We will transfer the amount to you by {date}.',
		refundNoDate: 'We will transfer the amount to you.',
		refundAccount: 'Please send us your IBAN if you have not already done so.',
		balancedNote: 'Your utility costs equal your advance payments. You do not need to pay anything.',
		balancedRounded: 'After rounding to 5 centimes, you have nothing to pay and nothing will be refunded.',
		sharesNote: 'Building costs: the invoices for the billing period; an invoice with a service period counts only for its days within the period. Apartment share: your apartment’s part of the building costs under the distribution key. Time share: your days rented in the billing period.{days}{parts} Your share is the apartment share multiplied by the time share.{rounded}{heating}',
		sharesNoteDays: ' For an invoice with a service period, your days rented within that period count.',
		sharesNoteParts: ' If a statement line has invoices over different days, the calculation is shown below it.',
		sharesNoteRounded: ' The percentage is rounded; your share follows from the calculation below the line.',
		sharesNoteHeating: ' For heating costs, the time share is the share under the heating profile.',
		sharesNoteFuel: 'Building costs for fuel from a tank: the fuel consumed (see ‘Heating and hot water costs’).',
		heatingSection: 'Heating and hot water costs',
		fuelIntro: 'The fuel consumed is billed, not the fuel purchased.',
		fuelOpening: 'Opening stock on {date}',
		fuelInvoices: '+ Invoices for ‘{category}’ in the billing period',
		fuelClosing: '– Closing stock on {date}',
		fuelTotal: '= Heating costs based on consumption',
		notes: 'Notes',
		noteReceipts: 'You or a person you authorise may inspect the supporting documents. To do so, please contact {contact} (Art. 257b para. 2 CO).',
		noteHeating: 'You may request a detailed statement of the heating and hot water costs (Art. 8 para. 1 VMWG).',
		noteStock: 'You may ask for information on the opening and closing fuel stock (Art. 8 para. 2 VMWG).',
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
	keyShare?: string; // the apartment's part by the key: "75.50 / 492.50 m²", or a percentage for a mixed key
	totalAmount: number;
	apartmentShare?: number | null; // the apartment's part of the total by the key; none on older statements
	periodShare?: number | null; // 0-1: days rented, or the heating profile's share
	shareDays?: { days: number; total: number }; // the period share as days, when the statement stored them (#208)
	invoiceParts?: InvoicePart[] | null; // the invoices of a position over different days, with their days (#226)
	byProfile?: boolean; // shared by the heating profile, not by days
	heating?: boolean; // a heating cost: the tenant may ask for the detailed heating statement (Art. 8 Abs. 1 VMWG)
	tenantShare: number;
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
		country?: string | null;
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
	// the heating profile and its share; the months of a tenancy over part of the period with their shares
	heating?: {
		profile: string;
		percent: number;
		months?: { month: number; percentage: number }[];
		periodPercent?: number;
		periodMonths?: { month: number; percentage: number }[];
	};
	// A tank: the heating costs of its category are opening stock + invoices – closing stock
	fuel?: { category: string; openingDate: string; opening: number; invoices: number; closingDate: string; closing: number; total: number };

	// Totals
	subtotal: number;
	managementFee: number;
	managementFeePercent: number;
	totalCosts: number;
	totalAdvancePayments: number;
	balance: number; // Positive = tenant owes, negative = refund
	// a berichtigte Abrechnung: the statement it replaces and what was paid on the replaced ones, a refund negative (#120)
	replaces?: { statementNumber: string; statementDate: string; paidOn: string[]; priorPayments: number };

	// Payment info
	paymentDeadline?: string;
	paidDate?: string; // paid: no payment part, or the tenant pays twice
}

/** CHF 1'234.56 */
const formatCurrency = (amount: number) => `CHF ${formatCHF(Math.abs(amount))}`;

const formatDate = formatSwissDate;

/** 1234.5 → 1 234.50: the amount in the payment part (SIX: space between thousands) */
const qrAmount = (amount: number) => formatCHF(amount).replace(/'/g, ' ');

/** 0.6694 → 66.94 % (always two places) */
const formatShare = (share: number) => `${(Math.round(share * 10000) / 100).toFixed(2)} %`;

// Windows-1252 beyond ASCII and Latin-1: what the standard fonts can print
const WIN_ANSI = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
const NEAREST: Record<string, string> = { Ł: 'L', ł: 'l', Đ: 'D', đ: 'd', ı: 'i', '−': '-', '→': '->' };
const printable = (char: string) => char <= '\x7f' || (char >= '\xa0' && char <= '\xff') || WIN_ANSI.includes(char);

/** Names and categories with characters the standard fonts lack: "Łukasz Dragoș" → "Lukasz Dragos" */
function winAnsi(text: string) {
	return [...text]
		.map((char) => {
			if (printable(char)) return char;
			const plain = char.normalize('NFD').replace(/[̀-ͯ]/g, '');
			return [...plain].every(printable) ? plain : (NEAREST[char] ?? '?');
		})
		.join('');
}

// The floor as tenants write it: ground floor, above, below
const FLOORS: Record<Language, [string, (n: number) => string, (n: number) => string]> = {
	de: ['EG', (n) => `${n}. OG`, (n) => `${n}. UG`],
	fr: ['rez-de-chaussée', (n) => (n === 1 ? '1er étage' : `${n}e étage`), (n) => (n === 1 ? '1er sous-sol' : `${n}e sous-sol`)],
	it: ['pianterreno', (n) => `${n}° piano`, (n) => `${n}° piano interrato`],
	en: ['ground floor', (n) => `floor ${n}`, (n) => `basement ${n}`]
};

function formatFloor(floor: number, lang: Language): string {
	const [ground, above, below] = FLOORS[lang];
	return floor === 0 ? ground : floor > 0 ? above(floor) : below(-floor);
}

const fill = (text: string, values: Record<string, string | number>) =>
	Object.entries(values).reduce((result, [key, value]) => result.split(`{${key}}`).join(String(value)), text);

// The base of the management fee: the subtotal, the tenant's own costs
const feeBasis = (data: StatementPDFData, t: Record<string, string>) =>
	fill(t.feeOwn, { percent: data.managementFeePercent, base: formatCHF(data.subtotal) });

// The time share as the tenant can check it: his days in the days billed (#208); without stored days (a statement
// created before, or a position over different days) the days rented / days of the period where the share is exactly
// that (a contract over the whole period bears every day), else the percentage; the heating profile's share as one
function timeShare(item: LineItem, data: StatementPDFData, t: Record<string, string>) {
	if (item.periodShare == null) return '–';
	if (!item.byProfile && item.shareDays) return fill(t.days, item.shareDays);
	if (item.invoiceParts) return formatShare(item.periodShare); // the invoices under it give the share (#226, C-5)
	const byDays = !item.byProfile && Math.abs(item.periodShare - data.rentalDays / data.periodDays) < 0.00005;
	return byDays ? fill(t.days, { days: data.rentalDays, total: data.periodDays }) : formatShare(item.periodShare);
}

// A4 in points; 20 mm margins left and right, the payment part takes the bottom 105 mm (SIX)
const PAGE = { width: 595.28, height: 841.89, left: 56.69, right: 538.59, top: 96, bottom: 790 };
const MM = 72 / 25.4;
const PAYMENT_PART = 105 * MM;
const COLORS = { ink: '#111318', muted: '#4b5563', line: '#9ca3af' };

type Doc = InstanceType<typeof PDFDocument>;
type Page = { doc: Doc; t: Record<string, string>; data: StatementPDFData; config: QRBillConfig; language: Language };

// Moves to a new page when the next block of this height does not fit; returns where it starts (after a repeated
// table header, if any)
function room(doc: Doc, y: number, height: number, header?: (y: number) => number) {
	if (y + height <= PAGE.bottom) return y;
	doc.addPage();
	return header ? header(PAGE.top) : PAGE.top;
}

function heading(doc: Doc, text: string, y: number, keep = 40) {
	const top = room(doc, y, keep);
	doc.font('Helvetica-Bold').fontSize(11).fillColor(COLORS.ink).text(text, PAGE.left, top);
	return doc.y + 6;
}

// Recipient in the address field (right window, 45 mm from the top), the property and the apartment on the left
function addresses({ doc, t, data, language }: Page) {
	const top = 45 * MM;
	const tenant = [
		`${data.tenant.firstName} ${data.tenant.lastName}`.trim(),
		data.tenant.address,
		[data.tenant.postalCode, data.tenant.city].filter(Boolean).join(' '),
		countryLine(data.tenant.country)
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
	// the tenant still has the replaced statement and its payment part: it no longer applies (Fachreview W2e V-2)
	if (data.replaces) {
		const note = fill(t.replacesNote, { number: data.replaces.statementNumber, date: formatDate(data.replaces.statementDate) });
		const pay = data.balance > 0 && !data.paidDate;
		doc.font('Helvetica-Bold').text(pay ? note.replace(/\.$/, t.replacesPay) : note).font('Helvetica');
	}
	return doc.y + 14;
}

// What the balance asks the tenant to do: pay with the payment part, wait for the refund, or nothing
function balanceText({ t, data }: Page) {
	const date = data.paymentDeadline && formatDate(data.paymentDeadline);
	if (data.balance === 0) return rounding(data) ? t.balancedRounded : t.balancedNote; // settled when sent
	if (data.paidDate) return fill(data.balance < 0 ? t.refundPaidOn : t.paidOn, { date: formatDate(data.paidDate) });
	if (data.balance < 0) return `${date ? fill(t.refundBy, { date }) : t.refundNoDate} ${t.refundAccount}`;
	return date ? fill(t.payBy, { date }) : t.payNoDate;
}

// The Saldo is rounded to 5 Rappen. Read top to bottom: the amount before rounding, its rounding as «+ 0.02» or
// «– 0.02» (seen from the amount shown, so a refund that grows gets +), the Saldo; only a real rounding is shown
const priorOf = (data: StatementPDFData) => data.replaces?.priorPayments ?? 0;
const unrounded = (data: StatementPDFData) => roundToRappen(data.totalCosts - data.totalAdvancePayments - priorOf(data));
// Rows from the subtotal to the Saldo, kept on one page
const totalRows = (data: StatementPDFData, t: Record<string, string>) => (rounding(data) ? 6 : 4) + (priorLine(data, t) ? 1 : 0);
const priorRow = (doc: Doc, prior: ReturnType<typeof priorLine>, top: number) => (prior ? row(doc, total(prior.label, prior.amount), top) : top);
// «Bereits bezahlt auf NK-… und NK-…», or what the landlord already refunded
function priorLine(data: StatementPDFData, t: Record<string, string>) {
	const prior = priorOf(data);
	if (!prior) return null;
	const paidOn = data.replaces!.paidOn;
	const numbers = paidOn.length > 1 ? `${paidOn.slice(0, -1).join(', ')} ${t.and} ${paidOn.at(-1)}` : paidOn.join('');
	return {
		label: fill(prior > 0 ? t.priorPaid : t.priorRefunded, { numbers }),
		short: `${prior > 0 ? '–' : '+'} ${prior > 0 ? t.priorPaidShort : t.priorRefundedShort} ${formatCurrency(prior)}`,
		amount: `${prior > 0 ? '–' : '+'} ${formatCHF(Math.abs(prior))}`
	};
}
function rounding(data: StatementPDFData) {
	const difference = roundToRappen(Math.abs(data.balance) - Math.abs(unrounded(data)));
	return Math.abs(data.balance - unrounded(data)) < 0.05 ? difference : 0;
}
const labelOf = (balance: number, t: Record<string, string>) => (balance === 0 ? t.balanced : balance < 0 ? t.refund : t.amountDue);
const signed = (amount: number) => `${amount > 0 ? '+' : '–'} ${formatCHF(Math.abs(amount))}`;

const balanceLabel = ({ t, data }: Page) => labelOf(data.balance, t);

// The result first: what the tenant pays or gets back, and how it comes about
function balanceBox(page: Page, y: number) {
	const { doc, t, data } = page;
	const width = PAGE.right - PAGE.left;
	const what = balanceText(page);
	const rounded = rounding(data) ? `, ${t.roundedNote}` : '';
	const prior = priorLine(data, t);
	const how = `${t.yourCosts} ${formatCurrency(data.totalCosts)} – ${t.advancePayments} ${formatCurrency(data.totalAdvancePayments)}${prior ? ` ${prior.short}` : ''}${rounded}`;
	doc.font('Helvetica').fontSize(9);
	const height = 46 + doc.heightOfString(what, { width: width - 24 }) + doc.heightOfString(how, { width: width - 24 });
	doc.lineWidth(1.5).strokeColor(COLORS.ink).rect(PAGE.left, y, width, height).stroke();
	doc
		.font('Helvetica-Bold')
		.fontSize(13)
		.text(balanceLabel(page), PAGE.left + 12, y + 12)
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
	{ x: PAGE.left, width: 112 },
	{ x: PAGE.left + 116, width: 104 },
	{ x: PAGE.left + 224, width: 62, align: 'right' as const },
	{ x: PAGE.left + 290, width: 62, align: 'right' as const },
	{ x: PAGE.left + 356, width: 60, align: 'right' as const },
	{ x: PAGE.left + 420, width: 61.9, align: 'right' as const }
];

function rule(doc: Doc, y: number, width = 0.5) {
	doc.lineWidth(width).strokeColor(COLORS.line).moveTo(PAGE.left, y).lineTo(PAGE.right, y).stroke();
}

const rowHeight = (doc: Doc, cells: string[]) => Math.max(...cells.map((cell, i) => doc.heightOfString(cell, { width: COLUMNS[i].width })));

function row(doc: Doc, cells: string[], y: number, options: { bold?: boolean; header?: (y: number) => number; above?: number } = {}) {
	doc.font(options.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5).fillColor(COLORS.ink);
	const height = rowHeight(doc, cells);
	const top = room(doc, y, height + 6, options.header);
	if (options.above) rule(doc, top - 2, options.above); // the line above a total stays with it
	doc.font(options.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5).fillColor(COLORS.ink);
	cells.forEach((cell, i) => doc.text(cell, COLUMNS[i].x, top, { width: COLUMNS[i].width, align: COLUMNS[i].align }));
	return top + height + 6;
}

function tableHeader({ doc, t }: Page, y: number) {
	doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COLORS.muted);
	const labels = [t.category, t.keyColumn, t.totalAmount, t.apartmentShareColumn, t.timeShareColumn, t.yourShare];
	labels.forEach((label, i) => doc.text(label, COLUMNS[i].x, y, { width: COLUMNS[i].width, align: COLUMNS[i].align }));
	const bottom = y + Math.max(...labels.map((label, i) => doc.heightOfString(label, { width: COLUMNS[i].width }))) + 4;
	rule(doc, bottom);
	return bottom + 6;
}

const total = (label: string, amount: string) => [label, '', '', '', '', amount];

// One line per category: how the building's costs come to the tenant
function costTable(page: Page, y: number) {
	const { doc, t, data } = page;
	const header = (at: number) => tableHeader(page, at);
	let top = header(room(doc, heading(doc, `${t.costBreakdown} (CHF)`, y, 90), 60));
	for (const item of data.lineItems) {
		const key = [item.key ?? '–', item.keyShare].filter(Boolean).join('\n');
		const share = item.apartmentShare == null ? '–' : formatCHF(item.apartmentShare);
		const cells = [item.category, key, formatCHF(item.totalAmount), share, timeShare(item, data, t), formatCHF(item.tenantShare)];
		const parts = partLines(item, t);
		// the invoices stay on the page of their position (#226)
		if (parts.length) top = room(doc, top, positionHeight(doc, cells, parts), header);
		top = row(doc, cells, top, { header });
		top = partsBelow(doc, parts, top);
	}
	// Subtotal to balance stay on one page: the balance alone on the next page lost its derivation
	const width = COLUMNS[4].x + COLUMNS[4].width - PAGE.left;
	const fee = `${t.managementFee}${t.colon}${feeBasis(data, t)}`;
	doc.font('Helvetica-Bold').fontSize(8.5);
	const feeHeight = data.managementFee > 0 ? doc.heightOfString(fee, { width }) + 6 : 0;
	top = room(doc, top, totalRows(data, t) * (doc.heightOfString(t.subtotal) + 8) + feeHeight);
	top = row(doc, total(t.subtotal, formatCHF(data.subtotal)), top + 2, { bold: true, above: 0.5 });
	if (feeHeight) {
		doc.font('Helvetica').fontSize(8.5);
		doc.text(fee, PAGE.left, top, { width });
		doc.text(formatCHF(data.managementFee), COLUMNS[5].x, top, { width: COLUMNS[5].width, align: 'right' });
		top += feeHeight;
	}
	top = row(doc, total(t.yourCosts, formatCHF(data.totalCosts)), top + 2, { bold: true, above: 1 });
	top = row(doc, total(t.advancePayments, `– ${formatCHF(data.totalAdvancePayments)}`), top);
	top = priorRow(doc, priorLine(data, t), top);
	if (rounding(data)) {
		const before = `${labelOf(unrounded(data), t)} ${t.beforeRounding}`;
		top = row(doc, total(before, formatCHF(Math.abs(unrounded(data)))), top + 2, { above: 1 });
		top = row(doc, total(t.rounding, signed(rounding(data))), top);
	}
	top = row(doc, total(balanceLabel(page), formatCHF(Math.abs(data.balance))), top + 2, { bold: true, above: 1 });
	const note = sharesNote(data, t);
	doc.font('Helvetica').fontSize(7.5);
	const height = doc.heightOfString(note, { width: PAGE.right - PAGE.left });
	doc.fillColor(COLORS.muted).text(note, PAGE.left, room(doc, top + 4, height), { width: PAGE.right - PAGE.left });
	return doc.y + 18;
}

// The invoices of a position over different days and the sum that weighs them by amount (#226): the tenant recomputes
// the Zeitanteil, and «Ihr Anteil» as Wohnungsanteil × that sum
function partLines(item: LineItem, t: Record<string, string>) {
	if (!item.invoiceParts || item.apartmentShare == null) return [];
	const lines = item.invoiceParts.map((part) => fill(t[partText(part)], partValues(part, t.colon)));
	const sum = item.invoiceParts.map((part) => `${formatCHF(part.amount)} × ${part.days}/${part.total}`).join(' + ');
	const share = { apartment: formatCHF(item.apartmentShare), sum, costs: formatCHF(item.totalAmount), share: formatCHF(item.tenantShare), colon: t.colon };
	return [...lines, fill(t.partShare, share)];
}

// An invoice line says what its dates are: the Leistungszeitraum, the part of one beyond the period, or none (#241);
// the change of the Tankbestand is no invoice and says so (#239)
const partText = (part: InvoicePart) =>
	part.fuelStock ? 'partStock' : part.noPeriod ? 'partNoPeriod' : part.whole ? 'partBeyond' : 'partLine';
const partValues = ({ start, end, amount, days, total, whole }: InvoicePart, colon: string) => ({
	start: formatDate(start),
	end: formatDate(end),
	amount: formatCHF(amount),
	days,
	total,
	colon,
	...(whole && { wholeStart: formatDate(whole.start), wholeEnd: formatDate(whole.end), wholeAmount: formatCHF(whole.amount) })
});

const PARTS_WIDTH = COLUMNS[4].x + COLUMNS[4].width - COLUMNS[0].x - 8;

function positionHeight(doc: Doc, cells: string[], lines: string[]) {
	doc.font('Helvetica').fontSize(8.5);
	const height = rowHeight(doc, cells) + 6;
	doc.fontSize(7.5);
	return height + doc.heightOfString(lines.join('\n'), { width: PARTS_WIDTH }) + 3;
}

function partsBelow(doc: Doc, lines: string[], y: number) {
	if (!lines.length) return y;
	doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.muted);
	const text = lines.join('\n');
	doc.text(text, COLUMNS[0].x + 8, y - 3, { width: PARTS_WIDTH });
	return y - 3 + doc.heightOfString(text, { width: PARTS_WIDTH }) + 6;
}

// How the shares are reached; the heating clause only where a line is shared by the profile, not by days (#137)
function sharesNote(data: StatementPDFData, t: Record<string, string>) {
	// a fraction over other days than the period's: the days a Leistungszeitraum bills in it (#208), also in the lines
	// of invoices over different days, weighted by amount (#226)
	const parts = data.lineItems.some((item) => item.invoiceParts);
	const otherDays = parts || data.lineItems.some((item) => !item.byProfile && item.shareDays && item.shareDays.total !== data.periodDays);
	const shares = fill(t.sharesNote, {
		days: otherDays ? t.sharesNoteDays : '',
		parts: parts ? t.sharesNoteParts : '',
		rounded: parts ? t.sharesNoteRounded : '',
		heating: data.lineItems.some((item) => item.byProfile) ? t.sharesNoteHeating : ''
	});
	return data.fuel ? `${shares} ${t.sharesNoteFuel}` : shares;
}

// A long label wraps and pushes the next line down
function amountLine(doc: Doc, label: string, amount: string, y: number, bold = false) {
	doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(9).fillColor(COLORS.ink);
	doc.text(label, PAGE.left, y, { width: 340 }).text(amount, PAGE.right - 120, y, { width: 120, align: 'right' });
	return y + Math.max(15, doc.heightOfString(label, { width: 340 }) + 4);
}

// The heating profile's share, with the months of a tenancy over part of the period
function heatingLines({ t, data }: Page) {
	if (!data.heating) return [];
	const { profile, percent, months, periodPercent, periodMonths } = data.heating;
	const names = t.months.split(',');
	const shown = (Math.round(percent * 100) / 100).toFixed(2);
	const lines = [fill(t.heatingNote, { profile, percent: shown })];
	if (!months?.length || percent >= 100) return lines;
	// no line break inside one month («Jun 3.70 %»)
	const list = (shares: { month: number; percentage: number }[]) =>
		shares.map((m) => `${names[m.month - 1]}\u00a0${m.percentage.toFixed(2)}\u00a0%`).join(', ');
	// a period whose months do not carry 100 % (under a year): both sums, from the printed months (#229); since #232 the
	// period's months and the division the share comes from
	const sum = (months.reduce((total, m) => total + Math.round(m.percentage * 100), 0) / 100).toFixed(2);
	const period = periodPercent?.toFixed(2) ?? '';
	const sums =
		periodPercent == null || periodPercent === 100
			? ''
			: periodMonths
				? fill(t.heatingPeriodMonths, { tenant: sum, months: list(periodMonths), period, percent: shown })
				: fill(t.heatingPeriodSums, { tenant: sum, period });
	lines.push(fill(t.heatingMonths, { months: list(months) }) + sums);
	return lines;
}

// Heating profile, and for a tank the consumption: opening stock + invoices – closing stock (Art. 5 VMWG); kept on
// one page
function heatingSection(page: Page, y: number) {
	const { doc, t, data } = page;
	if (!data.heating && !data.fuel) return y;
	const lines = heatingLines(page);
	const fuel = data.fuel;
	const amounts: [string, number][] = fuel
		? [
				[fill(t.fuelOpening, { date: formatDate(fuel.openingDate) }), fuel.opening],
				[fill(t.fuelInvoices, { category: fuel.category }), fuel.invoices],
				[fill(t.fuelClosing, { date: formatDate(fuel.closingDate) }), fuel.closing],
				[t.fuelTotal, fuel.total]
			]
		: [];
	const width = PAGE.right - PAGE.left;
	doc.font('Helvetica').fontSize(9);
	const height =
		[...lines, fuel ? t.fuelIntro : ''].reduce((sum, line) => sum + doc.heightOfString(line, { width }) + 8, 0) +
		amounts.reduce((sum, [label]) => sum + Math.max(15, doc.heightOfString(label, { width: 340 }) + 4), 0);
	let top = heading(doc, t.heatingSection, y, height + 30);
	for (const line of lines) {
		doc.font('Helvetica').fontSize(9).fillColor(COLORS.ink).text(line, PAGE.left, top, { width });
		top = doc.y + 8;
	}
	if (!fuel) return top + 10;
	doc.text(t.fuelIntro, PAGE.left, top, { width });
	top = doc.y + 6;
	amounts.forEach(([label, amount], i) => (top = amountLine(doc, label, formatCurrency(amount), top, i === amounts.length - 1)));
	return top + 12;
}

// What the tenant may ask for: the receipts (Art. 257b Abs. 2 OR), the detailed heating statement and the stock
// (Art. 8 VMWG); kept on one page
function notes({ doc, t, data, config }: Page, y: number) {
	const contact = `${config.companyName}, ${config.address}, ${config.postalCode} ${config.city}`;
	const lines = [fill(t.noteReceipts, { contact }), ...(data.fuel || data.lineItems.some((item) => item.heating) ? [t.noteHeating] : []), ...(data.fuel ? [t.noteStock] : [])];
	const width = PAGE.right - PAGE.left;
	doc.font('Helvetica').fontSize(9);
	const height = lines.reduce((sum, line) => sum + doc.heightOfString(line, { width }) + 6, 0);
	let top = heading(doc, t.notes, y, height + 30);
	for (const line of lines) {
		doc.font('Helvetica').fontSize(9).fillColor(COLORS.ink).text(line, PAGE.left, top, { width });
		top = doc.y + 6;
	}
	return top;
}

type QRResult = Awaited<ReturnType<typeof generateQRBillForStatement>>;

// The blocks of the payment part, each heading with its lines; a long line wraps and pushes the next down
// (sizes: receipt 6/8 pt, payment part 8/10 pt)
function qrBlocks(doc: Doc, blocks: [string, (string | null | undefined)[]][], x: number, y: number, sizes: [number, number], width: number) {
	let top = y;
	for (const [label, lines] of blocks) {
		const printed = lines.filter(Boolean) as string[];
		if (printed.length === 0) continue;
		doc.font('Helvetica-Bold').fontSize(sizes[0]).text(label, x, top, { width });
		top = doc.y + 1;
		doc.font('Helvetica').fontSize(sizes[1]);
		for (const line of printed) {
			doc.text(line, x, top, { width });
			top = doc.y + 0.5;
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

// Swiss QR-bill (SIX): receipt 62 mm and payment part 148 mm across the bottom 105 mm of the page; the printed
// details are those in the QR code
function paymentPart(
	{ doc, t, config }: Pick<Page, 'doc' | 't' | 'config'>,
	qr: QRResult,
	balance: number
) {
	const top = PAGE.height - PAYMENT_PART;
	const receiptWidth = 62 * MM;
	doc.page.margins.bottom = 0; // printing down to the edge, or pdfkit breaks each line onto a new page
	doc.font('Helvetica').fontSize(7).fillColor(COLORS.ink).text(t.separate, 0, top - 12, { width: PAGE.width, align: 'center' });
	doc.lineWidth(0.5).strokeColor(COLORS.ink).dash(3, { space: 2 });
	doc.moveTo(0, top).lineTo(PAGE.width, top).stroke();
	doc.moveTo(receiptWidth, top).lineTo(receiptWidth, PAGE.height).stroke().undash();

	const { qrData } = qr;
	const creditor = [formatIBANForDisplay(config.iban), config.companyName, config.address, `${config.postalCode} ${config.city}`];
	// the QR code names the debtor only with name, postal code and town
	const debtor = qrData.debtorPostalCode && qrData.debtorCity ? [qrData.debtorName, qrData.debtorStreet, qrTown(qrData.debtorPostalCode, qrData.debtorCity, qrData.debtorCountry)] : [];
	const reference = qr.reference ? [formatQRReferenceForDisplay(qr.reference)] : [];
	const amount = qrAmount(balance);

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
	const details: [string, (string | null | undefined)[]][] = [
		[`${t.account} / ${t.payableTo}`, creditor],
		[t.reference, reference],
		[t.additionalInfo, [qrData.unstructuredMessage]],
		[t.payableBy, debtor]
	];
	qrBlocks(doc, details, receiptWidth + 56 * MM, top + 5 * MM, [8, 10], 87 * MM);
}

/**
 * The QR-bill of a statement's open Saldo at the foot of the letter's page, e.g. a reminder (#108): the statement's
 * reference and message, labels in the tenant's language; a new page when the letter reaches into it
 */
export async function addPaymentPart(
	doc: Doc,
	statement: Omit<StatementForQRBill, 'title'>,
	config: QRBillConfig,
	language: Language
) {
	const t = { ...translations.de, ...translations[language] };
	const qr = await generateQRBillForStatement({ ...statement, title: t.title }, config);
	if (doc.y > PAGE.height - PAYMENT_PART - 16) doc.addPage(); // above the line and «Vor der Einzahlung abzutrennen»
	paymentPart({ doc, t, config }, qr, Number(statement.balance));
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
		const sender = `${config.companyName} · ${config.address} · ${config.postalCode} ${config.city}`;
		doc.text(sender, PAGE.left, 40, { width: 290, height: 10, ellipsis: true, lineBreak: false });
		doc.text(`${data.statementNumber} · ${fill(t.pageOf, { page: i + 1, pages: count })}`, PAGE.right - 180, 40, { width: 180, align: 'right' });
		doc.lineWidth(0.5).strokeColor(COLORS.line).moveTo(PAGE.left, 54).lineTo(PAGE.right, 54).stroke();
		if (i === qrPage) continue;
		doc.text(`${data.building.name} · ${t.period} ${formatDate(data.periodStart)} – ${formatDate(data.periodEnd)}`, PAGE.left, PAGE.height - 40, {
			width: PAGE.right - PAGE.left,
			lineBreak: false
		});
	}
}

// Only an amount still due gets a payment part: not a refund, not a balance of 0, not a statement already paid
async function qrCodeFor(data: StatementPDFData, config: QRBillConfig, t: Record<string, string>): Promise<QRResult | null> {
	if (data.balance <= 0 || data.paidDate) return null;
	try {
		return await generateQRBillForStatement(
			{ id: data.id, statementNumber: data.statementNumber, balance: data.balance.toString(), tenant: data.tenant, title: t.title },
			config
		);
	} catch (qrError) {
		if (qrError instanceof CodedError) throw qrError; // an invalid IBAN: no PDF without its payment part
		console.error('Failed to generate QR code:', qrError);
		return null;
	}
}

// Every text goes through `winAnsi`: the standard fonts print Windows-1252 only
function printableDoc(doc: Doc) {
	const text = doc.text.bind(doc);
	const heightOfString = doc.heightOfString.bind(doc);
	doc.text = ((value: unknown, ...rest: unknown[]) =>
		(text as (...args: unknown[]) => Doc)(typeof value === 'string' ? winAnsi(value) : value, ...rest)) as Doc['text'];
	doc.heightOfString = ((value: string, options?: object) => heightOfString(winAnsi(value), options)) as Doc['heightOfString'];
	return doc;
}

/**
 * Generate utility statement PDF: A4, header and footer on every page, the balance first, then how each cost is
 * shared, the heating costs and the tenant's rights; the QR-bill at the bottom of the last page for an amount due
 */
async function generateStatementPDF(data: StatementPDFData, config: QRBillConfig, language: Language = 'de'): Promise<Buffer> {
	const t = { ...translations.de, ...translations[language] };
	const qr = await qrCodeFor(data, config, t);

	return new Promise((resolve, reject) => {
		try {
			const doc = printableDoc(
				new PDFDocument({
					size: 'A4',
					bufferPages: true,
					margins: { top: PAGE.top, bottom: PAGE.height - PAGE.bottom, left: PAGE.left, right: PAGE.width - PAGE.right },
					info: { Title: `${t.title} ${data.statementNumber}` }
				})
			);
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
			if (qr) {
				if (y > PAGE.height - PAYMENT_PART - 24) doc.addPage();
				qrPage = doc.bufferedPageRange().count - 1;
				paymentPart(page, qr, data.balance);
			} else if (data.balance > 0 && !data.paidDate) {
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
