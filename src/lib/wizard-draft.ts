// Unsaved wizard input, kept per browser until it is saved, discarded or the user logs out.
// Browser storage can be missing or blocked (private mode, full quota): the wizard then works without a draft.
const PREFIX = 'dwello.draft.';
const keyOf = (name: string) => `${PREFIX}v1.${name}`;

/** The browser's localStorage, or undefined where even touching it throws (blocked site data) */
export function browserStorage(): Storage | undefined {
	try {
		return globalThis.localStorage;
	} catch {
		return undefined;
	}
}

export function readDraft<T>(
	storage: Storage | undefined,
	name: string
): { values: T; savedAt: Date } | null {
	try {
		const draft = JSON.parse(storage?.getItem(keyOf(name)) ?? 'null');
		return draft && { values: draft.values, savedAt: new Date(draft.savedAt) };
	} catch {
		return null;
	}
}

/** Keeps the values; returns when they were saved, or null when the browser refuses */
export function writeDraft(storage: Storage | undefined, name: string, values: unknown, now: Date) {
	try {
		storage?.setItem(keyOf(name), JSON.stringify({ values, savedAt: now.toISOString() }));
		return storage ? now : null;
	} catch {
		return null;
	}
}

export function clearDraft(storage: Storage | undefined, name: string) {
	try {
		storage?.removeItem(keyOf(name));
	} catch {
		// nothing kept, nothing to remove
	}
}

/** On logout: no personal data stays behind in the browser */
export function clearAllDrafts(storage: Storage | undefined) {
	try {
		const keys = Array.from({ length: storage?.length ?? 0 }, (_, i) => storage!.key(i));
		for (const key of keys) if (key?.startsWith(PREFIX)) storage!.removeItem(key);
	} catch {
		// nothing kept, nothing to remove
	}
}
