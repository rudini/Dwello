import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// run.sh unshallows the clone before fallow runs; fallow's churn cache from the shallow clone would survive that
const script = readFileSync(new URL('./run.sh', import.meta.url), 'utf8');

describe('run.sh', () => {
	it('ruft fallow health ohne Cache auf, damit die Churn die ganze Historie zählt', () => {
		const calls = script.split('\n').filter((l) => l.includes('fallow health'));
		expect(calls.length).toBeGreaterThan(0);
		for (const call of calls) expect(call).toContain('--no-cache');
	});
});
