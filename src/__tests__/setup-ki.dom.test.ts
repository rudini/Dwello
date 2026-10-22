import { describe, it, expect, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));

import SetupPage from '../routes/setup/+page.svelte';
import { byTestId, show } from './helpers/dom';

// #620: bei der Einrichtung nur «Lokale KI» oder «Später entscheiden»
describe('KI bei der Einrichtung', () => {
	it('bietet die lokale KI, vorgewählt, und «Später entscheiden»', () => {
		show(SetupPage, { data: { kiChoice: true }, form: null } as never);

		expect(byTestId<HTMLInputElement>('setup-ki-local')!.checked).toBe(true);
		expect(byTestId<HTMLInputElement>('setup-ki-none')!.checked).toBe(false);
		expect(document.body.textContent).toContain('Später entscheiden');
	});

	// persona Anna P-1, Helga P-3: names the setting it saves, and no provider without saying where invoices go
	it('sagt, dass «Später entscheiden» «Keine KI» speichert', () => {
		show(SetupPage, { data: { kiChoice: true }, form: null } as never);

		expect(document.body.textContent).toContain('Dwello speichert «Keine KI».');
		expect(document.body.textContent).not.toContain('Anbieter');
	});

	it('bietet keine Wahl, wenn der Betreiber die KI festgelegt hat', () => {
		show(SetupPage, { data: { kiChoice: false }, form: null } as never);

		expect(byTestId('setup-ki-local')).toBeNull();
	});
});
