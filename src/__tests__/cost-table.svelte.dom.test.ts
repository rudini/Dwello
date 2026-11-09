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
		const props = reactiveProps({ statement: statement() });
		show(CostTable, props);
		const before = [...allByTestId('statement-line-card'), ...allByTestId('statement-line-item')];

		props.statement = statement({
			lineItems: statement().lineItems.map((item) => ({
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
});
