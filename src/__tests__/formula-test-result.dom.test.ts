import { describe, expect, it } from 'vitest';
import FormulaTestResult from '../routes/config/distribution-keys/FormulaTestResult.svelte';
import { allByTestId, show } from './helpers/dom';

// #737 (Fachprüfung 737-1 V-1): the title says what happened without opening with the formula as the message does
describe('Ergebnis von «Formel testen»', () => {
	it('überschreibt einen Fehler mit dem Befund des Tests, nicht mit einem zweiten Satz über die Formel', () => {
		const error =
			'Die Formel kann für eine Wohnung nicht berechnet werden: Die Formel ergibt keine gültige Zahl.';
		show(FormulaTestResult, { test: { errors: [error], results: [] } });

		expect(document.getElementById('formula-test-failed-title')?.textContent).toBe(
			'Der Test hat einen Fehler gefunden'
		);
		expect(allByTestId('formula-test-error').map((line) => line.textContent)).toEqual([error]);
	});
});
