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
		// exactly the commit the status goes on, not the pull request's head at the time of the job (review 1274-review-1 C-1)
		expect(comments).toContain('git -C trusted fetch origin "$SHA"');
		expect(comments).toContain('git -C trusted worktree add --detach ../pr "$SHA"');
		// run from trusted/, so the script resolves its packages only from main's node_modules; git works on the pull request's tree (C-3)
		expect(comments).toMatch(/\(cd trusted && GIT_DIR="\$\(git -C \.\.\/pr rev-parse --absolute-git-dir\)" GIT_WORK_TREE="\$GITHUB_WORKSPACE\/pr" /);
		// the screenshot comment names the commit of the run, whose files it published (C-2)
		expect(comments).not.toContain('pr.head.sha');
	});
});

describe('Kommentare aus Daten eines Forks (Fallback-Review von #1386)', () => {
	const comments = read('.github/workflows/pr-comments.yml');

	it('kürzt die Liste der gleich gebliebenen Seiten und beendet die Kürzung spätestens bei null Screenshots', () => {
		expect(comments).toContain("unchanged.join(', ').slice(0, 2000)");
		expect(comments).toContain('count > 0 && listed.length + same.length > 60000');
		// one title of shots.txt cannot fill the comment either (review 1274b-review-1 C-1)
		expect(comments).toContain("const [name, title] = line.split('\\t').map((part) => part.slice(0, 200));");
	});

	it('liest höchstens 300 Screenshots und kürzt den fertigen Kommentar unter die Grenze von GitHub (Fallback-Review von #1391)', () => {
		expect(comments).toMatch(/fs\.readFileSync\('ui-screenshots\/shots\.txt', 'utf8'\)\.split\('\\n'\)\.filter\(Boolean\)\.slice\(0, 300\)/);
		expect(comments).toContain(").replace(/@(?=[\\w-])/g, '@\\u200b').slice(0, 65000);");
		// the PDF pages come from the artifact too, and the job ends after 10 minutes whatever it reads (review 1274b-review-3 C-3)
		expect(comments).toMatch(/const pdfPages = fs\.readdirSync\('ui-screenshots'\)\.filter\(.*\)\.sort\(\)\.slice\(0, 300\);/);
		expect(comments).toMatch(/runs-on: ubuntu-latest\n {4}timeout-minutes: 10\n/);
	});

	it('macht @-Erwähnungen in beiden Kommentaren unwirksam', () => {
		expect(comments.split("replace(/@(?=[\\w-])/g, '@\\u200b')").length - 1).toBe(2);
	});
});
