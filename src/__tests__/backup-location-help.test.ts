import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// #1457 (decided 23.11.2026): the help at the backup says which backups Dwello keeps, as the glossary row «Sicherung»
const sentences = {
	de: 'Dwello behält die jüngste jedes Tages der letzten 7 Tage und je eine pro Monat während 12 Monaten.',
	fr: 'Dwello conserve la plus récente de chacun des 7 derniers jours et une par mois pendant 12 mois.',
	it: 'Dwello conserva la più recente di ciascuno degli ultimi 7 giorni e una al mese per 12 mesi.',
	en: 'Dwello keeps the newest backup from each of the last 7 days and one per month for 12 months.'
};

describe('Hilfetext zum Ort der Sicherungen', () => {
	it.each(Object.entries(sentences))(
		'sagt in %s, welche Sicherungen Dwello behält',
		(locale, sentence) => {
			const messages = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));
			expect(messages.backup_location).toContain(` ${sentence} `);
		}
	);
});
