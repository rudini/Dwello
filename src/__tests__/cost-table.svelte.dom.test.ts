import { describe, it, expect } from 'vitest';
import { flushSync } from 'svelte';
import CostTable from '../routes/statements/[id]/CostTable.svelte';
import { statement } from './helpers/statement';
import { reactiveProps } from './helpers/reactive-props.svelte';
import { allByTestId, show } from './helpers/dom';

describe('Kostenaufstellung', () => {
	// #1366: «Neu berechnen» gives the positions new ids; a card replaced instead of updated left the page shorter for
	// a moment, and WebKit, which keeps no scroll anchor, moved the page by that card's height
	it('behält beim Neuberechnen die Karte und die Zeile jeder Position und zeigt ihre neuen Beträge', () => {
		// as calculated: each position of a category and a key
		const lines = statement().lineItems.map((item, index) => ({
			...item,
			distributionKeyId: `k${index}`
		}));
		const props = reactiveProps({ statement: statement({ lineItems: lines }) });
		show(CostTable, props);
		const before = [...allByTestId('statement-line-card'), ...allByTestId('statement-line-item')];

		props.statement = statement({
			lineItems: lines.map((item) => ({
				...item,
				id: `${item.id}-neu`,
				tenantShare: item.tenantShare + 1
			}))
		});
		flushSync();

		const after = [...allByTestId('statement-line-card'), ...allByTestId('statement-line-item')];
		expect(after).toHaveLength(4);
		expect(after.every((element, index) => element === before[index])).toBe(true);
		expect(after[0].textContent).toContain('1’501.00');
	});

	// code review 1366 C-1: a statement from before #1160/#1255 may hold positions whose category or key was deleted
	it('zeigt zwei Positionen ohne Kategorie mit demselben Verteilschlüssel beide', () => {
		const [first, second] = statement().lineItems;
		show(CostTable, {
			statement: statement({
				lineItems: [
					{ ...first, categoryId: null, distributionKeyId: 'k1' },
					{ ...second, categoryId: null, distributionKeyId: 'k1' }
				] as never
			})
		});

		expect(allByTestId('statement-line-card')).toHaveLength(2);
	});
});
