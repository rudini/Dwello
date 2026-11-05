import { describe, expect, it } from 'vitest';
import { type Example, withSeedHint } from '../e2e/fixtures/screens';

const example = (state: string, building: string) =>
	({ path: '/buildings', state, public: false, building, tankBuilding: '', splitBuilding: '', otherPeriodBuilding: '', heatingProfile: '' }) as Example;

// #1119: a state that needs records but is not in the list of seedFor got none, and its row timed out without a hint
describe('seedFor hint', () => {
	it('names the state and the list in seedFor when a state without records fails to open', () => {
		const timeout = new Error('Timeout 10000ms exceeded');
		const hinted = withSeedHint(example('new-dialog', ''), timeout) as Error;
		expect(hinted.message).toContain('«new-dialog»');
		expect(hinted.message).toContain('the list in seedFor (tests/e2e/fixtures/screens.ts)');
		expect(hinted.message).toContain('Timeout 10000ms exceeded');
		expect(hinted.cause).toBe(timeout);
	});

	it('leaves the error of a state that got its records unchanged', () => {
		const timeout = new Error('Timeout 10000ms exceeded');
		expect(withSeedHint(example('delete-dialog', 'Seeblick-1a2b'), timeout)).toBe(timeout);
	});
});
