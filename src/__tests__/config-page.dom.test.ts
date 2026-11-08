import { describe, it, expect, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));
// the page's first navigation is its mounting
vi.mock('$app/navigation', async () => ({ afterNavigate: (await import('svelte')).onMount }));

import SettingsPage from '../routes/config/+page.svelte';
import { show } from './helpers/dom';
import config from '../../tests/contracts/config.json';
import { toSettings } from '$lib/server/settings';

const open = (missing: string[], stored: object = { company_city: null }, errors?: object) =>
	show(SettingsPage, {
		data: {
			settings: toSettings({ ...config.data, ...stored }),
			heatingProfiles: [],
			distributionKeys: [],
			backup: 'off',
			errors:
				errors ??
				(missing.length
					? { iban: 'Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort.' }
					: {}),
			missing
		},
		form: null
	} as never);
const settle = () => new Promise((resolve) => setTimeout(resolve, 10));

describe('Einstellungen öffnen', () => {
	// #690, persona Helga 690 H-4: the first missing field of the Firmenadresse, two screens down, gets the focus
	it('setzt beim Öffnen den Fokus auf das erste Feld, das der IBAN fehlt', async () => {
		open(['companyCity']);
		await settle();

		expect(document.activeElement?.getAttribute('name')).toBe('companyCity');
	});

	// persona Weber 690 W-7: the refusal stays at the Kontoinhaber's name, the focus goes to the empty field it names
	it('setzt beim Öffnen den Fokus auf das leere Feld des Kontoinhabers, nicht auf seinen Namen', async () => {
		open(
			['accountHolderCity'],
			{ account_holder_city: null },
			{ accountHolderName: 'Mit einer IBAN braucht es den Kontoinhaber.' }
		);
		await settle();

		expect(document.activeElement?.getAttribute('name')).toBe('accountHolderCity');
	});

	it('hat den Kontoinhaber als Sprungziel', () => {
		open([], { account_holder_city: null });

		expect(document.getElementById('account-holder')?.textContent).toContain(
			'Name des Kontoinhabers'
		);
	});

	it('setzt beim Öffnen ohne fehlende Felder keinen Fokus', async () => {
		open([]);
		await settle();

		expect(document.activeElement).toBe(document.body);
	});

	// the warning of a statement leads to the Absender, the block with those fields
	it('hat den Absender als Sprungziel', () => {
		open([]);

		expect(document.getElementById('sender')?.textContent).toContain('Absender');
	});
});
