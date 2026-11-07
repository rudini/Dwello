import type { Page } from '@playwright/test';
import { describe, expect, it } from 'vitest';
import { BrowseTheWeb } from '../e2e/screenplay/abilities';
import { Actor } from '../e2e/screenplay/actor';
import { Navigate } from '../e2e/screenplay/interactions';

// #750: a page that never hydrated left an empty screenshot and no clue; the browser console names the render error
const pageThatLogsAndNeverHydrates = () => {
	const listeners: Record<string, (value: unknown) => void> = {};
	const page = {
		on: (event: string, listener: (value: unknown) => void) => ((listeners[event] = listener), page),
		goto: async () => {
			listeners.console?.({ type: () => 'error', text: () => 'Failed to load module script' });
			listeners.pageerror?.(new TypeError("Cannot read properties of undefined (reading 'buildings')"));
		},
		locator: () => ({ waitFor: () => Promise.reject(new Error('locator.waitFor: Timeout 10000ms exceeded.')) })
	};
	return page as unknown as Page;
};

describe('Seite ohne Hydrierung im E2E-Browser', () => {
	it('nennt im Fehler die Konsole und den Fehler der Seite', async () => {
		const actor = new Actor('Liegenschaftsverwalter').whoCan(new BrowseTheWeb(pageThatLogsAndNeverHydrates()));

		const failure = await actor.attemptsTo(Navigate.to('/dashboard')).catch((error: Error) => error);

		expect(failure).toBeInstanceOf(Error);
		expect((failure as Error).message).toContain('Timeout 10000ms exceeded');
		expect((failure as Error).message).toContain('error: Failed to load module script');
		expect((failure as Error).message).toContain("TypeError: Cannot read properties of undefined (reading 'buildings')");
	});
});
