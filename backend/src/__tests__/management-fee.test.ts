import { describe, expect, it } from 'bun:test';
import { calculateManagementFee } from '../services/calculation.service';

describe('Verwaltungspauschale', () => {
	it('berechnet die Pauschale als Prozentsatz der Nebenkosten', () => {
		expect(calculateManagementFee(1000, 3).fee).toBe(30);
	});

	// 3 % sind ein üblicher Richtwert, keine Grenze
	it('verrechnet auch eine Pauschale über 3 %', () => {
		expect(calculateManagementFee(1000, 4.5).fee).toBe(45);
	});
});
