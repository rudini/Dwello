import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const dir = fileURLToPath(new URL('../../.github/workflows/', import.meta.url));
const uses = readdirSync(dir)
	.filter((file) => /\.ya?ml$/.test(file))
	.flatMap((file) => [...readFileSync(dir + file, 'utf8').matchAll(/^\s*(?:-\s+)?uses:\s*(\S+)(.*)$/gm)].map(([, action, rest]) => ({ file, action, rest })))
	.filter((u) => !u.action.startsWith('./'));

describe('Aktionen der Workflows (#1378)', () => {
	it('bindet jede fremde Aktion an einen Commit, mit der Version als Kommentar, die Dependabot aktualisiert', () => {
		expect(uses.length).toBeGreaterThan(0);
		expect(uses.filter((u) => !/^[\w.-]+\/[\w./-]+@[0-9a-f]{40}$/.test(u.action) || !/^\s+# v\d+\.\d+\.\d+$/.test(u.rest))).toEqual([]);
		expect(readFileSync(fileURLToPath(new URL('../../.github/dependabot.yml', import.meta.url)), 'utf8')).toMatch(/^ {2}- package-ecosystem: github-actions\n {4}directory: \/\n/m);
	});
});
