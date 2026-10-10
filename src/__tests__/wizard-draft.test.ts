import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';
import {
	browserStorage,
	clearAllDrafts,
	clearDraft,
	readDraft,
	writeDraft
} from '../lib/wizard-draft';

// A Storage in memory, as the browser's localStorage behaves
function memoryStorage(): Storage {
	const items = new Map<string, string>();
	return {
		get length() {
			return items.size;
		},
		key: (i) => [...items.keys()][i] ?? null,
		getItem: (key) => items.get(key) ?? null,
		setItem: (key, value) => void items.set(key, String(value)),
		removeItem: (key) => void items.delete(key),
		clear: () => items.clear()
	};
}

describe('Entwurf im Browser', () => {
	it('speichert Angaben mit Zeitpunkt und liest sie wieder', () => {
		const storage = memoryStorage();
		const now = new Date('2026-10-10T14:32:00');
		expect(writeDraft(storage, 'contract', { tenantId: 't1' }, now)).toEqual(now);
		expect(readDraft(storage, 'contract')).toEqual({ values: { tenantId: 't1' }, savedAt: now });
	});

	it('hat ohne gespeicherten oder mit beschädigtem Entwurf keinen Entwurf', () => {
		const storage = memoryStorage();
		expect(readDraft(storage, 'contract')).toBeNull();
		storage.setItem('dwello.draft.v1.contract', '{kaputt');
		expect(readDraft(storage, 'contract')).toBeNull();
	});

	it('arbeitet ohne Speicher weiter, wenn der Browser ihn sperrt', () => {
		const blocked = {
			getItem: () => {
				throw new Error('SecurityError');
			},
			setItem: () => {
				throw new Error('QuotaExceededError');
			}
		} as unknown as Storage;
		expect(readDraft(blocked, 'contract')).toBeNull();
		expect(writeDraft(blocked, 'contract', {}, new Date())).toBeNull();
		expect(readDraft(undefined, 'contract')).toBeNull();
	});

	it('verwirft einen Entwurf und beim Abmelden alle Entwürfe', () => {
		const storage = memoryStorage();
		writeDraft(storage, 'contract', {}, new Date());
		writeDraft(storage, 'statements', {}, new Date());
		storage.setItem('andere-app', 'bleibt');
		clearDraft(storage, 'contract');
		expect(readDraft(storage, 'contract')).toBeNull();
		expect(readDraft(storage, 'statements')).not.toBeNull();
		clearAllDrafts(storage);
		expect(readDraft(storage, 'statements')).toBeNull();
		expect(storage.getItem('andere-app')).toBe('bleibt');
	});
});

describe('Speicher des Browsers', () => {
	it('fehlt, wenn schon der Zugriff darauf scheitert', () => {
		vi.stubGlobal('localStorage', undefined);
		Object.defineProperty(globalThis, 'localStorage', {
			configurable: true,
			get: () => {
				throw new DOMException('blocked', 'SecurityError');
			}
		});
		expect(browserStorage()).toBeUndefined();
		vi.unstubAllGlobals();
	});
});
