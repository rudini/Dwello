import { describe, expect, it } from 'vitest';
import { type Example, withSeedHint } from '../e2e/fixtures/screens';

const example = (state: string, building: string) =>
	({ path: '/buildings', state, public: false, building, tankBuilding: '', splitBuilding: '', otherPeriodBuilding: '', heatingProfile: '' }) as Example;

// #1119: a state that needs records but is not in the list of seedFor got none, and its row timed out without a hint
describe('Hinweis auf die Liste in seedFor', () => {
	it('nennt Zustand und Liste, wenn ein Zustand ohne Datensätze sich nicht öffnen lässt', () => {
		const timeout = new Error('Timeout 10000ms exceeded');
		const hinted = withSeedHint(example('new-dialog', ''), timeout) as Error;
		expect(hinted.message).toContain('«new-dialog»');
		expect(hinted.message).toContain('the list in seedFor (tests/e2e/fixtures/screens.ts)');
		expect(hinted.message).toContain('Timeout 10000ms exceeded');
		expect(hinted.cause).toBe(timeout);
	});

	it('lässt den Fehler eines Zustands mit Datensätzen unverändert', () => {
		const timeout = new Error('Timeout 10000ms exceeded');
		expect(withSeedHint(example('delete-dialog', 'Seeblick-1a2b'), timeout)).toBe(timeout);
	});
});
