import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// #1457 (decided 23.11.2026): the help at the backup says which backups Dwello keeps, as the glossary row «Sicherung»
const sentences = {
	de: 'Dwello behält die jüngste jedes Tages der letzten 7 Tage und je eine pro Monat während 12 Monaten.'
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
