import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const WORKFLOW = fileURLToPath(new URL('../../.github/workflows/fallback-review.yml', import.meta.url));

/** The script of the step «Review the diff when Copilot did not», as the runner gets it */
function script() {
	const lines = readFileSync(WORKFLOW, 'utf8').split('\n');
	const body = lines.slice(lines.findIndex((line) => line.trimEnd().endsWith('run: |')) + 1);
	const end = body.findIndex((line) => line.trim() !== '' && !line.startsWith(' '.repeat(10)));
	return body
		.slice(0, end < 0 ? undefined : end)
		.map((line) => line.slice(10))
		.join('\n');
}

// gh answers pull request 7 with head «headsha»; `reviews` holds a real Copilot review when asked for one
const gh = (copilotReviewed: boolean) => `#!/bin/bash
echo "gh $*" >> "$LOG"
case "$*" in
  *issues/7/comments\\ --jq*) printf '%s\\n' '<!-- review-report -->' '## Reviewer report' 'Neue Tabelle: mieter' ;;
  *statuses/*|*issues/*/comments*|*reviews\\ -f\\ event*) ;;
  *pulls/7/reviews*) ${copilotReviewed ? `echo '"## Pull request overview"'` : ':'} ;;
  *requested_reviewers*) echo false ;;
  *pulls/7/files*) [[ "$*" == *--jq* ]] || echo '[]' ;;
  *contents/*) exit 1 ;;
  *--jq\\ .draft*) echo false ;;
  *--jq\\ .head.sha*) echo headsha ;;
  *pulls/7\\ --jq*) printf '%s\\n' '# Titel' '## Type' 'fix' '## Decisions' 'Keine' '## Risks' 'Keine' ;;
esac
`;

/** Runs the step after CI finished and returns its folder (request.json) and the gh calls it made */
function run({ copilotReviewed = false, apiKey = 'key' } = {}) {
	const dir = mkdtempSync(join(tmpdir(), 'fallback-review-'));
	const bin = join(dir, 'bin');
	mkdirSync(bin);
	const tool = (name: string, body: string) => {
		writeFileSync(join(bin, name), body);
		chmodSync(join(bin, name), 0o755);
	};
	tool('gh', gh(copilotReviewed));
	tool('sleep', '#!/bin/bash\n');
	tool('curl', `#!/bin/bash\necho 'data: {"choices":[{"delta":{"content":"No issues found"}}]}'\n`);
	const log = join(dir, 'gh.log');
	writeFileSync(log, '');
	spawnSync('bash', ['-e', '-c', script()], {
		cwd: dir,
		env: {
			PATH: `${bin}:${process.env.PATH}`,
			LOG: log,
			PR: '7',
			GH_REPO: 'rudini/Dwello',
			GITHUB_EVENT_NAME: 'workflow_run',
			GITHUB_SERVER_URL: 'https://github.com',
			GITHUB_REPOSITORY: 'rudini/Dwello',
			GITHUB_RUN_ID: '1',
			MINIMAX_API_KEY: apiKey,
			MODEL: 'MiniMax',
			REASONING_EFFORT: 'high',
			MAX_DIFF_BYTES: '400000',
			MAX_FILES_BYTES: '200000'
		}
	});
	return { dir, calls: readFileSync(log, 'utf8').split('\n') };
}

/** The commit statuses the step set */
const statuses = (options?: Parameters<typeof run>[0]) =>
	run(options).calls.filter((call) => call.includes('/statuses/'));

const passed = expect.stringMatching(
	/statuses\/headsha -f state=success -f context=Outside review -f description=/
);

// #1121: the ruleset of main requires «Outside review», so a pull request merges only after its review
describe('fallback-review: Status «Outside review»', () => {
	it('setzt den Status, wenn Copilot schon geprüft hat', () => {
		expect(statuses({ copilotReviewed: true })).toEqual([passed]);
	});

	it('setzt den Status, nachdem MiniMax geprüft hat', () => {
		expect(statuses()).toEqual([passed]);
	});

	it('setzt den Status, wenn die Prüfung mit «No review» endet', () => {
		expect(statuses({ apiKey: '' })).toEqual([passed]);
	});
});

// #1275: MiniMax compares the explanation (reviewer report, Type, Decisions, Risks) with the diff
describe('fallback-review: Erklärung gegen den Diff', () => {
	const request = () => JSON.parse(readFileSync(join(run().dir, 'request.json'), 'utf8'));

	it('gibt MiniMax den Prüfbericht des Pull Requests mit', () => {
		expect(request().messages[1].content).toContain('## Reviewer report\nNeue Tabelle: mieter');
	});

	it('gibt MiniMax die Abschnitte Type, Decisions und Risks des PR-Textes mit', () => {
		expect(request().messages[1].content).toContain('## Type\nfix\n## Decisions\nKeine\n## Risks\nKeine');
	});

	it('lässt MiniMax Änderungen melden, die die Erklärung nicht nennt', () => {
		expect(request().messages[0].content).toMatch(/changes? (that )?the explanation does not name/);
	});
});
