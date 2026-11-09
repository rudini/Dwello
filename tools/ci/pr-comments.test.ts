import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(fileURLToPath(new URL(`../../${path}`, import.meta.url)), 'utf8');
const ci = read('.github/workflows/ci.yml');
/** One job of ci.yml, up to the next job */
function job(name: string) {
	const rest = ci.slice(ci.indexOf(`\n  ${name}:\n`) + 1);
	const end = rest.slice(1).search(/\n {2}[a-z-]+:\n/);
	return end === -1 ? rest : rest.slice(0, end + 1);
}

describe('Kommentare zu Pull Requests aus Forks (#1274)', () => {
	it('baut Screenshots und Prüfbericht im Lauf des Pull Requests für jeden Pull Request ohne Schreibrecht', () => {
		for (const name of ['ui-screenshots', 'review-comment']) {
			const text = job(name);
			expect(text).not.toContain('head.repo.full_name == github.repository');
			expect(text).not.toMatch(/: write/);
			expect(text).not.toContain('git push');
			expect(text).not.toContain('createComment');
		}
		expect(job('ui-screenshots')).toContain('persist-credentials: false');
		expect(job('ui-screenshots')).toMatch(/uses: actions\/upload-artifact@v7\n {8}with:\n {10}name: ui-screenshots/);
	});

	const comments = read('.github/workflows/pr-comments.yml');

	it('schreibt die Kommentare aus einem Workflow von main, der nur die Artefakte des Laufs liest', () => {
		expect(comments).toMatch(/on:\n {2}workflow_run:\n {4}workflows: \[CI\]\n {4}types: \[completed\]/);
		expect(comments).toMatch(/^permissions: \{\}$/m);
		expect(comments).toContain('run-id: ${{ github.event.workflow_run.id }}');
		// the pull request by the run's head commit, not by a number the artifact could claim
		expect(comments).toContain('select(.head.sha == env.SHA)');
		for (const marker of ['<!-- review-report -->', '<!-- ui-screenshots -->']) expect(comments).toContain(marker);
	});

	it('führt keinen Code des Pull Requests oder seiner Artefakte aus', () => {
		const runs = comments.split('\n').filter((line) => /\b(bun|bunx|node|npm|npx|sh|bash|source)\b/.test(line) && !line.trim().startsWith('#'));
		expect(runs.filter((line) => /\b(node|bun|bunx) /.test(line))).toEqual([
			expect.stringContaining('bun install --frozen-lockfile'),
			expect.stringContaining('node "$GITHUB_WORKSPACE/trusted/tools/open-work/check-issues.mjs"')
		]);
		expect(comments).toMatch(/- run: bun install --frozen-lockfile\n(?: {8}.*\n)*? {8}working-directory: trusted\n/);
		// only PNG files of the artifact reach the branch ui-screenshots
		expect(comments).toContain("cp artifacts/ui-screenshots/ui-screenshots/*.png");
	});

	it('prüft Änderungen an Prüfdateien mit dem Skript von main und setzt dafür einen Status am Pull Request', () => {
		expect(comments).toContain('-f context="Gate check (main)"');
		expect(comments).toMatch(/git -C trusted fetch origin "pull\/\$PR\/head"/);
	});
});
