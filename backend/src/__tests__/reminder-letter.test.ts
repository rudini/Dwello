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

	// #959 (Fachreview 959-1, Regel 2): nach einer Teilzahlung den Betrag der Abrechnung, was bezahlt ist, und den Rest
	it.each([
		['de', 'Betrag der Abrechnung: CHF 245.50\nBereits bezahlt: CHF 45.50\nOffener Betrag: CHF 200.00'],
		['fr', 'Montant du décompte\u00a0: CHF 245.50\nDéjà payé\u00a0: CHF 45.50\nMontant dû\u00a0: CHF 200.00'],
		['it', 'Importo del conteggio: CHF 245.50\nGià pagato: CHF 45.50\nImporto dovuto: CHF 200.00'],
		['en', 'Statement amount: CHF 245.50\nAlready paid: CHF 45.50\nAmount outstanding: CHF 200.00']
	] as const)('nennt nach einer Teilzahlung den Rest (%s)', (language, lines) => {
		expect(reminderLetter({ ...input, paid: 45.5, language }).paragraphs).toContain(lines);
	});

	// #1000 (Fachreview 959-1, M-1): nach einer Teilzahlung ist die Abrechnung nicht unbezahlt, sondern nicht vollständig bezahlt
	it.each([
		[2, 'de', 'Trotz unserer Zahlungserinnerung ist die Nebenkostenabrechnung NK-2024-0007 für die Periode 01.01.2024 – 31.12.2024 noch nicht vollständig bezahlt.'],
		[3, 'de', 'Trotz zweimaliger Mahnung ist die Nebenkostenabrechnung NK-2024-0007 für die Periode 01.01.2024 – 31.12.2024 noch immer nicht vollständig bezahlt. Geht der Betrag nicht innert der unten genannten Frist ein, müssen wir weitere Schritte einleiten.'],
		[2, 'fr', 'Malgré notre rappel, le décompte des charges NK-2024-0007 pour la période du 01.01.2024 au 31.12.2024 n’a toujours pas été entièrement réglé.'],
		[3, 'fr', 'Malgré deux rappels, le décompte des charges NK-2024-0007 pour la période du 01.01.2024 au 31.12.2024 n’a toujours pas été entièrement réglé. Si le montant ne nous parvient pas dans le délai indiqué ci-dessous, nous nous verrons contraints d’entreprendre d’autres démarches.'],
		[2, 'it', 'Nonostante il nostro promemoria, il conteggio spese accessorie NK-2024-0007 per il periodo dal 01.01.2024 al 31.12.2024 non risulta ancora interamente pagato.'],
		[3, 'it', 'Nonostante il promemoria e il sollecito, il conteggio spese accessorie NK-2024-0007 per il periodo dal 01.01.2024 al 31.12.2024 risulta tuttora non interamente pagato. Se l’importo non ci perverrà entro il termine indicato qui sotto, dovremo adottare ulteriori provvedimenti.'],
		[2, 'en', 'Despite our payment reminder, the utility cost statement NK-2024-0007 for the period 01.01.2024 – 31.12.2024 has still not been paid in full.'],
		[3, 'en', 'Despite two reminders, the utility cost statement NK-2024-0007 for the period 01.01.2024 – 31.12.2024 has still not been paid in full. If the amount is not received by the deadline below, we will have to take further steps.']
	] as const)('sagt in Stufe %i nach einer Teilzahlung «nicht vollständig bezahlt» (%s)', (level, language, opening) => {
		expect(reminderLetter({ ...input, level, paid: 45.5, language }).paragraphs[0]).toBe(opening);
	});

	it('sagt in der 2. Mahnung ohne Teilzahlung weiter «noch nicht bezahlt»', () => {
		expect(reminderLetter({ ...input, level: 2 }).paragraphs[0]).toBe(
			'Trotz unserer Zahlungserinnerung ist die Nebenkostenabrechnung NK-2024-0007 für die Periode 01.01.2024 – 31.12.2024 noch nicht bezahlt.'
		);
	});

	// Auf eine QR-IBAN geht eine Zahlung nur mit der QR-Referenz durch (SIX)
	it('nennt bei einer QR-IBAN die Referenz, die bei der Zahlung anzugeben ist', () => {
		const { text } = reminderLetter({ ...input, sender: { ...input.sender, iban: 'CH44 3199 9123 0008 8901 2' }, reference: '21 00000 00003 13947 14300 09017' });

		expect(text).toContain('IBAN CH44 3199 9123 0008 8901 2\nReferenz 21 00000 00003 13947 14300 09017 (bitte bei der Zahlung angeben)');
	});

	it('wird mit jeder Stufe deutlicher', () => {
		expect(reminderLetter({ ...input, level: 1 }).text).toContain('übersehen');
		expect(reminderLetter({ ...input, level: 2 }).text).toContain('Trotz unserer Zahlungserinnerung');
		expect(reminderLetter({ ...input, level: 3 }).text).toContain('weitere Schritte');
	});

	it('trägt Stufe und Abrechnung im Betreff', () => {
		expect(reminderLetter({ ...input, level: 2 }).subject).toBe('2. Mahnung – Nebenkostenabrechnung NK-2024-0007');
	});

	// #106: die Mahnung folgt der Sprache des Mieters wie das PDF der Abrechnung
	it.each([
		['de', ['Zahlungserinnerung', '2. Mahnung', '3. Mahnung'], 'Nebenkostenabrechnung NK-2024-0007'],
		['fr', ['Rappel de paiement', '2e rappel', '3e rappel'], 'Décompte des charges NK-2024-0007'],
		['it', ['Promemoria di pagamento', '2° sollecito', '3° sollecito'], 'Conteggio spese accessorie NK-2024-0007'],
		['en', ['Payment reminder', '2nd reminder', '3rd reminder'], 'Utility cost statement NK-2024-0007']
	] as const)('heisst auf %s je Stufe wie im Glossar der Übersetzungen', (language, titles, statement) => {
		titles.forEach((title, index) => {
			const letter = reminderLetter({ ...input, level: index + 1, language });
			expect(letter.title).toBe(title);
			expect(letter.subject).toBe(`${title} – ${statement}`);
		});
	});

	it.each([
		['fr', 'Bonjour Anna Keller', 'pour la période du 01.01.2024 au 31.12.2024', 'Montant dû\u00a0: CHF 245.50', 'au plus tard le 31.03.2025', 'Meilleures salutations\nVerwaltung Muster AG'],
		['it', 'Gentile Anna Keller', 'per il periodo dal 01.01.2024 al 31.12.2024', 'Importo dovuto: CHF 245.50', 'entro il 31.03.2025', 'Cordiali saluti\nVerwaltung Muster AG'],
		['en', 'Dear Anna Keller', 'for the period 01.01.2024 – 31.12.2024', 'Amount outstanding: CHF 245.50', 'by 31.03.2025', 'Kind regards\nVerwaltung Muster AG']
	] as const)('schreibt den Brief auf %s', (language, salutation, period, amount, deadline, closing) => {
		for (const level of [1, 2, 3]) {
			const { text } = reminderLetter({ ...input, level, language });
			for (const part of [salutation, period, amount, deadline, closing]) expect(text).toContain(part);
		}
	});

	it.each([
		['fr', 'Référence 21 00000 00003 13947 14300 09017 (à indiquer lors du paiement)'],
		['it', 'Riferimento 21 00000 00003 13947 14300 09017 (da indicare al momento del pagamento)'],
		['en', 'Reference 21 00000 00003 13947 14300 09017 (please quote it with your payment)']
	] as const)('nennt die Referenz auf %s', (language, reference) => {
		const { text } = reminderLetter({ ...input, language, reference: '21 00000 00003 13947 14300 09017' });
		expect(text).toContain(reference);
	});

	// Fachreview W6b V-1: «nulla» hiesse rechtlich nichtig, nicht gegenstandslos
	it('sagt auf Italienisch, dass eine bereits geleistete Zahlung den Brief erledigt', () => {
		expect(reminderLetter({ ...input, language: 'it' }).text).toContain('Se ha già effettuato il pagamento, non tenga conto della presente.');
	});
});

// #449 (Entscheid in #404, Punkt 5.2): die 3. Mahnung setzt eine Frist; «umgehend» widerspricht ihr
describe('3. Mahnung', () => {
	it('verweist auf die Frist, statt «umgehend» zu verlangen', () => {
		expect(reminderLetter({ ...input, level: 3 }).text).toContain(
			'Geht der Betrag nicht innert der unten genannten Frist ein, müssen wir weitere Schritte einleiten.'
		);
	});

	it('verlangt die Zahlung nicht «umgehend», nennt aber die Frist', () => {
		const words: Record<string, string> = { de: 'umgehend', fr: 'sans délai', it: 'senza indugio', en: 'immediately' };
		for (const language of ['de', 'fr', 'it', 'en'] as const) {
			const letter = reminderLetter({ ...input, level: 3, language });

			expect({ language, said: letter.text.includes(words[language]) }).toEqual({ language, said: false });
			expect(letter.text).toContain('31.03.2025');
		}
	});
});
