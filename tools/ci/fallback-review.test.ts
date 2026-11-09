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

// gh answers pull request 7 with head «headsha»; `reviews` holds a real Copilot review when asked for one; the
// comments hold the reviewer report, updated at REPORT_AT, from the REPORT_CALL-th call on
const gh = (copilotReviewed: boolean) => `#!/bin/bash
echo "gh $*" >> "$LOG"
report() {
  echo x >> report-calls
  if [ "$(wc -l < report-calls)" -lt "$REPORT_CALL" ]; then echo '[]'; return; fi
  jq -n --arg at "$REPORT_AT" '[{user: {type: "Bot"}, updated_at: $at,
    body: "<!-- review-report -->\\n## Reviewer report\\nNeue Tabelle: mieter"}]'
}
case "$*" in
  *--paginate\\ repos/rudini/Dwello/issues/7/comments*) report ;;
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
function run({
	copilotReviewed = false,
	apiKey = 'key',
	reportCall = 1,
	reportAt = '2026-11-09T10:02:00Z'
} = {}) {
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
			MAX_FILES_BYTES: '200000',
			CI_DONE: '2026-11-09T10:00:00Z',
			REPORT_CALL: String(reportCall),
			REPORT_AT: reportAt
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
	const request = (options?: Parameters<typeof run>[0]) =>
		JSON.parse(readFileSync(join(run(options).dir, 'request.json'), 'utf8'));

	it('gibt MiniMax den Prüfbericht des Pull Requests mit', () => {
		expect(request().messages[1].content).toContain('## Reviewer report\nNeue Tabelle: mieter');
	});

	it('wartet auf den Prüfbericht, den «Pull request comments» erst nach CI schreibt', () => {
		expect(request({ reportCall: 3 }).messages[1].content).toContain('Neue Tabelle: mieter');
	});

	it('gibt MiniMax keinen Prüfbericht eines früheren CI-Laufs mit', () => {
		const content = request({ reportAt: '2026-11-09T09:00:00Z' }).messages[1].content;
		expect(content).not.toContain('Neue Tabelle: mieter');
		expect(content).toContain('(no reviewer report)');
	});

	it('gibt MiniMax die Abschnitte Type, Decisions und Risks des PR-Textes mit', () => {
		expect(request().messages[1].content).toContain('## Type\nfix\n## Decisions\nKeine\n## Risks\nKeine');
	});

	it('lässt MiniMax Änderungen melden, die die Erklärung nicht nennt', () => {
		expect(request().messages[0].content).toMatch(/changes? (that )?the explanation does not name/);
	});
});
