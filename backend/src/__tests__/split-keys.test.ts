/**
 * #528: a Kategorie billed with several Verteilschlüssel; which invoices differ from its largest share (Fachreview
 * 528-1 V-4, V-5, V-8)
 */

import { describe, expect, it } from 'bun:test';
import { splitKeysOf } from '../services/split-keys';

const bill = (
	categoryId: string | null,
	keyId: string | null,
	amount: number,
	id: string,
	fuelStock = false
) => ({
	categoryId,
	distributionKeyId: keyId,
	amount,
	invoices: [{ id, description: `Rechnung ${id}`, ...(fuelStock && { fuelStock: true }) }]
});

describe('Kategorie mit verschiedenen Verteilschlüsseln', () => {
	it('nennt die Rechnungen, deren Verteilschlüssel von dem mit den grössten Kosten abweicht', () => {
		const split = splitKeysOf([
			bill('hauswart', 'area', 600, 'q1'),
			bill('hauswart', 'unit', 300, 'q4'),
			bill('hauswart', 'area', 600, 'q2')
		]);
		expect(split).toEqual([
			{
				categoryId: 'hauswart',
				keyId: 'unit',
				mainKeyId: 'area',
				invoices: [{ id: 'q4', description: 'Rechnung q4' }]
			}
		]);
	});

	it('nennt nichts, wenn jede Kategorie einen Verteilschlüssel hat', () => {
		expect(
			splitKeysOf([bill('hauswart', 'area', 600, 'q1'), bill('wasser', 'unit', 300, 'w')])
		).toEqual([]);
	});

	it('zählt eine Rechnung ohne Verteilschlüssel als eigenen Verteilschlüssel', () => {
		expect(
			splitKeysOf([bill('hauswart', 'area', 900, 'q1'), bill('hauswart', null, 300, 'alt')])
		).toMatchObject([{ keyId: null, mainKeyId: 'area', invoices: [{ id: 'alt' }] }]);
	});

	it('nimmt bei gleichen Kosten den Verteilschlüssel der letzten Rechnung als den der Kategorie', () => {
		expect(
			splitKeysOf([bill('hauswart', 'area', 300, 'q1'), bill('hauswart', 'unit', 300, 'q4')])
		).toMatchObject([{ keyId: 'area', mainKeyId: 'unit', invoices: [{ id: 'q1' }] }]);
	});

	it('nennt die Veränderung Tankbestand nicht als Rechnung', () => {
		const split = splitKeysOf([
			bill('heizung', 'area', 900, 'oel'),
			bill('heizung', 'unit', 300, 'oel2'),
			bill('heizung', 'unit', 100, 'tank', true)
		]);
		expect(split).toMatchObject([{ keyId: 'unit', invoices: [{ id: 'oel2' }] }]);
		expect(
			splitKeysOf([bill('heizung', 'area', 900, 'oel'), bill('heizung', 'unit', 100, 'tank', true)])
		).toEqual([]);
	});
});
