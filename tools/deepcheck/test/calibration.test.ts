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

	it('does not count re-exported names in the interface of a package entry (ky source/index.ts)', () => {
		const index = [
			"import { create } from './core';",
			"export { HTTPError, TimeoutError } from './errors';",
			"export type { Options, Hooks, Input, KyResponse } from './types';",
			"export * from './guards';",
			'const createInstance = (defaults: object) => {',
			'\tconst ky = create();',
			'\tfor (const method of ["get", "post"]) Object.assign(ky, { [method]: () => defaults });',
			'\treturn ky;',
			'};',
			'export default createInstance({});',
			''
		].join('\n');
		const report = analyze({ root: writeProject({ 'src/index.ts': index, 'src/core.ts': 'export const create = () => ({});\n' }), fallow: 'off' });
		const entry = report.modules.find((m) => m.path === 'src/index.ts')!;
		expect(entry.metrics.interfaceSize).toBe(1);
		expect(entry.eligible).toBe(false);
	});

	it('treats a module of exported types with a token of runtime code as type-only (immer types-external.ts)', () => {
		const types = Array.from({ length: 10 }, (_, i) => `export interface T${i} { v: number }`);
		const report = analyze({ root: writeProject({ 'src/types.ts': [...types, "export const NOTHING = Symbol('nothing');", ''].join('\n') }), fallow: 'off' });
		expect(report.excluded).toContainEqual({ path: 'src/types.ts', reason: 'type-only' });
	});

	it('still analyzes a module whose types surround real code, so types cannot hide it', () => {
		const types = Array.from({ length: 10 }, (_, i) => `export interface T${i} { v: number }`);
		const code = `export function a(x: number) {\n\tconst y = x * 2;\n\tif (y > 3) return y;\n\tconst z = y + 1;\n\treturn z * z;\n}\n`;
		const report = analyze({ root: writeProject({ 'src/types.ts': [...types, code].join('\n') }), fallow: 'off' });
		expect(report.modules.map((m) => m.path)).toContain('src/types.ts');
	});

	it('does not flag a new flat module of constants that has no callers yet (Phase 4 review: scored exactly 65)', () => {
		const labels = [
			"import type { Currency } from './currency';",
			"export const PAID = 'Bezahlt';",
			"export const OPEN = 'Offen';",
			"export const OVERDUE = 'Überfällig';",
			"export const REMINDED = 'Gemahnt';",
			"export const CANCELLED = 'Storniert';",
			"export type PaymentLabel = { text: string; currency: Currency };",
			''
		].join('\n');
		const report = analyze({ root: writeProject({ 'src/payment-labels.ts': labels, 'src/currency.ts': "export type Currency = 'CHF';\nexport const CHF = 'CHF';\n" }), fallow: 'off' });
		const m = report.modules.find((x) => x.path === 'src/payment-labels.ts')!;
		expect(m.score).toBeGreaterThanOrEqual(60);
		expect(m.flagged).toBe(false);
	});

	const STORE = "export const client = { load: (a: string) => a, save: (a: string, b: string) => a + b, drop: (a: string) => a, find: (a: string) => a };\n";
	const FORWARDERS = `import { client } from './client';
function load2(id: string) {
	return client.load(id);
}
function save2(id: string, data: string) {
	return client.save(id, data);
}
function drop2(id: string) {
	return client.drop(id);
}
function find2(id: string) {
	return client.find(id);
}
`;

	it('keeps flagging a pass-through facade exported through an export list (review round 2)', () => {
		const report = analyze({ root: writeProject({ 'src/client.ts': STORE, 'src/facade.ts': `${FORWARDERS}export { load2, save2, drop2, find2 };\n` }), fallow: 'off' });
		const m = report.modules.find((x) => x.path === 'src/facade.ts')!;
		expect(m.metrics.passThroughs).toHaveLength(4);
		expect(m.flagged).toBe(true);
	});

	it('keeps flagging a pass-through facade exported as a shorthand object (review round 2)', () => {
		const report = analyze({ root: writeProject({ 'src/client.ts': STORE, 'src/facade.ts': `${FORWARDERS}export const facade = { load2, save2, drop2, find2 };\n` }), fallow: 'off' });
		const m = report.modules.find((x) => x.path === 'src/facade.ts')!;
		expect(m.metrics.interfaceSize).toBe(10);
		expect(m.metrics.passThroughs).toHaveLength(4);
		expect(m.flagged).toBe(true);
	});

	it('does not flag a flat module of UI copy whose only signal is an internal type (review round 2)', () => {
		const copy = [
			'type Hint = { title: string; help: string };',
			"export const METER_NUMBER: Hint = { title: 'Zählernummer', help: 'Steht auf dem Zähler.' };",
			"export const METER_READING: Hint = { title: 'Zählerstand', help: 'Ohne Nachkommastellen.' };",
			"export const METER_DATE: Hint = { title: 'Ablesedatum', help: 'Tag der Ablesung.' };",
			"export const METER_UNIT: Hint = { title: 'Einheit', help: 'kWh oder m³.' };",
			"export const METER_NOTE: Hint = { title: 'Bemerkung', help: 'Freiwillig.' };",
			''
		].join('\n');
		const m = analyze({ root: writeProject({ 'src/lib/copy/meter-copy.ts': copy }), fallow: 'off' }).modules[0];
		expect(m.metrics.leakyExports.length).toBeGreaterThan(0);
		expect(m.flagged).toBe(false);
	});

	it('does not call a directory of one-constant files classitis (translations per language; review 3)', () => {
		const files = Object.fromEntries(
			['de', 'fr', 'it', 'en', 'rm'].map((lang) => [`src/pdf/i18n/${lang}.ts`, `export const ${lang} = { title: 'Nebenkosten ${lang}', total: 'Total', due: 'Fällig' };\n`])
		);
		const report = analyze({ root: writeProject(files), fallow: 'off' });
		expect(report.modules.filter((m) => m.flagged || m.metrics.classitis).map((m) => m.path)).toEqual([]);
	});
});
