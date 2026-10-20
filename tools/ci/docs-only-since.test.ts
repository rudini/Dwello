import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = fileURLToPath(new URL('./docs-only-since.mjs', import.meta.url));

let root: string;

const git = (...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

/** Commits the file and answers the new commit */
function commit(path: string) {
	mkdirSync(dirname(join(root, path)), { recursive: true });
	writeFileSync(join(root, path), `${path} ${Math.random()}`);
	git('add', '.');
	git('commit', '-qm', path);
	return git('rev-parse', 'HEAD');
}

/** Whether the script finds only documentation changed from one of the green commits to the head */
const docsOnly = (head: string, ...green: string[]) =>
	spawnSync('node', [SCRIPT, head, ...green], { cwd: root }).status === 0;

beforeEach(() => {
	root = mkdtempSync(join(tmpdir(), 'docs-only-since-'));
	git('init', '-q');
	git('config', 'user.email', 'test@example.com');
	git('config', 'user.name', 'Test');
});

describe('docs-only-since', () => {
	it('meldet nur Dokumentation seit dem letzten grünen Commit', () => {
		const green = commit('src/app.ts');
		commit('docs/reviews/report.md');
		const head = commit('implementation_plan.md');
		expect(docsOnly(head, green)).toBe(true);
	});

	it('meldet Code seit dem letzten grünen Commit', () => {
		const green = commit('src/app.ts');
		commit('docs/reviews/report.md');
		const head = commit('backend/src/service.ts');
		expect(docsOnly(head, green)).toBe(false);
	});

	it('findet unter mehreren grünen Commits den passenden Vorfahren', () => {
		const older = commit('src/app.ts');
		const newer = commit('src/other.ts');
		const head = commit('docs/note.md');
		expect(docsOnly(head, older, newer)).toBe(true);
	});

	it('übergeht einen grünen Commit, der kein Vorfahre ist', () => {
		const base = commit('src/app.ts');
		git('checkout', '-qb', 'side');
		const side = commit('docs/note.md');
		git('checkout', '-q', '-');
		const head = commit('src/changed.ts');
		expect(docsOnly(head, side)).toBe(false);
		expect(docsOnly(head, base)).toBe(false);
	});

	it('meldet nichts ohne grünen Commit', () => {
		const head = commit('docs/note.md');
		expect(docsOnly(head)).toBe(false);
	});

	it('meldet nichts, wenn der Kopf selbst grün war', () => {
		const head = commit('src/app.ts');
		expect(docsOnly(head, head)).toBe(false);
	});
});
