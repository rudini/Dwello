import type { Page } from '@playwright/test';
import { describe, expect, it } from 'vitest';
import { BrowseTheWeb } from '../e2e/screenplay/abilities';
import { Actor } from '../e2e/screenplay/actor';
import { Navigate } from '../e2e/screenplay/interactions';

// Playwright fixes the stack when it throws, and its report shows the stack, not the message (review 750 C-1)
const timeout = new Error('locator.waitFor: Timeout 10000ms exceeded.');
timeout.stack = `${timeout.message}\n    at Navigate.to`;

// #750: a page that never hydrated left an empty screenshot and no clue; the browser console names the render error
const pageThatLogsAndNeverHydrates = () => {
	const listeners: Record<string, (value: unknown) => void> = {};
	const mainFrame = {};
	const page = {
		on: (event: string, listener: (value: unknown) => void) => ((listeners[event] = listener), page),
		mainFrame: () => mainFrame,
		goto: async (path: string) => {
			listeners.request?.({ isNavigationRequest: () => true, frame: () => mainFrame });
			listeners.console?.({ type: () => 'error', text: () => `Failed to load module script of ${path}` });
			listeners.pageerror?.(new TypeError("Cannot read properties of undefined (reading 'buildings')"));
			listeners.framenavigated?.(mainFrame); // a history change, as SvelteKit makes while it starts
		},
		locator: () => ({ waitFor: () => Promise.reject(timeout) })
	};
	return page as unknown as Page;
};

const failureOf = (actor: Actor, path: string) =>
	actor.attemptsTo(Navigate.to(path)).catch((error: Error) => error) as Promise<Error>;

describe('Seite ohne Hydrierung im E2E-Browser', () => {
	it('nennt im Fehler die Konsole und den Fehler der Seite und behält das Timeout als Ursache', async () => {
		const actor = new Actor('Liegenschaftsverwalter').whoCan(new BrowseTheWeb(pageThatLogsAndNeverHydrates()));

		const failure = await failureOf(actor, '/dashboard');

		expect(failure.stack).toContain('Timeout 10000ms exceeded');
		expect(failure.stack).toContain('error: Failed to load module script of /dashboard');
		expect(failure.stack).toContain("TypeError: Cannot read properties of undefined (reading 'buildings')");
		expect(failure.cause).toBe(timeout);
	});

	it('nennt nur die Konsole der zuletzt geladenen Seite', async () => {
		const actor = new Actor('Liegenschaftsverwalter').whoCan(new BrowseTheWeb(pageThatLogsAndNeverHydrates()));
		await failureOf(actor, '/buildings');

		const failure = await failureOf(actor, '/dashboard');

		expect(failure.stack).toContain('of /dashboard');
		expect(failure.stack).not.toContain('of /buildings');
	});
});
