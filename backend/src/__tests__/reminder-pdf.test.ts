import { describe, expect, it } from 'bun:test';
import { consentLetter } from '../services/consent-letter';
import { reminderLetter } from '../services/reminder-letter';
import { renderReminderPdf } from '../services/reminder-pdf';
import { readPdf } from './helpers/pdf-text';

const letter = reminderLetter({
	level: 1,
	statementNumber: 'NK-2024-0007',
	periodStart: '2024-01-01',
	periodEnd: '2024-12-31',
	balance: 245.5,
	deadline: '2025-03-31',
	tenant: { firstName: 'Anna', lastName: 'Keller' },
	sender: { name: 'Verwaltung Muster AG', iban: 'CH93 0076 2011 6238 5295 7' }
});
const sender = { name: 'Verwaltung Muster AG', address: 'Bahnhofstrasse 1', postalCode: '8001', city: 'Zürich' };
const textOf = async (recipient: Parameters<typeof renderReminderPdf>[2]) =>
	readPdf(await renderReminderPdf(letter, sender, recipient, '01.04.2025')).flowing;

describe('Adresse im Mahnschreiben', () => {
	// Post ins Ausland: das Land in Grossbuchstaben als letzte Zeile (#102); in der Schweiz kein Land
	it('nennt das Land einer Korrespondenzadresse im Ausland', async () => {
		const abroad = { name: 'Anna Keller', address: 'Marktstätte 3', postalCode: '78462', city: 'Konstanz', country: 'DE' };

		expect(await textOf(abroad)).toContain('Anna Keller Marktstätte 3 78462 Konstanz DEUTSCHLAND');
		expect(await textOf({ ...abroad, country: 'CH' })).not.toContain('SCHWEIZ');
	});
});

// #465 (code review 465-1 C-3): the reminder embeds the statement's font, so every character prints as entered
describe('Zeichen im Mahnschreiben', () => {
	it('druckt einen Namen mit Sonderzeichen so, wie er erfasst ist', async () => {
		expect(await textOf({ name: 'Łukasz Dragoș', address: 'Seeweg 15', postalCode: '6003', city: 'Luzern' })).toContain('Łukasz Dragoș Seeweg 15');
	});
});

// #521 (persona Helga P-3): the tenant signs the text he agrees to; one page holds the agreement and its signatures
describe('Zustimmung im Brief zur neuen Abrechnungsperiode', () => {
	it('druckt den Teil zur Zustimmung samt Unterschriftszeilen auf einer Seite', async () => {
		const consent = consentLetter({
			earlier: 'july-june',
			type: 'calendar',
			short: { start: '2025-07-01', end: '2025-12-31' },
			contractEnd: null,
			date: '2026-11-01',
			apartment: '1.01',
			address: 'Bahnhofstrasse 1, 8400 Winterthur',
			tenant: { firstName: 'Hans', lastName: 'Müller' },
			sender: 'Verwaltung Muster AG'
		});
		const { pageTexts } = readPdf(await renderReminderPdf(consent, sender, { name: 'Hans Müller' }, '01.11.2026'));
		const signed = pageTexts.find((page) => page.includes('Unterschrift weiterer Mieter'))!;

		expect(pageTexts.length).toBe(2);
		expect(signed).toContain(consent.agreement.heading);
		expect(signed).toContain('Ort, Datum');
		expect(signed).toContain('Unterschrift Hans Müller');
	});
});
