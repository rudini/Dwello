import { describe, expect, it } from 'bun:test';
import { reminderLetter, type ReminderLetterInput } from '../services/reminder-letter';

const input: ReminderLetterInput = {
	level: 1,
	statementNumber: 'NK-2024-0007',
	periodStart: '2024-01-01',
	periodEnd: '2024-12-31',
	balance: 245.5,
	deadline: '2025-03-31',
	tenant: { firstName: 'Anna', lastName: 'Keller' },
	sender: { name: 'Verwaltung Muster AG', iban: 'CH93 0076 2011 6238 5295 7' }
};

describe('Mahnschreiben', () => {
	it.each([
		[1, 'Zahlungserinnerung'],
		[2, '2. Mahnung'],
		[3, '3. Mahnung']
	])('Stufe %i heisst „%s“', (level, title) => {
		expect(reminderLetter({ ...input, level }).title).toBe(title);
	});

	it('nennt Abrechnung, offenen Betrag, neue Zahlungsfrist und IBAN', () => {
		const { text } = reminderLetter(input);

		expect(text).toContain('Guten Tag Anna Keller');
		expect(text).toContain('Nebenkostenabrechnung NK-2024-0007 für die Periode 01.01.2024 – 31.12.2024');
		expect(text).toContain("Offener Betrag: CHF 245.50");
		expect(text).toContain('bis 31.03.2025 auf folgendes Konto:\nIBAN CH93 0076 2011 6238 5295 7');
		expect(text).toContain('Freundliche Grüsse\nVerwaltung Muster AG');
	});

	it('wird mit jeder Stufe deutlicher', () => {
		expect(reminderLetter({ ...input, level: 1 }).text).toContain('übersehen');
		expect(reminderLetter({ ...input, level: 2 }).text).toContain('Trotz unserer Zahlungserinnerung');
		expect(reminderLetter({ ...input, level: 3 }).text).toContain('weitere Schritte');
	});

	it('trägt Stufe und Abrechnung im Betreff', () => {
		expect(reminderLetter({ ...input, level: 2 }).subject).toBe('2. Mahnung – Nebenkostenabrechnung NK-2024-0007');
	});
});
