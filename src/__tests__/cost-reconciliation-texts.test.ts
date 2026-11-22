import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// #1138: the texts of the Kostenabstimmung word for word as Fachreview 1138-1 wrote them (French with U+00A0)
const nbsp = ' ';
const texts = {
	de: {
		reconciliation_fee_row:
			'Verwaltungspauschale (bezahlen die Mieter zusätzlich zu «davon Mieter», sie steht Ihnen zu)',
		reconciliation_fuel_stock:
			'In «{position}» ist die Veränderung des Tankbestands enthalten: Anfangsbestand {opening}, Endbestand {closing}.',
		reconciliation_vacancy: 'Leerstand in dieser Abrechnungsperiode: {apartments}.',
		reconciliation_vacancy_apartment_one: 'Wohnung {number} ({days} Tag)',
		reconciliation_vacancy_apartment_many: 'Wohnung {number} ({days} Tage)'
	},
	fr: {
		reconciliation_fee_row: `Frais d’administration (payés par les locataires en plus de «${nbsp}dont locataires${nbsp}», ils vous reviennent)`,
		reconciliation_fuel_stock: `La variation du stock de combustible est comprise dans «${nbsp}{position}${nbsp}»${nbsp}: stock initial {opening}, stock final {closing}.`,
		reconciliation_vacancy: `Vacance pendant cette période de décompte${nbsp}: {apartments}.`,
		reconciliation_vacancy_apartment_one: 'appartement {number} ({days} jour)',
		reconciliation_vacancy_apartment_many: 'appartement {number} ({days} jours)'
	},
	it: {
		reconciliation_fee_row:
			'Spese amministrative (pagate dagli inquilini in aggiunta a «di cui inquilini», spettano a Lei)',
		reconciliation_fuel_stock:
			'La variazione della scorta di combustibile è compresa in «{position}»: scorta iniziale {opening}, scorta finale {closing}.',
		reconciliation_vacancy: 'Sfitto in questo periodo di conteggio: {apartments}.',
		reconciliation_vacancy_apartment_one: 'appartamento {number} ({days} giorno)',
		reconciliation_vacancy_apartment_many: 'appartamento {number} ({days} giorni)'
	},
	en: {
		reconciliation_fee_row:
			'Management fee (paid by the tenants on top of «of which tenants», it is yours)',
		reconciliation_fuel_stock:
			'«{position}» includes the change in fuel stock: opening stock {opening}, closing stock {closing}.',
		reconciliation_vacancy: 'Vacancy in this billing period: {apartments}.',
		reconciliation_vacancy_apartment_one: 'apartment {number} ({days} day)',
		reconciliation_vacancy_apartment_many: 'apartment {number} ({days} days)'
	}
};

// #1464: the texts of the Rechnungen under a position, word for word as Fachreview 1464-1 wrote them
const rowTexts = {
	de: {
		reconciliation_invoices_show: 'Rechnungen anzeigen',
		reconciliation_invoices_hide: 'Rechnungen ausblenden',
		reconciliation_invoices_show_of: 'Rechnungen anzeigen: {position}',
		reconciliation_invoices_hide_of: 'Rechnungen ausblenden: {position}',
		reconciliation_invoice_name: '{issuer}, Rechnung vom {date}',
		reconciliation_invoice_whole: 'ganz in dieser Periode',
		reconciliation_invoice_part: 'Rechnungsbetrag {amount}, Leistungszeitraum {start} – {end}, {days} von {total} Tagen in dieser Periode',
		reconciliation_stock_opening: 'Anfangsbestand',
		reconciliation_stock_closing: 'minus Endbestand',
		reconciliation_stock_date: 'Stichtag {date}',
		reconciliation_no_invoice: 'Für diese Position gibt es keine Rechnung mehr. Die Abrechnungen verrechnen sie noch.'
	},
	fr: {
		reconciliation_invoices_show: 'Afficher les factures',
		reconciliation_invoices_hide: 'Masquer les factures',
		reconciliation_invoices_show_of: `Afficher les factures${nbsp}: {position}`,
		reconciliation_invoices_hide_of: `Masquer les factures${nbsp}: {position}`,
		reconciliation_invoice_name: '{issuer}, facture du {date}',
		reconciliation_invoice_whole: 'entièrement dans cette période',
		reconciliation_invoice_part: 'Montant de la facture {amount}, période de prestation {start} – {end}, {days} sur {total} jours dans cette période',
		reconciliation_stock_opening: 'Stock initial',
		reconciliation_stock_closing: 'moins stock final',
		reconciliation_stock_date: 'Date de référence {date}',
		reconciliation_no_invoice: 'Il n’y a plus de facture pour ce poste. Les décomptes l’incluent encore.'
	},
	it: {
		reconciliation_invoices_show: 'Mostrare le fatture',
		reconciliation_invoices_hide: 'Nascondere le fatture',
		reconciliation_invoices_show_of: 'Mostrare le fatture: {position}',
		reconciliation_invoices_hide_of: 'Nascondere le fatture: {position}',
		reconciliation_invoice_name: '{issuer}, fattura del {date}',
		reconciliation_invoice_whole: 'interamente in questo periodo',
		reconciliation_invoice_part: 'Importo della fattura {amount}, periodo di prestazione {start} – {end}, {days} su {total} giorni in questo periodo',
		reconciliation_stock_opening: 'Scorta iniziale',
		reconciliation_stock_closing: 'meno scorta finale',
		reconciliation_stock_date: 'Data di riferimento {date}',
		reconciliation_no_invoice: 'Per questa voce non c’è più nessuna fattura. I conteggi la includono ancora.'
	},
	en: {
		reconciliation_invoices_show: 'Show invoices',
		reconciliation_invoices_hide: 'Hide invoices',
		reconciliation_invoices_show_of: 'Show invoices: {position}',
		reconciliation_invoices_hide_of: 'Hide invoices: {position}',
		reconciliation_invoice_name: '{issuer}, invoice dated {date}',
		reconciliation_invoice_whole: 'entirely in this period',
		reconciliation_invoice_part: 'Invoice amount {amount}, service period {start} – {end}, {days} of {total} days in this period',
		reconciliation_stock_opening: 'Opening stock',
		reconciliation_stock_closing: 'less closing stock',
		reconciliation_stock_date: 'Reading date {date}',
		reconciliation_no_invoice: 'There is no longer an invoice for this statement line. The statements still include it.'
	}
};

describe('Texte der Kostenabstimmung', () => {
	it.each(Object.entries(texts))('stehen auf %s wie im Fachreview 1138-1', (language, expected) => {
		const messages = JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
		const actual = Object.fromEntries(Object.keys(expected).map((key) => [key, messages[key]]));
		expect(actual).toEqual(expected);
	});

	it.each(Object.entries(rowTexts))('der Rechnungen einer Position stehen auf %s wie im Fachreview 1464-1', (language, expected) => {
		const messages = JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
		const actual = Object.fromEntries(Object.keys(expected).map((key) => [key, messages[key]]));
		expect(actual).toEqual(expected);
	});
});
