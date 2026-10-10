import { describe, it, expect, vi } from 'vitest';
import { flushSync } from 'svelte';
import { get } from 'svelte/store';
import type { SubmitFunction } from '@sveltejs/kit';

let submit: SubmitFunction;
vi.mock('$app/forms', () => ({
	enhance: (_form: HTMLFormElement, run: SubmitFunction) => {
		submit = run;
		return { destroy() {} };
	}
}));

import { toasts } from '$lib/stores';
import BuildingForm from '../routes/buildings/BuildingForm.svelte';
import { byTestId, fireEvent, show } from './helpers/dom';

// What the form does once the server has saved the building and opens it
async function saved() {
	const after = submit({} as never) as (opts: unknown) => Promise<void>;
	await after({ result: { type: 'redirect', location: '/buildings/b1' }, update: vi.fn() });
}

describe('Gebäude speichern', () => {
	it('bestätigt das Erfassen mit dem Namen des Gebäudes', async () => {
		show(BuildingForm, { mode: 'create' as const, errors: {}, cancelHref: '/buildings' });
		fireEvent(byTestId<HTMLInputElement>('building-name-input')!, 'input', 'Rosengarten');
		await saved();
		expect(get(toasts).map((toast) => toast.message)).toContain('Gebäude Rosengarten gespeichert');
	});

	it('zeigt beim Speichern, dass gearbeitet wird', () => {
		show(BuildingForm, {
			mode: 'edit' as const,
			initial: { name: 'Eichenhof' },
			errors: {},
			cancelHref: '/buildings/b1'
		});
		submit({} as never);
		flushSync();
		const button = byTestId('building-form-submit')!;
		expect(button.textContent).toContain('Wird gespeichert');
	});
});
