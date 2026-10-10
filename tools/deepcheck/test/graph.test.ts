import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze.ts';
import { DEEP_MODULE, writeProject } from './helpers.ts';

const coupling = (files: Record<string, string>) =>
	Object.fromEntries(
		analyze({ root: writeProject(files), fallow: 'off' }).modules.map((m) => [m.path, [m.metrics.fanIn, m.metrics.fanOut]])
	);

describe('coupling from the import graph', () => {
	it('counts distinct importers (fan-in) and distinct imported project modules (fan-out)', () => {
		expect(
			coupling({
				'src/deep.ts': DEEP_MODULE,
				'src/a.ts': "import { parseCsv } from './deep';\nimport { parseCsv as p } from './deep';\nimport 'node:fs';\nexport const a = () => parseCsv('') && p('');\n",
				'src/b.ts': "import { parseCsv } from './deep.ts';\nimport { a } from './a';\nexport const b = () => parseCsv('') && a();\n"
			})
		).toEqual({ 'src/deep.ts': [2, 0], 'src/a.ts': [1, 1], 'src/b.ts': [0, 2] });
	});

	it('resolves tsconfig paths of the nearest tsconfig', () => {
		const result = coupling({
			'backend/tsconfig.json': JSON.stringify({ compilerOptions: { baseUrl: '.', paths: { '@/*': ['./src/*'] } } }),
			'backend/src/deep.ts': DEEP_MODULE,
			'backend/src/use.ts': "import { parseCsv } from '@/deep';\nexport const use = () => parseCsv('');\n"
		});
		expect(result['backend/src/deep.ts']).toEqual([1, 0]);
	});

	it('counts Svelte components as importers but not tests', () => {
		const result = coupling({
			'src/deep.ts': DEEP_MODULE,
			'src/View.svelte': "<script lang=\"ts\">\n\timport { parseCsv } from './deep';\n</script>\n",
			'src/deep.test.ts': "import { parseCsv } from './deep';\nparseCsv('');\n"
		});
		expect(result['src/deep.ts']).toEqual([1, 0]);
	});

	it('counts framework entries and suppressed modules as importers', () => {
		const result = coupling({
			'src/deep.ts': DEEP_MODULE,
			'src/routes/+page.server.ts': "import { parseCsv } from '../deep';\nexport const load = () => parseCsv('');\n",
			'src/legacy.ts': "// deepcheck-ignore-file -- legacy\nimport { parseCsv } from './deep';\nexport const l = () => parseCsv('');\n"
		});
		expect(result['src/deep.ts']).toEqual([2, 0]);
	});

	it('gives the importers of a barrel to the modules it re-exports', () => {
		const result = coupling({
			'src/lib/deep.ts': DEEP_MODULE,
			'src/lib/index.ts': "export * from './deep';\n",
			'src/a.ts': "import { parseCsv } from './lib';\nexport const a = () => parseCsv('');\n",
			'src/b.ts': "import { parseCsv } from './lib/index';\nexport const b = () => parseCsv('');\n"
		});
		expect(result['src/lib/deep.ts']).toEqual([2, 0]);
	});

	it('warns when a tsconfig extends a file that does not exist, e.g. before svelte-kit sync', () => {
		const root = writeProject({
			'tsconfig.json': JSON.stringify({ extends: './.svelte-kit/tsconfig.json' }),
			'src/deep.ts': DEEP_MODULE
		});
		expect(analyze({ root, fallow: 'off' }).warnings).toEqual([
			expect.stringMatching(/^tsconfig\.json: .*\.svelte-kit\/tsconfig\.json.* not found.*fan-in and fan-out may be too low/)
		]);
	});
});
