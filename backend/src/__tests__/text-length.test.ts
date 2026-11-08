/**
 * #1201: a text longer than its database column is refused at its field, as the invoice forms do since #743, instead of
 * the general save error the database's own refusal led to
 */
import { describe, expect, it } from 'bun:test';
import { apartments, buildings, tenants } from '../db/schema';
import { tooLongErrors } from '../services/text-length';

describe('Länge der Texte', () => {
	it('nimmt einen Text so lang, wie seine Spalte ihn speichert, und meldet einen längeren bei seinem Feld', () => {
		expect(tooLongErrors(buildings, { name: 'A'.repeat(255), city: 'B'.repeat(100) })).toEqual([]);
		expect(tooLongErrors(buildings, { name: 'A'.repeat(256), city: 'B'.repeat(101) })).toEqual([
			{ code: 'TEXT_TOO_LONG', params: { field: 'name', max: 255 } },
			{ code: 'TEXT_TOO_LONG', params: { field: 'city', max: 100 } }
		]);
	});

	it('zählt Zeichen wie PostgreSQL, nicht UTF-16-Einheiten', () => {
		// «𝄞» is one character in PostgreSQL and two units in JavaScript
		expect(tooLongErrors(tenants, { phone: '𝄞'.repeat(30) })).toEqual([]);
	});

	it('übergeht leere Felder, Zahlen und Felder ohne Spalte', () => {
		expect(tooLongErrors(tenants, { email: null, firstName: undefined, other: 'A'.repeat(999), yearBuilt: 2000 })).toEqual([]);
	});

	it('nennt das Feld so, wie das Formular es nennt', () => {
		expect(tooLongErrors(apartments, { number: '1'.repeat(21) }, (key) => `apartments.0.${key}`)).toEqual([
			{ code: 'TEXT_TOO_LONG', params: { field: 'apartments.0.number', max: 20 } }
		]);
	});
});
