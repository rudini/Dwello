import { describe, expect, it } from 'bun:test';
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
