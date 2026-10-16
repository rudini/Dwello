import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

/** Keeps open work in one place (CLAUDE.md, "Open work"): GitHub issues, non-functional rows in offene-punkte.md */
const skippedNames = [
	'node_modules',
	'.git',
	'.svelte-kit',
	'build',
	'coverage',
	'test-results',
	'playwright-report',
	'.features-gen'
];
const skippedPaths = [
	'docs/archive',
	'docs/reviews',
	'docs/design/personas',
	'.claude/skills',
	'src/lib/paraglide'
];

function files(dir: string, ext: RegExp): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = dir === '.' ? name : join(dir, name);
		if (skippedNames.includes(name) || skippedPaths.includes(path)) return [];
		if (statSync(path).isDirectory()) return files(path, ext);
		return ext.test(name) ? [path] : [];
	});
}

const marker = 'TODO(fachlich ' + 'prüfen';

describe('Offene Arbeit an einem Ort', () => {
	it('führt keine Checkliste ausserhalb des Plans', () => {
		const lists = files('.', /\.md$/).filter(
			(path) => path !== 'implementation_plan.md' && /^\s*- \[ \]/m.test(readFileSync(path, 'utf8'))
		);
		expect(lists).toEqual([]);
	});

	it('hält im Plan höchstens die aktuelle Session', () => {
		const sessions = readFileSync('implementation_plan.md', 'utf8').match(/^## Session/gm) ?? [];
		expect(sessions.length).toBeLessThanOrEqual(1);
	});

	it('nennt bei jedem fachlichen Marker sein Issue', () => {
		const withoutIssue = [
			'src',
			'backend/src',
			'backend/migrations',
			'backend/demo',
			'tests'
		].flatMap((dir) =>
			files(dir, /\.(ts|svelte|js|mjs|json|feature|sql)$/).flatMap((path) =>
				readFileSync(path, 'utf8')
					.split('\n')
					.map((line, i) => ({ line, at: `${path}:${i + 1}` }))
					.filter(({ line }) => line.includes(marker) && !line.includes(`${marker}, #`))
					.map(({ at }) => at)
			)
		);
		expect(withoutIssue).toEqual([]);
	});

	it('führt in offene-punkte.md nur nicht-funktionale Punkte', () => {
		const ids =
			readFileSync('docs/design/offene-punkte.md', 'utf8').match(/^\|\s*\**[A-Z]+-\d+[a-z]?/gm) ??
			[];
		expect(ids.filter((id) => !/^\|\s*\**(U|H|O)-/.test(id))).toEqual([]);
	});

	it('vergibt jede Zeilennummer in offene-punkte.md nur einmal', () => {
		const ids = (
			readFileSync('docs/design/offene-punkte.md', 'utf8').match(/^\|\s*\**[A-Z]+-\d+[a-z]?/gm) ?? []
		).map((id) => id.replace(/^\|\s*\**/, ''));
		expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
	});
});
