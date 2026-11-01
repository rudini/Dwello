import { describe, expect, it } from 'bun:test';
import { consentLetter, type ConsentLetterInput } from '../services/consent-letter';

// #521, Fachreview 521-1 section 1: the scenario's case, Juli–Juni before, Kalenderjahr now
const input: ConsentLetterInput = {
	earlier: 'july-june',
	type: 'calendar',
	short: { start: '2025-07-01', end: '2025-12-31' },
	contractEnd: null,
	date: '2026-11-01',
	apartment: '2.01',
	address: 'Bahnhofstrasse 1, 8400 Winterthur',
	tenant: { firstName: 'Anna', lastName: 'Keller' },
	sender: 'Verwaltung Muster AG'
};

describe('Brief zur Zustimmung zu einer neuen Abrechnungsperiode', () => {
	it.each([
		[
			'Kalenderjahr nach Juli–Juni',
			{ earlier: 'july-june', type: 'calendar', short: { start: '2025-07-01', end: '2025-12-31' } },
			['vom 1. Juli bis 30. Juni abgerechnet', 'neu jeweils vom 1. Januar bis 31. Dezember ab', 'kurze Abrechnungsperiode 01.07.2025 – 31.12.2025', 'Die erste neue Abrechnungsperiode ist 01.01.2026 – 31.12.2026.']
		],
		[
			'Juli–Juni nach Kalenderjahr',
			{ earlier: 'calendar', type: 'july-june', short: { start: '2025-01-01', end: '2025-06-30' } },
			['vom 1. Januar bis 31. Dezember abgerechnet', 'neu jeweils vom 1. Juli bis 30. Juni ab', 'kurze Abrechnungsperiode 01.01.2025 – 30.06.2025', 'Die erste neue Abrechnungsperiode ist 01.07.2025 – 30.06.2026.']
		],
		[
			'Kalenderjahr nach November–Oktober',
			{ earlier: 'november-october', type: 'calendar', short: { start: '2024-11-01', end: '2024-12-31' } },
			['vom 1. November bis 31. Oktober abgerechnet', 'neu jeweils vom 1. Januar bis 31. Dezember ab', 'kurze Abrechnungsperiode 01.11.2024 – 31.12.2024', 'Die erste neue Abrechnungsperiode ist 01.01.2025 – 31.12.2025.']
		]
	] as const)('nennt bisherige, neue, kurze und erste neue Abrechnungsperiode: %s', (_, periods, sentences) => {
		const { text } = consentLetter({ ...input, ...periods });

		for (const sentence of sentences) expect(text).toContain(sentence);
	});

	// Fachreview 521-1 V-3: a contract that ends by the end of the short period gets no first new period
	it('nennt bei einem Vertragsende in der kurzen Abrechnungsperiode keine erste neue Abrechnungsperiode', () => {
		const { text } = consentLetter({ ...input, contractEnd: '2025-09-30' });

		expect(text).not.toContain('erste neue Abrechnungsperiode');
		expect(text).not.toContain('erstmals');
		expect(text).toContain('für die kurze Abrechnungsperiode 01.07.2025 – 31.12.2025 abgerechnet werden.');
	});

	// Fachreview 521-1 section 1: the date of the letter plus 30 days (practice, no legal deadline)
	it('setzt die Antwortfrist 30 Tage nach dem Datum des Briefs', () => {
		expect(consentLetter(input).text).toContain('senden Sie uns dieses Schreiben bis 01.12.2026 zurück.');
	});

	// Fachreview 521-1 M-2: silence is no agreement, the letter says the agreement is voluntary
	it('nennt die Zustimmung freiwillig und lässt Schweigen nicht als Zustimmung gelten', () => {
		const { text } = consentLetter(input);

		expect(text).toContain('Ihre Zustimmung ist freiwillig. Ohne Ihre Unterschrift ändert dieses Schreiben an Ihrem Mietvertrag nichts.');
		expect(text).not.toMatch(/gilt (als|Ihre) Zustimmung/);
	});

	// Fachreview 521-1 section 2: in the tenant's language
	it.each([
		['fr', 'Jusqu’ici, nous avons établi le décompte des frais accessoires chaque année du 1er juillet au 30 juin.', 'Signature Anna Keller', 'Lieu, date'],
		['it', 'Finora abbiamo allestito il conteggio delle spese accessorie ogni anno dal 1° luglio al 30 giugno.', 'Firma Anna Keller', 'Luogo, data'],
		['en', 'So far, we have billed the utility costs each year from 1 July to 30 June.', 'Signature Anna Keller', 'Place, date']
	] as const)('schreibt den Brief in der Sprache des Mieters (%s)', (language, change, signature, placeDate) => {
		const { text } = consentLetter({ ...input, language });

		expect(text).toContain(change);
		expect(text).toContain(signature);
		expect(text).toContain(placeDate);
	});
});
