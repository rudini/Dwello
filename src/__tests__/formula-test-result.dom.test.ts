import { describe, expect, it } from 'vitest';
import FormulaTestResult from '../routes/config/distribution-keys/FormulaTestResult.svelte';
import { allByTestId, byTestId, show } from './helpers/dom';

// #737 (Fachprüfung 737-1 V-1): the title says what happened without opening with the formula as the message does
describe('Ergebnis von «Formel testen»', () => {
	it('überschreibt einen Fehler mit dem Befund des Tests, nicht mit einem zweiten Satz über die Formel', () => {
		const error =
			'Für eine Wohnung ergibt die Formel keine Zahl, meist weil sie dort durch null teilt. Prüfen Sie, was nach «/» steht.';
		show(FormulaTestResult, { test: { errors: [error], results: [] } });

		expect(byTestId('formula-test-failed')?.textContent?.trim()).toMatch(
			/^Der Test hat einen Fehler gefunden\s*Für eine Wohnung/
		);
		expect(allByTestId('formula-test-error').map((line) => line.textContent)).toEqual([error]);
	});
});
