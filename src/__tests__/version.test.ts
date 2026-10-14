import { describe, expect, it } from 'vitest';
import { versionFrom } from '../lib/version';

describe('versionFrom', () => {
	it('zeigt auf einem Tag dessen Version', () => {
		expect(versionFrom('v0.4.0')).toBe('0.4.0');
	});

	it('zeigt nach einem Tag die Commits seither und den Commit', () => {
		expect(versionFrom('v0.4.0-3-gabc1234')).toBe('0.4.0+3-gabc1234');
	});

	it('kennt ohne Tag keine Version', () => {
		expect(versionFrom('')).toBeUndefined();
	});
});
