import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze.ts';
import { DEEP_MODULE, SHALLOW_MODULE, writeProject } from './helpers.ts';

const STORE = 'export const store = new Map<string, string>();\n';
const score = (files: Record<string, string>, path: string) =>
	analyze({ root: writeProject(files), fallow: 'off' }).modules.find((m) => m.path === path)!.score;

/** Internals nobody calls: they add statements and operations but no functionality. */
const DEAD_PADDING = `
function unusedA(n: number) {
	const doubled = n * 2;
	const tripled = n * 3;
	if (doubled > tripled) return doubled - tripled;
	return [doubled, tripled].map((x) => x + 1).reduce((a, b) => a + b, 0);
}
const unusedTable = [1, 2, 3, 4].map((n) => n * n).filter((n) => n % 2 === 0);
function unusedB(text: string) {
	const parts = text.split(',');
	const trimmed = parts.map((p) => p.trim());
	return trimmed.filter(Boolean).join(';');
}
`;

describe('gaming (Phase 4)', () => {
	it('padding a shallow module with dead internals does not lower its score', () => {
		const plain = score({ 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE }, 'src/shallow.ts');
		const padded = score({ 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE + DEAD_PADDING }, 'src/shallow.ts');
		expect(padded).toBe(plain);
	});

	it('splitting a deep module into tiny files makes the parts score higher than the whole', () => {
		const whole = score({ 'src/csv.ts': DEEP_MODULE }, 'src/csv.ts');
		const parts = {
			'src/csv/quote.ts': "export const QUOTE = '\"';\nexport const SEPARATOR = ',';\n",
			'src/csv/blank.ts': 'export function isBlank(line: string): boolean {\n\treturn line.trim().length === 0;\n}\n',
			'src/csv/cells.ts': 'export function finishCell(cells: string[], current: string): string {\n\tcells.push(current.trim());\n\treturn \'\';\n}\n',
			'src/csv/rows.ts': "import { isBlank } from './blank';\nexport function keepRow(line: string): boolean {\n\treturn !isBlank(line);\n}\n"
		};
		const partScores = Object.keys(parts).map((p) => score(parts, p));
		expect(Math.max(...partScores)).toBeGreaterThan(whole);
	});

	it('inlining pass-throughs (doing the work instead of forwarding it) lowers the score', () => {
		const forwarding = `import { store } from './store';
export class Names {
	get(id: string) {
		return store.get(id);
	}
	set(id: string, name: string) {
		return store.set(id, name);
	}
	remove(id: string) {
		return store.delete(id);
	}
}
`;
		const inlined = `export class Names {
	#names = new Map<string, string>();
	get(id: string) {
		return this.#names.get(id.trim().toLowerCase()) ?? 'Unbekannt';
	}
	set(id: string, name: string) {
		const key = id.trim().toLowerCase();
		if (!name.trim()) throw new Error('Name fehlt');
		this.#names.set(key, name.trim());
		return this;
	}
	remove(id: string) {
		return this.#names.delete(id.trim().toLowerCase());
	}
}
`;
		const before = score({ 'src/store.ts': STORE, 'src/names.ts': forwarding }, 'src/names.ts');
		const after = score({ 'src/names.ts': inlined }, 'src/names.ts');
		expect(after).toBeLessThan(before);
	});
});
