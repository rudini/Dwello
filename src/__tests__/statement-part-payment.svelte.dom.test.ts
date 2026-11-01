import { describe, it, expect, vi } from 'vitest';
import { readable, get } from 'svelte/store';

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), invalidateAll: vi.fn() }));
// enhance as SvelteKit wires it: the test plays the server's answer to an action of the page
const actions = vi.hoisted(() => new Map<string, (input?: unknown) => unknown>());
vi.mock('$app/forms', () => ({
	enhance: (form: HTMLFormElement, submit?: () => unknown) => {
		if (submit) actions.set(form.getAttribute('action')!, submit);
		return { destroy() {} };
	}
}));
vi.mock('$app/stores', () => ({
	page: {
		subscribe: (run: (value: unknown) => void) =>
			readable({ url: new URL('http://localhost/statements/s1') }).subscribe(run)
	}
}));

import { toasts } from '$lib/stores';
import StatementPage from '../routes/statements/[id]/+page.svelte';
import { byTestId, click, fireEvent, settle, show } from './helpers/dom';
import { statement } from './helpers/statement';

// #959, Copilot review PR #1006: the page data the action refreshes has a smaller open amount; the toast still says
// what was sent, a part payment
describe('Teilzahlung auf der Detailseite', () => {
	it('bestätigt eine Teilzahlung über die Hälfte des Saldos als Teilzahlung, auch nach dem Neuladen', async () => {
		toasts.set([]);
		const props = $state({
			data: { statement: statement({ status: 'sent', balance: 363 }), reminders: [] },
			form: null
		});
		show(StatementPage, props as never);
		click('statement-mark-paid-button');
		fireEvent(byTestId<HTMLInputElement>('paid-amount-input')!, 'input', '200.00');
		const after = actions.get('?/markPaid')!({ formData: new FormData() }) as (
			input: unknown
		) => Promise<void>;

		const refreshed = statement({ status: 'sent', balance: 363, paidAmount: 200 });
		await after({
			update: async () => void (props.data = { statement: refreshed, reminders: [] }),
			result: { type: 'success' }
		});
		await settle();

		expect(get(toasts).map((toast) => toast.message)).toEqual([
			expect.stringContaining('Teilzahlung für Abrechnung')
		]);
	});
});
