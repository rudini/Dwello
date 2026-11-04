import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const ROOT = new URL('../../', import.meta.url);
const FOLDER = new URL('docs/design/personas/', ROOT);
const readme = readFileSync(new URL('README.md', FOLDER), 'utf8');

// workflow review 2026-11-04, 1: a cleanup deleted demo-records.md while «Who saves» still named it
describe('persona README', () => {
	it('names only files that exist, from the repository root or its own folder', () => {
		const named = [...readme.matchAll(/`([\w./-]+\.(?:md|sh|ts|sql|json))`/g)].map((m) => m[1]);
		expect(named).toContain('demo-records.md');
		const exists = (path: string) => existsSync(new URL(path, ROOT)) || existsSync(new URL(path, FOLDER));
		expect(named.filter((path) => !exists(path))).toEqual([]);
	});
});
