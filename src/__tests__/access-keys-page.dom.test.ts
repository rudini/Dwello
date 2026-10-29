import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));
const { addToast } = vi.hoisted(() => ({ addToast: vi.fn() }));
vi.mock('$lib/stores', () => ({ addToast }));

import AccessKeysPage from '../routes/config/access-keys/+page.svelte';
import { allByTestId, byTestId, click, show } from './helpers/dom';
import accessKeys from '../../tests/contracts/access-keys.json';

// What GET /api/v1/access-keys answers, checked against the real API (backend/src/__tests__/api-contracts.pg.test.ts)
const [key] = accessKeys.data;

// #817: Zugangsschlüssel für KI-Programme unter den Einstellungen
describe('Zugangsschlüssel für KI-Programme', () => {
	it('zeigt einen neuen Schlüssel einmal, mit Hinweis und Warnung, bis er geschlossen wird', async () => {
		show(AccessKeysPage, {
			data: { keys: [key] },
			form: { created: { name: key.name, key: 'dwello_geheim' } }
		} as never);

		expect(byTestId('access-key-new-value')?.textContent).toBe('dwello_geheim');
		expect(byTestId('access-key-new-hint')?.textContent).toBe(
			'Kopieren Sie den Schlüssel jetzt. Dwello zeigt ihn nur dieses eine Mal.'
		);
		// Fachprüfung 817-1 R-3: wie ein Passwort, nicht in eine Nachricht
		expect(byTestId('access-key-new-secret')?.textContent).toContain(
			'nicht in eine Nachricht an das Programm'
		);

		click('access-key-new-close');
		await Promise.resolve();

		expect(byTestId('access-key-new')).toBeNull();
	});

	// personas Helga P-1, Marco P-1: a long key is not marked by hand; Helga P-3, Weber P-3: both go into the program;
	// Helga 817-2 P-1, Marco 817-2 P-1: the address with its own button in the panel; Helga 817-2 P-3: which was copied
	it('kopiert Schlüssel und Adresse im Kasten des neuen Schlüssels mit je einem Knopf und sagt, was kopiert ist', async () => {
		const writeText = vi.fn(async () => {});
		Object.assign(navigator, { clipboard: { writeText } });
		addToast.mockClear();
		show(AccessKeysPage, {
			data: { keys: [key], mcpUrl: 'https://dwello.example/mcp' },
			form: { created: { name: key.name, key: 'dwello_geheim' } }
		} as never);

		expect(byTestId('access-key-new')?.textContent).toContain(
			'Adresse für das KI-Programm: https://dwello.example/mcp'
		);
		click('access-key-new-copy');
		click('access-key-new-address-copy');
		await new Promise((resolve) => setTimeout(resolve));

		expect(writeText.mock.calls).toEqual([['dwello_geheim'], ['https://dwello.example/mcp']]);
		expect(addToast.mock.calls).toEqual([
			['success', 'Der Schlüssel ist kopiert.'],
			['success', 'Die Adresse ist kopiert.']
		]);
	});

	// code review 817-3 C-14: the address on the page says the same
	it('kopiert auch die Adresse oben auf der Seite und sagt es', async () => {
		const writeText = vi.fn(async () => {});
		Object.assign(navigator, { clipboard: { writeText } });
		addToast.mockClear();
		show(AccessKeysPage, {
			data: { keys: [], mcpUrl: 'https://dwello.example/mcp' },
			form: null
		} as never);

		click('access-key-address-copy');
		await new Promise((resolve) => setTimeout(resolve));

		expect(writeText).toHaveBeenCalledWith('https://dwello.example/mcp');
		expect(addToast).toHaveBeenCalledWith('success', 'Die Adresse ist kopiert.');
	});

	// code review 817-3 C-14: a refused revoke stays in its dialog
	it('zeigt im Dialog zum Widerrufen, dass nichts widerrufen wurde', () => {
		show(AccessKeysPage, {
			data: { keys: [key] },
			form: { revokeError: 'Der Zugangsschlüssel wurde nicht widerrufen. Versuchen Sie es erneut.' }
		} as never);

		click('access-key-revoke-button');

		expect(byTestId('form-error')?.textContent).toContain(
			'Der Zugangsschlüssel wurde nicht widerrufen.'
		);
	});

	// code review 817-2 C-11
	it('sagt, wenn das Kopieren nicht geht, wie es von Hand geht', async () => {
		Object.assign(navigator, {
			clipboard: { writeText: vi.fn(async () => Promise.reject(new Error('verweigert'))) }
		});
		addToast.mockClear();
		show(AccessKeysPage, {
			data: { keys: [], mcpUrl: 'https://dwello.example/mcp' },
			form: null
		} as never);

		click('access-key-address-copy');
		await new Promise((resolve) => setTimeout(resolve));

		expect(addToast).toHaveBeenCalledWith(
			'error',
			'Kopieren hat nicht geklappt. Markieren Sie den Text und kopieren Sie ihn von Hand.'
		);
	});

	it('nennt bei jedem Schlüssel Erstellt, zuletzt benutzt und den Ablauf', () => {
		show(AccessKeysPage, {
			data: {
				keys: [key, { ...key, id: 'k2', name: 'Alt', lastUsedAt: '2026-11-02T10:00:00.000Z' }]
			},
			form: null
		} as never);

		const [first, second] = allByTestId('access-key-row').map((row) => row.textContent);
		expect(first).toContain('Erstellt am 28.10.2026');
		expect(first).toContain('Noch nie benutzt');
		expect(first).toContain('Läuft ab am 26.01.2027');
		expect(second).toContain('Zuletzt benutzt am 02.11.2026');
	});

	// Fachprüfung 817-1 V-2: ein abgelaufener Schlüssel erhält schon keine Daten mehr
	it('nennt einen abgelaufenen Schlüssel so und sagt vor dem Widerrufen, dass er aus der Liste verschwindet', () => {
		show(AccessKeysPage, {
			data: { keys: [{ ...key, expiresOn: '2026-10-27', expired: true }] },
			form: null
		} as never);

		// Fachprüfung 817-2 V-10: the day it was last valid, not the day it ran out
		expect(byTestId('access-key-row')?.textContent).toContain('Abgelaufen, galt bis 27.10.2026');
		click('access-key-revoke-button');
		expect(byTestId('access-key-revoke-message')?.textContent).toBe(
			'Der abgelaufene Zugangsschlüssel «Claude Desktop Büro» verschwindet aus der Liste. Das lässt sich nicht rückgängig machen.'
		);
	});

	it('sagt vor dem Widerrufen eines gültigen Schlüssels, dass das KI-Programm keine Daten mehr erhält', () => {
		show(AccessKeysPage, { data: { keys: [key] }, form: null } as never);

		click('access-key-revoke-button');
		expect(byTestId('access-key-revoke-message')?.textContent).toBe(
			'Ein KI-Programm mit dem Zugangsschlüssel «Claude Desktop Büro» erhält danach keine Daten mehr. Das lässt sich nicht rückgängig machen.'
		);
	});

	// the address the AI program needs next to the key: /mcp of this installation
	it('nennt die Adresse für das KI-Programm', () => {
		show(AccessKeysPage, {
			data: { keys: [], mcpUrl: 'https://dwello.example/mcp' },
			form: null
		} as never);

		expect(byTestId('access-key-address')?.textContent).toBe(
			'Adresse für das KI-Programm: https://dwello.example/mcp'
		);
	});

	it('sagt, was zu tun ist, solange es keinen Schlüssel gibt', () => {
		show(AccessKeysPage, { data: { keys: [] }, form: null } as never);

		expect(byTestId('access-keys-empty')?.textContent).toContain('Noch kein Zugangsschlüssel');
	});
});
