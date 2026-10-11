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

	describe('splitting a module into tiny files that one module assembles', () => {
		const PARTS = {
			'src/csv/blank.ts': 'export function isBlank(line: string): boolean {\n\treturn line.trim().length === 0;\n}\n',
			'src/csv/cells.ts': "export function finishCell(cells: string[], current: string): string {\n\tcells.push(current.trim());\n\treturn '';\n}\n",
			'src/csv/split.ts': "export function splitLines(text: string): string[] {\n\treturn text.split('\\n');\n}\n"
		};
		const parser = (parts: string[]) =>
			`${parts.map((p) => `import { ${p} } from './csv/${{ isBlank: 'blank', finishCell: 'cells', splitLines: 'split' }[p]}';`).join('\n')}
export function parse(text: string): string[][] {
	const rows: string[][] = [];
	for (const line of ${parts.includes('splitLines') ? 'splitLines(text)' : "text.split('\\n')"}) {
		if (${parts.includes('isBlank') ? 'isBlank(line)' : '!line.trim()'}) continue;
		const cells: string[] = [];
		let current = '';
		for (const ch of line) {
			if (ch === ',') current = ${parts.includes('finishCell') ? 'finishCell(cells, current)' : "(cells.push(current), '')"};
			else current += ch;
		}
		rows.push([...cells, current]);
	}
	return rows;
}
`;
		const report = (parts: string[]) => analyze({ root: writeProject({ ...PARTS, 'src/parse.ts': parser(parts) }), fallow: 'off' });

		it('flags the parts as classitis although fewer than five files share a directory (review 3)', () => {
			const parts = report(['isBlank', 'finishCell', 'splitLines']).modules.filter((m) => m.path.startsWith('src/csv/'));
			expect(parts.every((m) => m.metrics.classitis)).toBe(true);
			// One flagged piece fails the gate; the smallest piece (one comparison) stays just below the threshold.
			expect(parts.filter((m) => m.flagged).map((m) => m.path).sort()).toEqual(['src/csv/cells.ts', 'src/csv/split.ts']);
		});

		it('leaves shared one-function utilities alone: from different folders, or also used elsewhere (review 4)', () => {
			const util = (name: string) => `export function ${name}(v: string): string {\n\treturn v.trim().toLowerCase();\n}\n`;
			const page = (from: string[]) => `${from.map((f, i) => `import { u${i} } from '${f}';`).join('\n')}\nexport const all = (v: string) => [u0(v), u1(v), u2(v)];\n`;
			const scattered = analyze({
				root: writeProject({
					'src/math/clamp.ts': util('u0'),
					'src/text/slugify.ts': util('u1'),
					'src/format/chf.ts': util('u2'),
					'src/page.ts': page(['./math/clamp', './text/slugify', './format/chf'])
				}),
				fallow: 'off'
			});
			const shared = analyze({
				root: writeProject({
					'src/utils/clamp.ts': util('u0'),
					'src/utils/slugify.ts': util('u1'),
					'src/utils/chf.ts': util('u2'),
					'src/page.ts': page(['./utils/clamp', './utils/slugify', './utils/chf']),
					'src/other.ts': "import { u0 } from './utils/clamp';\nexport const one = (v: string) => u0(v);\n"
				}),
				fallow: 'off'
			});
			const pieces = [...scattered.modules, ...shared.modules].filter((m) => !['src/page.ts', 'src/other.ts'].includes(m.path));
			expect(pieces.some((m) => m.metrics.classitis || m.flagged)).toBe(false);
		});

		it('leaves two small helpers that one module imports alone', () => {
			const parts = report(['isBlank', 'finishCell']).modules.filter((m) => m.path.startsWith('src/csv/'));
			expect(parts.some((m) => m.metrics.classitis || m.flagged)).toBe(false);
		});
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

	it('keeps live destructured declarations (Phase 4 review)', () => {
		const code = "const { a, b } = { a: 1, b: 2 };\nexport function sum(x: number) {\n\treturn x + a + b;\n}\n";
		const m = analyze({ root: writeProject({ 'src/m.ts': code }), fallow: 'off' }).modules[0];
		expect(m.metrics.implementationSize).toBe(3);
	});

	it('is not fooled by a parameter, local or property that shares a dead function name (Phase 4 review)', () => {
		const shadowing = `function pad(n: number) {
	const doubled = n * 2;
	const tripled = n * 3;
	return doubled + tripled;
}
export function useIt(pad: number, o: { pad: number }) {
	const local = pad + o.pad;
	return local;
}
`;
		const m = analyze({ root: writeProject({ 'src/m.ts': shadowing }), fallow: 'off' }).modules[0];
		// useIt: declaration, const, return = 3; the dead pad() and its 3 statements are left out
		expect(m.metrics.implementationSize).toBe(3);
	});

	it('is not fooled by a type-only use of a dead function (typeof; review 3)', () => {
		const plain = analyze({ root: writeProject({ 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE }), fallow: 'off' }).modules.find((m) => m.path === 'src/shallow.ts')!;
		const padded = analyze({
			root: writeProject({ 'src/store.ts': STORE, 'src/shallow.ts': `${SHALLOW_MODULE}${DEAD_PADDING}export type P = typeof unusedA;\n` }),
			fallow: 'off'
		}).modules.find((m) => m.path === 'src/shallow.ts')!;
		expect(padded.metrics.implementationSize).toBe(plain.metrics.implementationSize);
	});
});
