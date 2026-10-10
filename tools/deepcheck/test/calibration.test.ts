import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze.ts';
import { writeProject } from './helpers.ts';

const modules = (files: Record<string, string>) => analyze({ root: writeProject(files), fallow: 'off' }).modules;

/** Six statements and an interface of 2 each: one hides an IBAN checksum in a few dense expressions, one only copies its argument. */
const DENSE_DEEP = `export function validIban(iban: string): boolean {
	const moved = iban.slice(4) + iban.slice(0, 4);
	const digits = moved.split('').map((c) => (/[A-Z]/.test(c) ? String(c.charCodeAt(0) - 55) : c)).join('');
	return digits.match(/.{1,7}/g)!.reduce((rest, part) => Number(String(rest) + part) % 97, 0) === 1;
}
`;
const COPY = `export function same(id: string) {
	const a = id;
	const b = a;
	const c = b;
	const d = c;
	return d;
}
`;

describe('calibration regressions (Phase 4)', () => {
	it('counts operations, so dense expression code is deeper than statement-for-statement copying', () => {
		const [deep, copy] = ['src/iban.ts', 'src/same.ts'].map((p) => modules({ 'src/iban.ts': DENSE_DEEP, 'src/same.ts': COPY }).find((m) => m.path === p)!);
		expect(deep.metrics.implementationSize).toBe(copy.metrics.implementationSize);
		expect(deep.metrics.operations).toBeGreaterThan(copy.metrics.operations);
		expect(deep.components.depth).toBeLessThan(copy.components.depth);
	});
});
