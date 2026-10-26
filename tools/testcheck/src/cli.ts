import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { analyzeSource, type Finding } from './analyze.ts';

const TEST_FILE = /\.(test|spec)\.[cm]?tsx?$/;
const SKIP_DIR = new Set(['node_modules', '.git', '.svelte-kit', 'dist', 'build', 'coverage']);

export function testFiles(path: string): string[] {
	if (!statSync(path).isDirectory()) return TEST_FILE.test(path) ? [path] : [];
	return readdirSync(path).flatMap((e) => (SKIP_DIR.has(e) ? [] : testFiles(join(path, e))));
}

export function scan(paths: string[], root = process.cwd()): Finding[] {
	return paths.flatMap(testFiles).flatMap((f) => analyzeSource(relative(root, f), readFileSync(f, 'utf8')));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const [cmd, ...args] = process.argv.slice(2);
	if (cmd === 'scan') for (const f of scan(args.length ? args : ['.'])) console.log(`${f.file}:${f.line} ${f.rule} ${f.test}: ${f.message}${f.code ? ` [${f.code}]` : ''}`);
}
