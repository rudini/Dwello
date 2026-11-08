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

describe('Texte der Kostenabstimmung', () => {
	it.each(Object.entries(texts))('stehen auf %s wie im Fachreview 1138-1', (language, expected) => {
		const messages = JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
		const actual = Object.fromEntries(Object.keys(expected).map((key) => [key, messages[key]]));
		expect(actual).toEqual(expected);
	});
});
